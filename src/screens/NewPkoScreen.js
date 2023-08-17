import React, { useState, useEffect } from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  BackHandler,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { consts } from '../consts/const';
import HeaderBar from '../components/HeaderBar';
import { styles } from '../styles/styles';
import { DefaultBtn } from '../components/DefaultBtn';
import { IconBtn } from '../components/IconBtn';
import { DefaultTextInput } from '../components/DefaultTextInput';
import { DefaultCheckBoxWithText } from '../components/DefaultCheckBoxWithText';
import { CorrectDate, GetDate } from '../utils/GetDate';
import { ClientPicker } from '../components/modals/ClientPicker';
import { StorePicker } from '../components/modals/StorePicker';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { addNewItemsToPKO, addNewItemsToUnsyncPKO, createTablePKO, deleteItem, getAllItems, getDBConnection } from '../db/db';
import { SupplierPicker } from '../components/modals/SupplierPicker';
import { GetCashOrders, SendNewCashOrder } from '../API/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { Loading } from '../components/modals/Loading';
import { SureModal } from '../components/modals/SureModal';
import { ClientPickerAll } from '../components/modals/ClientPickerAnotherEdition';

export const NewPkoScreen = ({navigation}) => {

    const [clientPickerVisible, setClientPickerVisible] = useState(false);
    const [storePickerVisible, setStorePickerVisible] = useState(false);
    const [supplierPickerVisible, setSupplierPickerVisible] = useState(false);
    const [chosenClient, setChosenClient] = useState({});
    const [readyClient, setReadyClient] = useState({});
    const [chosenStore, setChosenStore] = useState({});
    const [chosenSupplier, setChosenSupplier] = useState({});
    const [client, setClient] = useState({});
    const [dbClients, setDBClients] = useState([]);
    const [dbSuppliers, setDBSuppliers] = useState([]);
    const [sum, setSum] = useState(0);
    const [comment, setComment] = useState('');
    const [loading,setLoading] = useState(false);
    const [sureModal, setSureModal] = useState(false);
    const [sureModalText, setSureModalText] = useState('');
    const [sureModalValue, setSureModalValue] = useState('');
    const [stores, setStores] = useState([]);
    const [docType, setDocType] = useState(0);

    function sureModalVis(value, type){
        if (type){
            setSureModalValue(type);
            switch (type){
                case 'send':
                    setSureModalText('Вы уверены, что хотите отправить?');
                    break;
                case 'return':
                    setSureModalText('Вы уверены, что хотите выйти? Данные будут утеряны.');
                    break;
            }
        }
        setSureModal(value);
    }
    function sureModalPicked(){
        console.log(sureModalValue)
        switch (sureModalValue){
            case 'send':
                sendRequest();
                break;
            case 'return':
                navigation.replace('PKOScreen');
                break;
        }
    }

    function clientPickerVisibility(value){
        setClientPickerVisible(value);
    }
    function storePickerVisibility(value){
        setStorePickerVisible(value);
    }
    function supplierPickerVisibility(value){
        setSupplierPickerVisible(value);
    }
    async function chosenClientHandler(data){
        //console.log(data)
        if (data.stores != 'null'){
            await setChosenClient(JSON.parse(data.stores));
            await setClient(data);
            await setStorePickerVisible(true);
        }
    }
    useEffect(() => {
        async function getDataFromDB(){
            const db = await getDBConnection();
            const clientsToAdd = await getAllItems(db, 'clients');
            var suppliers = await getAllItems(db, 'suppliers');
            setDBClients(clientsToAdd.filter(i => i.total_debt <= 0));
            setDBSuppliers(suppliers);
            console.log(suppliers);
            var storesToAdd = [];
            await clientsToAdd.map(i => {
                if (i.stores.length && i.stores != 'null'){
                    i.stores = JSON.parse(i.stores);
                    i.stores.map(l => {
                        l.client_guid = i.guid;
                        l.client_name = i.name;
                        storesToAdd.push(l);
                    })
                }
            })
            await setStores(storesToAdd);
        }
        //console.log(dbProducts)
        getDataFromDB()
    }, []);
    

    function chooseStore(store){
        setReadyClient(store);
        setClientPickerVisible(false);
    }
    function chooseSupplier(sup){
        console.log(sup)
        setChosenSupplier(sup);
        setSupplierPickerVisible(false);
    }
    function goBack(){
        navigation.goBack();
    }
    async function sendRequest(){
        if (readyClient.client_id && sum > 0 && chosenSupplier.id){
            const token = await AsyncStorage.getItem('@token');
            setLoading(true);
            const db = await getDBConnection();
            var reqUnsync = {
                "client_id": readyClient.client_id,
                "client_guid": readyClient.client_guid,
                "store_id": readyClient.id,
                "store_guid": readyClient.guid,
                "organization_id": chosenSupplier.id,
                "organization_guid": chosenSupplier.guid,
                "amount": sum,
                "doc_type": docType, // 0 или 1, 0 - cash, 1 - invoice
                "exported": 0, // 0 или 1
                "comment": comment.replace(/[']+/g, "''")
            }
            var req = {};
            Object.assign(req, reqUnsync);
            console.log(req);
            reqUnsync.client_name = readyClient.client_name;
            reqUnsync.store_name = readyClient.name;
            reqUnsync.supplier_name = chosenSupplier.name;
            reqUnsync.supplier_id = chosenSupplier.id;
            reqUnsync.supplier_guid = chosenSupplier.guid;
            reqUnsync.sync_status = false;
            reqUnsync.order_date = CorrectDate(GetDate('today'));
            reqUnsync = [reqUnsync];
            var reqU = await addNewItemsToUnsyncPKO(db, 'unsyncPKO', reqUnsync);
            var resp = await SendNewCashOrder(token, req);
            /* var resp = {
                'status' : 'not_ok'
            } */
            
            if (resp.status == 'ok'){
                var requests = await GetCashOrders(token);
                var clientsToAdd = await getAllItems(db, 'clients');
                var suppliers = await getAllItems(db, 'suppliers');
                await createTablePKO(db, 'pko');
                await requests.cash_order_receipts.map(i => {
                    var supplier = suppliers.find(s => s.id == i.organization_id);
                    var client = clientsToAdd.find(c => c.id == i.client_id);
                    if (client)
                        i.client_name = client.name.replace(/[']+/g, "''");
                    else
                        i.client_name = 'noname'
                    if (client)
                        if (client.stores != 'null')
                          if (JSON.parse(client.stores).find(s => s.id == i.store_id))
                            i.store_name = JSON.parse(client.stores).find(s => s.id == i.store_id).name.replace(/[']+/g, "''");
                          else
                            i.store_name = 'null';
                    else
                        i.store_name = 'null'
                    i.supplier_name = supplier.name;
                    i.supplier_id = supplier.id;
                    i.supplier_guid = supplier.guid;
                    i.order_date = i.created_at.substring(0, 10);
                    i.comment = i.comment.replace(/[']+/g, "''");
                })
                await addNewItemsToPKO(db, 'pko', requests.cash_order_receipts);
                await deleteItem(db, 'unsyncPKO', reqU[0].insertId);
                //navigation.navigate('PKOScreen');
                navigation.replace('PKOScreen');
                Toast.show('ПКО успешно отправлен');
            }
            else{
                setLoading(false);
                Toast.show('ПКО сохранен на телефоне');
                navigation.replace('PKOScreen');
            }
            setLoading(false);
            
        }
        else
            Toast.show('Не указан клиент, поставщик или сумма')
        
    }
    function setterSum(value){
        setSum(parseFloat(value));
    }
    function setterComment(value){
        setComment(value);
    }
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => backHandler.remove();
    }, [])

    return(
        <View style={{height: '100%'}}>
            <View style={styles.listContainer}>
                <View
                    style={style.scroll}
                >
                    <ScrollView
                        
                    >
                        <DefaultCheckBoxWithText
                            text={consts.TYPE_OF_DOCUMENT}
                            onChange={(value) => {
                                if (value)
                                    setDocType(1)
                                else
                                    setDocType(0)
                            }}
                        />
                        <Pressable
                            onPress={() => clientPickerVisibility(true)}
                        >
                            <DefaultTextInput
                                placeholder={'Клиент'}
                                editable={false}
                                value={readyClient.name}
                                mt={15}
                            />
                        </Pressable>
                        
                        <Pressable
                            onPress={() => supplierPickerVisibility(true)}
                        >
                            <DefaultTextInput
                                placeholder={'Поставщик'}
                                editable={false}
                                value={chosenSupplier.name}
                                mt={15}
                            />
                        </Pressable>
                        <DefaultTextInput
                            placeholder={'Сумма'}
                            keyboardType='numeric'
                            onEndEditing={setterSum}
                            mt={15}
                        />
                        <DefaultTextInput
                            placeholder={'Комментарий'}
                            onEndEditing={setterComment}
                            mt={15}
                        />
                    </ScrollView>
                </View>

                <View style={style.listFooter}>
                    <DefaultBtn
                        text={consts.BACK}
                        upperText={true}
                        callback={() => sureModalVis(true, 'return')}
                        flex={1}
                    />
                    <DefaultBtn
                        text={consts.SEND}
                        upperText={true}
                        callback={() => sureModalVis(true, 'send')}
                        flex={1}
                    />
                </View>
            </View>
            {/* <ClientPicker
                setVisible={clientPickerVisibility}
                visible={clientPickerVisible}
                clients={dbClients}
                chooseClient={chosenClientHandler}
            />
            <StorePicker
                setVisible={storePickerVisibility}
                visible={storePickerVisible}
                stores={chosenClient}
                chooseStore={chooseStore}
            /> */}
            <ClientPickerAll
                setVisible={clientPickerVisibility}
                visible={clientPickerVisible}
                stores={stores}
                chooseStore={chooseStore}
            />
            <SupplierPicker
                setVisible={supplierPickerVisibility}
                visible={supplierPickerVisible}
                suppliers={dbSuppliers}
                chooseSupplier={chooseSupplier}
            />
            <SureModal
                visible={sureModal}
                setVisible={sureModalVis}
                callback={sureModalPicked}
                text={sureModalText}
            />
            <Loading visible={loading}/>
        </View>
    )
}

const style = StyleSheet.create({
    btn: {
        borderColor: '#c8c8c8',
        borderWidth: 1,
        flex: 1,
        justifyContent: 'center'
    },
    btnText: {
        fontSize: 14,
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    listHeader: {
        flex: 1,
    },
    listFooter: {
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    scroll: {
        flex: 8
    },
    searchBar: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 10,
    },
})
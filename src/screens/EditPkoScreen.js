import React, { useState, useEffect, useContext } from 'react';

import {
  ScrollView,
  StyleSheet,
  View,
  BackHandler,
} from 'react-native';

import { consts } from '../consts/const';
import { styles } from '../styles/styles';
import { DefaultBtn } from '../components/DefaultBtn';
import { DefaultTextInput } from '../components/DefaultTextInput';
import { DefaultCheckBoxWithText } from '../components/DefaultCheckBoxWithText';
import { CorrectDate, GetDate } from '../utils/GetDate';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import {
    addNewItemsToPKO,
    addNewItemsToUnsyncPKO,
    createTablePKO,
    deleteItem,
    getAllItems,
    getDBConnection,
    updatePko
} from '../db/db';
import { SupplierPicker } from '../components/modals/SupplierPicker';
import {GetCashOrders, SendNewCashOrder, ValidToken} from '../API/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { Loading } from '../components/modals/Loading';
import { SureModal } from '../components/modals/SureModal';
import { ClientPickerAll } from '../components/modals/ClientPickerAnotherEdition';
import {openDatabase} from "expo-sqlite";
import { NetworkContext } from '../context';

export const EditPkoScreen = ({navigation, route}) => {

    const [clientPickerVisible, setClientPickerVisible] = useState(false);
    const [storePickerVisible, setStorePickerVisible] = useState(false);
    const [supplierPickerVisible, setSupplierPickerVisible] = useState(false);
    const [chosenClient, setChosenClient] = useState({});
    const [readyClient, setReadyClient] = useState({});
    const [chosenSupplier, setChosenSupplier] = useState({});
    const [client, setClient] = useState({});
    const [dbClients, setDBClients] = useState([]);
    const [dbSuppliers, setDBSuppliers] = useState([]);
    const [sum, setSum] = useState(JSON.parse(JSON.stringify(route.params.amount)));
    const [comment, setComment] = useState(JSON.parse(JSON.stringify(route.params.comment)));
    const [loading,setLoading] = useState(false);
    const [sureModal, setSureModal] = useState(false);
    const [sureModalText, setSureModalText] = useState('');
    const [sureModalValue, setSureModalValue] = useState('');
    const [stores, setStores] = useState([]);
    const [docType, setDocType] = useState(JSON.parse(JSON.stringify(route.params.doc_type)));
    const {network} = useContext(NetworkContext);

    const{ doc_type, client_id, client_guid, client_name, supplier_id, supplier_name, supplier_guid, amount, id, store_id, store_guid  }=JSON.parse(JSON.stringify(route.params))

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
        // console.log(sureModalValue)
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
        if(client_name) {
            setReadyClient({
                id: store_id,
                client_id,
                client_guid,
                name: client_name,
                guid: store_guid
            })
        }

        if(supplier_id) {
            setChosenSupplier({
                id: supplier_id,
                supplier_name,
                supplier_guid,
            })
        }


        const db = openDatabase('db.db' );

        async function getDataFromDB(){
            const token = await AsyncStorage.getItem('@token');

            try {
                const validToken = await ValidToken(token)

                if(validToken.data === 'Token is valid') {

                    const clientsToAdd = await getAllItems(db, 'clients');
                    const suppliers = await getAllItems(db, 'suppliers');
                    setDBClients(clientsToAdd.filter(i => i.total_debt <= 0));
                    setDBSuppliers(suppliers);

                    let storesToAdd = [];
                    clientsToAdd.map(i => {
                        if (i.stores.length && i.stores != 'null'){
                            i.stores = JSON.parse(i.stores);
                            i.stores.map(l => {
                                l.client_guid = i.guid;
                                l.client_name = i.name;
                                storesToAdd.push(l);
                            })
                        }
                    })
                    storesToAdd.sort(function (a, b) {
                        if (a.client_name < b.client_name) {
                            return -1;
                        }
                        if (a.client_name > b.client_name) {
                            return 1;
                        }
                        return 0;
                    })
                    setStores(storesToAdd);
                } else {
                    navigation.navigate('Login')
                }
                } catch (e) {
                navigation.navigate('Login')
            }


        }

        async function getDataWithoutNetwork() {
            const clientsToAdd = await getAllItems(db, 'clients');
            const suppliers = await getAllItems(db, 'suppliers');
            setDBClients(clientsToAdd.filter(i => i.total_debt <= 0));
            setDBSuppliers(suppliers);

            const storesToAdd = [];
            clientsToAdd.map(i => {
                if (i.stores.length && i.stores != 'null'){
                    i.stores = JSON.parse(i.stores);
                    i.stores.map(l => {
                        l.client_guid = i.guid;
                        l.client_name = i.name;
                        storesToAdd.push(l);
                    })
                }
            })
            storesToAdd.sort(function (a, b) {
                if (a.client_name < b.client_name) {
                    return -1;
                }
                if (a.client_name > b.client_name) {
                    return 1;
                }
                return 0;
            })
            setStores(storesToAdd);
        }
        console.log('network', network)
        if(network) {
            getDataFromDB()
        } else {
            getDataWithoutNetwork()

        }
    }, [network]);

    useEffect(()=>{
        if(stores.length>0) {
            let choosedStore = stores.find(s=>s.client_id ===client_id)
            chooseStore(choosedStore)
            setLoading(false)
        } else {
            setLoading(true)
        }
        console.log('dbSuppliers', dbSuppliers)
    }, [stores])

    useEffect(()=>{
        if(dbSuppliers.length>0) {
            let choosedSupplier = dbSuppliers.find(s=>s.id ===supplier_id)
            chooseSupplier(choosedSupplier)

        }
    }, [ dbSuppliers])

    function chooseStore(store){
        // console.log('chooseStore', store)
        setReadyClient(store);
        setClientPickerVisible(false);
    }
    function chooseSupplier(sup){
        // console.log('chooseSupplier', sup)
        setChosenSupplier(sup);
        setSupplierPickerVisible(false);
    }
    function goBack(){
        navigation.goBack();
    }
    async function sendRequest(){
        if (readyClient.client_id || client_id && sum > 0 || amount){
            setLoading(true);
            const db = await getDBConnection();
            console.log('after db connection')
            let reqUnsync = {
                "client_id": readyClient.client_id,
                "client_guid": readyClient.client_guid,
                "client_name": readyClient.client_name,
                "store_id": readyClient.id,
                "store_guid": readyClient.guid,
                "store_name": readyClient.name,
                "supplier_id": chosenSupplier.id,
                "supplier_guid": chosenSupplier.guid,
                "supplier_name": chosenSupplier.name,
                "amount": sum,
                "doc_type": docType, // 0 или 1, 0 - cash, 1 - invoice
                "comment": comment.replace(/[']+/g, "''")
            }


           try {
               setLoading(true);
               console.log('unsyncPko', reqUnsync)
              await updatePko(db, 'unsyncPko', reqUnsync, id )

                   } catch (e) {
                       console.log(e)
                   } finally {
                        setLoading(false);
                       navigation.replace('PKOScreen');
                       Toast.show('ПКО успешно исправлен');
                   }

                   //navigation.navigate('PKOScreen');

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
                            checked={doc_type}
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
                            value={amount}
                        />
                        <DefaultTextInput
                            placeholder={'Комментарий'}
                            // onEndEditing={setterComment}
                            mt={15}
                            value={comment}
                            onChangeText={setComment}
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

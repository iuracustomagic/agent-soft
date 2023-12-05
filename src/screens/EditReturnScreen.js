import React, { useState, useEffect, useContext } from 'react';

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  BackHandler
} from 'react-native';
import { consts } from '../consts/const';
import { styles } from '../styles/styles';
import { DefaultBtn } from '../components/DefaultBtn';
import { IconBtn } from '../components/IconBtn';
import { DefaultTextInput } from '../components/DefaultTextInput';
import { DefaultCheckBoxWithText } from '../components/DefaultCheckBoxWithText';
import { CorrectDate, GetDate } from '../utils/GetDate';
import { ProductPicker } from '../components/modals/ProductPicker';
import {
    addNewItemsToClients,
    addNewItemsToRequests,
    addNewItemsToReturns,
    addNewItemsToUnsyncRequests,
    addNewItemsToUnsyncReturns,
    clearTable,
    createTableClients,
    createTableRequests,
    createTableReturns,
    createTableUnsyncRequests,
    deleteItem,
    deleteTable,
    getAllItems,
    getDBConnection,
    updateReturn
} from '../db/db';
import { CounterForProductPicker } from '../components/modals/CounterForProductPicker';
import { ClientPicker } from '../components/modals/ClientPicker';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { StorePicker } from '../components/modals/StorePicker';
import { Loading } from '../components/modals/Loading';
import Toast from 'react-native-simple-toast';
import {GetBalance, GetClients, GetRequests, GetReturns, SendNewRequest, SendNewReturn, ValidToken} from '../API/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CategoryPicker } from '../components/modals/CategoryPicker';
import { TypeOfReturnPicker } from '../components/modals/TypesOfReturns';
import { ClientPickerAll } from '../components/modals/ClientPickerAnotherEdition';
import { SureModal } from '../components/modals/SureModal';
import { NetworkContext } from '../context';
import {openDatabase} from "expo-sqlite";
import {replace, replaceStores} from "../utils/Helper";

export const EditReturnScreen = ({navigation, route}) => {


    const [products, setProducts] = useState([]);
    const [dbProducts, setDBProducts] = useState([]);
    const [toShowProducts, setToShowProducts] = useState([]);
    const [dbClients, setDBClients] = useState([]);
    const [productPickerVisible, setProductPickerVisible] = useState(false);
    const [categoryPickerVisible, setCategoryPickerVisible] = useState(false);
    const [clientPickerVisible, setClientPickerVisible] = useState(false);

    const [counterForProductPickerVisible, setCounterForProductPickerVisible] = useState(false);
    const [chosenProduct, setChosenProduct] = useState({});
    const [chosenCategory, setChosenCategory] = useState({});

    const [readyClient, setReadyClient] = useState({});

    const [loading, setLoading] = useState(false);
    const [moddedCategories, setModdedCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState({});
    const [typePickerVisible, setTypePickerVisible] = useState(false);
    const [chosenType, setChosenType] = useState({});
    const [stores, setStores] = useState([]);
    const [sureModal, setSureModal] = useState(false);
    const [sureModalText, setSureModalText] = useState('');
    const [sureModalValue, setSureModalValue] = useState('');
    const [totalSum, setTotalSum] = useState(0);
    const [docType, setDocType] = useState(JSON.parse(JSON.stringify(route.params.doc_type)));
    const [docNumber, setDocNumber] = useState(JSON.parse(JSON.stringify(route.params.doc_number)));
    const [refSum, setRefSum] = useState(false);
    const [comment, setComment] = useState(JSON.parse(JSON.stringify(route.params.comment)));
    const {network} = useContext(NetworkContext);

    const{ doc_type, client_name, list, store_id, client_guid, client_id, store_guid, id, return_name  }=JSON.parse(JSON.stringify(route.params))

    function typePickerVisibility(value){
        setTypePickerVisible(value);
    }
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
                navigation.replace('ReturnScreen');
                break;
        }
    }
    useEffect(() => {
        async function summator(){
            var sum = 0;
            await products.map(i => sum += i.price * i.quantity);
            await setTotalSum(sum.toFixed(2));
        }
        summator();
    }, [products, refSum])

    useEffect(()=>{

        if(stores.length>0) {
            let choosedStore = stores.find(s=>s.client_id ===Number(client_id))
            chooseStore(choosedStore)
            setLoading(false)
        } else {
            setLoading(true)
        }
    }, [stores])


    useEffect(() => {
        console.log('item ', route.params)

        if(client_name) {
            setReadyClient({
                id: store_id,
                client_id,
                client_guid,
                name: client_name,
                guid: store_guid
            })
        }
        let returnGuid = '';
        if(list) {
            returnGuid = list[0]['return_type']
            setProducts(list)
        }
        if(return_name) {
            setChosenType({name: return_name, guid: returnGuid})
        }
        const db = openDatabase('db.db' );

        async function getDataFromDB(){
            const token = await AsyncStorage.getItem('@token');
            try {
                const validToken = await ValidToken(token)
                const productsToAdd = await getAllItems(db, 'nomenclatures');

                if(validToken.data === 'Token is valid') {
                    const balances = await GetBalance(token);
                    list.map(i=>{
                        i = balances.balance.filter(b => b.nomenclature_id === i.id);
                    })


                    productsToAdd.map(i => {
                        i.price = JSON.parse(i.price);
                        i.balance = JSON.parse(i.balance);
                    })
                    const clientsToAdd = await getAllItems(db, 'clients');
                    const categories = await getAllItems(db, 'categories');
                    const suppliers = await getAllItems(db, 'suppliers');
                    const typesToAdd = await getAllItems(db, 'typesOfReturns');

                    setCategories(categories);
                    if (balances.status === 'ok') {
                        productsToAdd.map(i => {
                            i.balance = balances.balance.filter(b => b.nomenclature_id == i.id);
                        })
                    }

                    setDBProducts(productsToAdd);
                    setDBClients(clientsToAdd.filter(i => i.total_debt <= 0));
                    setTypes(typesToAdd);
                    // console.log(typesToAdd);
                    const replacedStores = replaceStores(clientsToAdd)

                    setStores(replacedStores);

                    suppliers.map(i => {
                        i.cats = [];
                        i.visible = false;
                    })

                    categories.map(i => {
                        suppliers.find(e => e.id == i.sup_id).cats.push(i)
                        //suppliers.cats.push(i)
                    })
                    // console.log(suppliers);
                    setModdedCategories(suppliers);


                } else {
                    navigation.navigate('Login')
                }
            } catch (e) {
                navigation.navigate('Login')
            }

        }

        async function getDataWithoutNetwork() {
            const productsToAdd = await getAllItems(db, 'nomenclatures');
            productsToAdd.map(i => {
                i.price = JSON.parse(i.price);
                i.balance = JSON.parse(i.balance);
            })
            const clientsToAdd = await getAllItems(db, 'clients');
            const categories = await getAllItems(db, 'categories');
            const suppliers = await getAllItems(db, 'suppliers');
            const typesToAdd = await getAllItems(db, 'typesOfReturns');

            setCategories(categories);
            setDBProducts(productsToAdd);
            setDBClients(clientsToAdd.filter(i => i.total_debt <= 0));
            setTypes(typesToAdd);
            // console.log(typesToAdd);
            const replacedStores = replaceStores(clientsToAdd)

            setStores(replacedStores);

            suppliers.map(i => {
                i.cats = [];
                i.visible = false;
            })

            categories.map(i => {
                suppliers.find(e => e.id == i.sup_id).cats.push(i)
                //suppliers.cats.push(i)
            })

            setModdedCategories(suppliers);
        }
        if(network) {
            getDataFromDB()
        } else {
            getDataWithoutNetwork()

        }
    }, []);


    function productPickerVisibility(value){
        setProductPickerVisible(value);
    }
    function clientPickerVisibility(value){
        setClientPickerVisible(value);
    }

    function counterProductPickerVisibility(value){
        setCounterForProductPickerVisible(value);
    }
    function categoryPickerVisibility(value){
        if (Object.keys(readyClient).length)
            setCategoryPickerVisible(value);
        else
            Toast.show('Выберите торговую точку');
    }
    function addToList(data){
        if (!products.find((e) => e.nomenclature_id === data.nomenclature_id)){

            setProducts([...products, data]);
            Toast.show('Продукт добавлен');
            alrdy(data.nomenclature_id, true, data.quantity);
        }
        else{
            const indexCat = products.findIndex(i => i.nomenclature_id == data.nomenclature_id);
            products[indexCat].quantity = data.quantity;
            alrdy(data.nomenclature_id, false);
            alrdy(data.nomenclature_id, true, data.quantity);
            setRefSum(!refSum);
            Toast.show('Продукт обновлен');
        }
    }
    function chosenProductHandler(data){
        setChosenProduct(data);
        setCounterForProductPickerVisible(true);
    }
    function chosenCategoryHandler(data){
        setChosenCategory(data);
        var newAr = dbProducts.filter(i => i.category_id == data);
        setToShowProducts(newAr);
        setProductPickerVisible(true);
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => backHandler.remove();
    }, [])
    function removeProduct(id){
        const items = products.filter(item => item.nomenclature_id != id);
        setProducts(items);
        alrdy(id, false);
    }
    function chooseStore(store){

        var badPrices = 0;
        var nmcls_count = 0;
        // console.log(store)
        dbProducts.map(i => {
            var spt = store.price_types.find(spts => spts.organization_id == i.organization_id);
            var real_price = 0;
            if (spt){
                if (i.price){
                    var pf = i.price.find(p => p.price_type_guid == spt.guid);
                    if (pf)
                        real_price = pf.price;
                }
            }
            i.real_price = real_price;
            if (i.real_price == 0)
                badPrices++;
            nmcls_count++;
        })

        products.map(i => {
            i.price = dbProducts.find(p => i.nomenclature_id == p.id).real_price
        })
        if (store.blockedSups){
            moddedCategories.map(mc => {
                if (store.blockedSups.find(bs => bs.id == mc.id))
                    return mc.blocked = 1;
                else
                    return delete mc.blocked;
            })
        }
        else
            moddedCategories.map(mc => {
                delete mc.blocked;
            })
        setReadyClient(store);
        setClientPickerVisible(false);
        setRefSum(!refSum);
    }
    function chooseType(type){
        setChosenType(type);
        setTypePickerVisible(false);
    }

    function alrdy(id, value, qty){
        const indexProduct = dbProducts.findIndex(i => i.id == id);
        dbProducts[indexProduct].already = value;
        const product = dbProducts.find(i => i.id == id);
        const indexCat = categories.findIndex(i => i.id == product.category_id);
        categories[indexCat].already = value;
        if (qty)
            dbProducts[indexProduct].pickedQty = qty;
        else
            delete dbProducts[indexProduct].pickedQty
    }

     async function sendRequest(){

        if (readyClient.id || client_id && products.length || list){
            if (products){
                setLoading(true);

                products.map(i => {
                    i.return_type = chosenType.guid;
                });
                const db = await getDBConnection();

                let reqUnsync = {
                    "client_id": readyClient.client_id,
                    "client_guid": readyClient.client_guid,
                    "client_name": readyClient.client_name,
                    "store_id": readyClient.id,
                    "store_guid": readyClient.guid,
                    "store_name": readyClient.name,
                    "amount": totalSum,
                    "doc_type": docType, // 0 или 1, 0 - cash, 1 - invoice
                    "exported": 0, // 0 или 1
                    "list": products,
                    "comment": comment,
                    "doc_number": docNumber,
                    "return_name": chosenType.name,

                }

                reqUnsync.list = JSON.stringify(reqUnsync.list);
                reqUnsync.list = reqUnsync.list.replace(/[']+/g, "''");
                console.log('editReturnScreen reqUnsync', reqUnsync)
                try {
                    setLoading(true);
                    await updateReturn(db, 'unsyncReturns',reqUnsync, id )
                } catch (e) {
                    console.log(e)
                } finally {
                    setLoading(false);
                    Toast.show('Возврат успешно исправлен');
                    navigation.replace('ReturnScreen');
                }


            }
        }
        else
            Toast.show('Не выбраны клиент,товары или причина');
    }


    return(
        <View style={{height: '100%'}}>
            <View style={styles.listContainer}>

                        <FlatList
                            ListHeaderComponent={
                                <View
                                    style={style.scroll}
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
                                    <DefaultTextInput
                                        placeholder={'Номер документа'}
                                        mt={15}
                                        value={docNumber}
                                        onChangeText={setDocNumber}
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
                                        onPress={() => typePickerVisibility(true)}
                                    >
                                        <DefaultTextInput
                                            placeholder='Причина'
                                            editable={false}
                                            value={chosenType.name}
                                            mt={15}
                                        />
                                    </Pressable>
                                    <DefaultTextInput
                                        placeholder={'Комментарий'}
                                        mt={15}
                                        value={comment}
                                        onChangeText={setComment}
                                    />
                                    <View style={style.products}>
                                        <DefaultBtn
                                            text={consts.ADD_PRODUCT}
                                            upperText={true}
                                            callback={() => categoryPickerVisibility(true)}
                                        />


                                    </View>
                                </View>
                            }
                            data={products}
                            extraData={products}
                            keyExtractor={item => item.nomenclature_id}
                            ItemSeparatorComponent={separatorItem}
                            renderItem={
                                ({item}) => {
                                    return(
                                        <View style={style.productListRow}>
                                            <View>
                                                <Text style={style.nomenclature}>
                                                    {item.nomenclature}
                                                </Text>
                                                <Text style={style.blck}>
                                                    Кол-во: <Text style={style.productQty}>{item.quantity}</Text> Цена: <Text style={style.productQty}>{item.price}</Text>
                                                </Text>
                                            </View>
                                            <IconBtn
                                                callback ={() => removeProduct(item.nomenclature_id)}
                                                size={28}
                                                color='red'
                                                fa5Icon='trash-alt'
                                            />
                                        </View>

                                    )
                                }
                            }





                            ListFooterComponent={
                                <View>
                                    <View style={[style.totalSum]}>
                                        <Text style={[style.descr, style.totalSumText]}>
                                            Сумма: {totalSum}
                                        </Text>
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
                            }
                        />



            </View>
            <CategoryPicker
                setVisible={categoryPickerVisibility}
                visible={categoryPickerVisible}
                suppliers={moddedCategories}
                categories={categories}
                chosenCategory={chosenCategoryHandler}
                products={dbProducts}
                chooseProduct={chosenProductHandler}
                removeProduct={removeProduct}
            />
            <ProductPicker
                setVisible={productPickerVisibility}
                visible={productPickerVisible}
                products={toShowProducts}
                chooseProduct={chosenProductHandler}
                removeProduct={removeProduct}
            />
            <CounterForProductPicker
                setVisible={counterProductPickerVisibility}
                visible={counterForProductPickerVisible}
                callback={addToList}
                product={chosenProduct}
            />
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
            />*/}
            <TypeOfReturnPicker
                setVisible={typePickerVisibility}
                visible={typePickerVisible}
                types={types}
                chooseType={chooseType}
            />
            <ClientPickerAll
                setVisible={clientPickerVisibility}
                visible={clientPickerVisible}
                stores={stores}
                chooseStore={chooseStore}
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

const separatorItem = () => {
    return(
        <View style={style.separator}>
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
        flex: 1,
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
    separator: {
        borderBottomColor: '#c8c8c8',
        borderBottomWidth: 1,
        height: 5,
        width: '100%'
    },
    productListRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        alignItems: 'center'
    },
    productQty: {
        color: '#ff6365'
    },
    nomenclature: {
        maxWidth: 300,
        color: 'black'
    },
    descr: {
        color: 'black',
        marginTop: 15
    },
    totalSum: {
        alignItems: 'flex-end',
        marginRight: 4
    },
    blck: {
        color: 'black'
    },
    totalSumText: {
        fontSize: 16,
        textDecorationLine: 'underline'
    }
})

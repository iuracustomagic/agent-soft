import React, { useState, useEffect, useRef, useContext } from 'react';

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
import { CorrectDate,  GetDate } from '../utils/GetDate';
import { ProductPicker } from '../components/modals/ProductPicker';
import { addNewItemsToClients, addNewItemsToRequests, addNewItemsToUnsyncRequests, createTableClients, createTableRequests, createTableUnsyncRequests, deleteItem, deleteTable, getAllItems, getDBConnection } from '../db/db';
import { CounterForProductPicker } from '../components/modals/CounterForProductPicker';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { Loading } from '../components/modals/Loading';
import Toast from 'react-native-simple-toast';
import { GetBalance, ValidToken, GetRequests, Ping, SendNewRequest } from '../API/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CategoryPicker } from '../components/modals/CategoryPicker';
import { ClientPickerAll } from '../components/modals/ClientPickerAnotherEdition';
import { SureModal } from '../components/modals/SureModal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Auth } from '../API/auth';
import {openDatabase} from "expo-sqlite";
import {NetworkContext} from '../context';


export const NewRequestScreen = ({navigation}) => {

    const [products, setProducts] = useState([]);
    const [dbProducts, setDBProducts] = useState([]);
    const [toShowProducts, setToShowProducts] = useState([]);
    const [productPickerVisible, setProductPickerVisible] = useState(false);
    const [categoryPickerVisible, setCategoryPickerVisible] = useState(false);
    const [clientPickerVisible, setClientPickerVisible] = useState(false);
    const [counterForProductPickerVisible, setCounterForProductPickerVisible] = useState(false);
    const [chosenProduct, setChosenProduct] = useState({});
    // const [chosenCategory, setChosenCategory] = useState({});
    // const [chosenClient, setChosenClient] = useState({});
    const [readyClient, setReadyClient] = useState({});

    // const [client, setClient] = useState({});
    const [loading, setLoading] = useState(false);
    const [moddedCategories, setModdedCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [stores, setStores] = useState([]);
    const [sureModal, setSureModal] = useState(false);
    const [sureModalText, setSureModalText] = useState('');
    const [sureModalValue, setSureModalValue] = useState('');
    const [totalSum, setTotalSum] = useState(0);
    const [checkRequired, setCheckRequired] = useState(0);
    const [docType, setDocType] = useState(0);
    const [docNumber, setDocNumber] = useState(0);
    const [printCert, setPrintCert] = useState(0);
    const [promo, setPromo] = useState(0);
    const [refSum, setRefSum] = useState(false);
    const [datePicker, setDatePicker] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [comment, setComment] = useState('');
    const {network} = useContext(NetworkContext);


    function setDate(event, date){
        setDatePicker(false);
        // console.log(event);
        // console.log(date);
        setCurrentDate(date);
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
                navigation.replace('RequestScreen');
                break;
        }
    }

    useEffect(() => {
        async function summator(){
            let sum = 0;
            await products.map(i => sum += i.price * i.quantity);
            await setTotalSum(sum.toFixed(2));
        }
        summator();
    }, [products, refSum])

    function changer(value){
        //console.log(value)
    }
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
        console.log('---------------data')
        // console.log(data)
        if (!products.find((e) => e.nomenclature_id === data.nomenclature_id)){
            setProducts([...products, data]);
            Toast.show('Продукт добавлен');
            alrdy(data.nomenclature_id, true, data.quantity);
        }
        else{
            const indexCat = products.findIndex(i => i.nomenclature_id === data.nomenclature_id);
            products[indexCat].quantity = data.quantity;
            alrdy(data.nomenclature_id, false);
            alrdy(data.nomenclature_id, true, data.quantity);
            setRefSum(!refSum);
            Toast.show('Продукт обновлен');
        }
    }
    function alrdy(id, value, qty){
        const indexProduct = dbProducts.findIndex(i => i.id === id);
        dbProducts[indexProduct].already = value;
        const product = dbProducts.find(i => i.id === id);
        const indexCat = categories.findIndex(i => i.id === product.category_id);
        categories[indexCat].already = value;
        if (qty)
            dbProducts[indexProduct].pickedQty = qty;
        else
            delete dbProducts[indexProduct].pickedQty
    }
    function chosenProductHandler(data){
        // console.log(data)
        setChosenProduct(data);
        setCounterForProductPickerVisible(true);
    }
    function chosenCategoryHandler(data){
        // setChosenCategory(data);
        let newAr = dbProducts.filter(i => i.category_id === data);
        setToShowProducts(newAr);
        setProductPickerVisible(true);
    }
    // async function chosenClientHandler(data){
    //     //console.log(data)
    //     if (data.stores !== 'null'){
    //         await setChosenClient(JSON.parse(data.stores));
    //         await setClient(data);
    //         // await setStorePickerVisible(true);
    //     }
    //
    //     //await setClientPickerVisible(false);
    //
    //     //console.log(chosenClient);
    // }
    function removeProduct(id){
        const items = products.filter(item => item.nomenclature_id != id);
        setProducts(items);
        alrdy(id, false);
    }
    function chooseStore(store){
        let badPrices = 0;
        let nmcls_count = 0;

        dbProducts.map(i => {

            let spt = store.price_types.find(spts => spts.organization_id == i.organization_id);
            let real_price = 0;
            if (spt){
                if (i.price){
                    let pf = i.price.find(p => p.price_type_guid == spt.guid);
                    if (pf)
                        real_price = pf.price;
                }
            }
            i.real_price = real_price;
            if (i.real_price == 0){
                badPrices++;
                //console.log(i);
            }

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
        console.log('store', store)
        setReadyClient(store);
        setClientPickerVisible(false);
        setRefSum(!refSum);
    }


    // function goBack(){
    //     navigation.goBack();
    // }
    const changeProduct = (id) => {
        const pr = dbProducts.find(i => i.id == id);
        chosenProductHandler(pr);
    }
    async function sendRequest(){
        if (readyClient.id && products.length){
            if (products){
                setLoading(true);

                let token = await AsyncStorage.getItem('@token');
                const db = openDatabase('db.db' );

                let reqUnsync = {
                    "client_id": readyClient.client_id,
                    "client_guid": readyClient.client_guid,
                    //"client_name": readyClient.name,
                    "store_id": readyClient.id,
                    "store_guid": readyClient.guid,
                    //"store_name": chosenStore.name,
                    "delivery_date": CorrectDate(currentDate.toLocaleDateString("en-US")),
                    "amount": totalSum,
                    "check_required": checkRequired, // 0 или 1
                    "doc_type": docType, // 0 или 1, 0 - cash, 1 - invoice
                    "exported": 0, // 0 или 1
                    "print_cert": printCert, // 0 или 1
                    "promo": promo, // 0 или 1
                    "list": products,
                    "comment": comment
                }
                let req = {};
                Object.assign(req, reqUnsync);

                if (network){

                    try {
                        const resp = await SendNewRequest(token, req);
                        if(resp.status === 'ok') {
                            let clientsToAdd = await getAllItems(db, 'clients');
                            const replace = (order) => {
                                var client = clientsToAdd.find(c => c.id == order.client_id);

                                if (client) {
                                    order.client_name = client.name.replace(/[']+/g, "''");
                                }
                                else {
                                    order.client_name = 'noname'
                                }

                                if (client) {
                                    if (client.stores != 'null') {
                                        if (JSON.parse(client.stores).find(s => s.id == order.store_id))
                                            order.store_name = JSON.parse(client.stores).find(s => s.id == order.store_id).name.replace(/[']+/g, "''");
                                    }
                                    else {
                                        order.store_name = 'null';
                                    }
                                }
                                else {
                                    order.store_name = 'null'
                                }
                                order.list = order.list.replace(/[']+/g, "''");
                                order.order_date = order.created_at.substring(0, 10);
                            }
                            const orderResponse = resp.order
                            // console.log('orderResponse',orderResponse)
                            replace(orderResponse)
                            console.log('resp.order',[orderResponse] )
                            await addNewItemsToRequests(db, 'requests', [orderResponse]);
                            await addNewItemsToRequests(db, 'todayRequests', [orderResponse]);

                            Toast.show('Заявка успешно отправлена');


                        } else{
                            setLoading(false);
                            Toast.show('Заявка не отправлена');
                            console.log(resp)
                        }

                            } catch (err) {
                                console.log(err)
                            } finally {
                                setLoading(false);
                                navigation.replace('RequestScreen');
                            }
                    }
                else{

                    // console.log('reqUnsync before', reqUnsync)
                    reqUnsync.client_name = readyClient.client_name;
                    reqUnsync.store_name = readyClient.name;
                    reqUnsync.order_date = CorrectDate(GetDate('today'));
                    reqUnsync.sync_status = false;
                    reqUnsync.doc_number = Number(docNumber);
                    reqUnsync.list = JSON.stringify(req.list);
                    reqUnsync.list = reqUnsync.list.replace(/[']+/g, "''");

                    reqUnsync = [reqUnsync];
                    console.log('reqUnsync after', reqUnsync)


                    console.log('--------------------------------------------------')
                    // console.log(req);
                    // await deleteTable(db, 'unsyncReqs')
                    // await createTableUnsyncRequests(db, 'unsyncReqs')
                   await addNewItemsToUnsyncRequests(db, 'unsyncReqs', reqUnsync);


                    Toast.show('Заявка сохранена на телефоне');
                    setLoading(false);
                    navigation.replace('RequestScreen');
                }
            }
        }
        else
            Toast.show('Не выбраны клиент или товары')
    }


    useEffect(() => {

        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => backHandler.remove();
    }, [])

    useEffect(() => {

        let date = new Date();
        date.setDate(date.getDate() + 1);
        setCurrentDate(date);
        const db = openDatabase('db.db' );
        async function getDataWithoutNetwork(){
            const productsToAdd = await getAllItems(db, 'nomenclatures');
            const clientsToAdd = await getAllItems(db, 'clients');

            let categories = await getAllItems(db, 'categories');
            let suppliers = await getAllItems(db, 'suppliers');
            productsToAdd.map(i => {
                i.price = JSON.parse(i.price);
                i.balance = JSON.parse(i.balance);
            })
            setCategories(categories);
            setDBProducts(productsToAdd);
            let storesToAdd = [];
            await clientsToAdd.map(i => {
                if (i.stores.length && i.stores != 'null'){
                    i.stores = JSON.parse(i.stores);
                    i.statuses = JSON.parse(i.statuses);
                    var blockedSups = [];
                    if (i.statuses != null && i.statuses != 'null'){
                        var blocked = false;
                        if (i.statuses.find(s => s.blocked == 1))
                            blocked = true;
                        i.statuses.map(s => {
                            if (s.blocked == 1)
                                blockedSups.push({
                                    "id": s.organization_id
                                })
                        })
                    }
                    i.stores.map(l => {
                        l.client_guid = i.guid;
                        l.client_name = i.name;
                        l.debt = i.total_debt;
                        if (blockedSups.length)
                            l.blockedSups = blockedSups;
                        if (blocked)
                            l.blocked = true;
                        else
                            l.blocked = false;
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

        async function getDataFromDB(){
            const token = await AsyncStorage.getItem('@token');
            const productsToAdd = await getAllItems(db, 'nomenclatures');
            const clientsToAdd = await getAllItems(db, 'clients');

            let categories = await getAllItems(db, 'categories');
            let suppliers = await getAllItems(db, 'suppliers');
            try {
                const validToken = await ValidToken(token)
                console.log('ValidToken', validToken)
                if(validToken.data === 'Token is valid') {
                    // const balances = await GetBalance(token);

                    productsToAdd.map(i => {
                        i.price = JSON.parse(i.price);
                        i.balance = JSON.parse(i.balance);
                    })

                    setCategories(categories);
                    // if (balances.status === 'ok') {
                    //     productsToAdd.map(i => {
                    //         i.balance = balances.balance.filter(b => b.nomenclature_id === i.id);
                    //     })
                    // }
                    // console.log('productsToAdd', productsToAdd)
                    setDBProducts(productsToAdd);

                    let storesToAdd = [];
                    await clientsToAdd.map(i => {
                        if (i.stores.length && i.stores != 'null'){
                            i.stores = JSON.parse(i.stores);
                            i.statuses = JSON.parse(i.statuses);
                            var blockedSups = [];
                            if (i.statuses != null && i.statuses != 'null'){
                                var blocked = false;
                                if (i.statuses.find(s => s.blocked == 1))
                                    blocked = true;
                                i.statuses.map(s => {
                                    if (s.blocked == 1)
                                        blockedSups.push({
                                            "id": s.organization_id
                                        })
                                })
                            }
                            i.stores.map(l => {
                                l.client_guid = i.guid;
                                l.client_name = i.name;
                                l.debt = i.total_debt;
                                if (blockedSups.length)
                                    l.blockedSups = blockedSups;
                                if (blocked)
                                    l.blocked = true;
                                else
                                    l.blocked = false;
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

                    suppliers.map(i => {
                        i.cats = [];
                        i.visible = false;
                    })

                    categories.map(i => {
                        suppliers.find(e => e.id == i.sup_id).cats.push(i)
                        //suppliers.cats.push(i)
                    })

                    setModdedCategories(suppliers);
                } else navigation.navigate('Login')
            } catch (e) {
                console.log(e)
                navigation.navigate('Login')
            }
        }
        //console.log(dbProducts)
        if(network) {
            getDataFromDB()
        } else {
            getDataWithoutNetwork()

        }

    }, []);

    return(
        <View style={{height: '100%'}}>
            <View style={styles.listContainer}>

                        <FlatList
                            ListHeaderComponent={
                                <View
                                    style={style.scroll}
                                >
                                    <DefaultCheckBoxWithText
                                        text={consts.INVOICE_WITH_RECEIPT}
                                        onChange={(value) => {
                                            if (value)
                                                setCheckRequired(1)
                                            else
                                                setCheckRequired(0)
                                        }}
                                    />
                                    <DefaultCheckBoxWithText
                                        text={consts.PROMOTION}
                                        onChange={(value) => {
                                                if (value)
                                                    setPromo(1)
                                                else
                                                    setPromo(0)
                                            }}
                                    />
                                    <DefaultCheckBoxWithText
                                        text={consts.PRINT_CERTIFICATE}
                                        onChange={(value) => {
                                            if (value)
                                                setPrintCert(1)
                                            else
                                                setPrintCert(0)
                                        }}
                                    />
                                    <DefaultCheckBoxWithText
                                        text={consts.TYPE_OF_DOCUMENT}
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
                                    <Text style={style.descr}>Дата создания:</Text>
                                    <DefaultTextInput
                                        value={GetDate('today')}
                                        onChangeText={changer()}
                                        editable={false}
                                    />
                                    <Text style={style.descr}>Дата доставки:</Text>
                                    <Pressable
                                        onPress={() => setDatePicker(true)}
                                    >
                                        <DefaultTextInput
                                            mt={0}
                                            value={currentDate.toLocaleDateString("en-US")}
                                            editable={false}
                                        />
                                    </Pressable>
                                    <Pressable
                                        onPress={() => clientPickerVisibility(true)}
                                    >
                                        <DefaultTextInput
                                            mt={15}
                                            placeholder={'Клиент'}
                                            editable={false}
                                            value={readyClient.name}
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
                                        <Pressable
                                            onPress={() => changeProduct(item.nomenclature_id)}
                                        >
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
                                        </Pressable>

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
            {datePicker &&
                <DateTimePicker
                    testID="dateTimePicker"
                    value={currentDate}
                    minimumDate={new Date()}
                    textColor={'red'}
                    onChange={(event, date) => {setDate(event, date)}}
                />
            }

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
    listContainer: {
        paddingHorizontal: 10
},
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
        marginRight: 14
    },
    blck: {
        color: 'black'
    },
    totalSumText: {
        fontSize: 16,
        textDecorationLine: 'underline'
    }
})

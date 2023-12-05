import React, { useEffect, useState, useContext } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import {  useIsFocused } from '@react-navigation/native';

import { consts } from '../consts/const';
import { styles } from '../styles/styles';
import { IconBtn } from '../components/IconBtn';
import { DefaultTextInput } from '../components/DefaultTextInput';
import { getAllItems, getDBConnection } from '../db/db';
import { OrderModal } from '../components/modals/OrderModal';
import { CorrectDate, GetCorrectJSDate, GetDate } from '../utils/GetDate';
import AntIcon from "react-native-vector-icons/AntDesign";
import { NetworkContext, RefresherContext, TodayOrdersContext } from '../context';
import { Filtrum } from '../components/modals/Filtrum';
import {Loading} from "../components/modals/Loading";

export const RequestScreen = ({navigation}) => {

    const {network} = useContext(NetworkContext);

    const [data, setData] = useState([/* {name: 'name_1', sum: 120000}, {name: 'name_2', sum: 180000}, {name: 'name_3', sum: 2250000}, {name: 'name_1', sum: 120000}, {name: 'name_2', sum: 180000}, {name: 'name_3', sum: 2250000}, {name: 'name_1', sum: 120000}, {name: 'name_2', sum: 180000}, {name: 'name_3', sum: 2250000}, {name: 'name_1', sum: 120000}, {name: 'name_2', sum: 180000}, {name: 'name_3', sum: 2250000}, {name: 'name_1', sum: 120000}, {name: 'name_2', sum: 180000}, {name: 'name_3', sum: 2250000}, {name: 'name_1', sum: 120000}, {name: 'name_2', sum: 180000}, {name: 'name_3', sum: 2250000}, {name: 'name_1', sum: 120000}, {name: 'name_2', sum: 180000}, {name: 'name_3', sum: 2250000}, {name: 'name_1', sum: 120000}, {name: 'name_2', sum: 180000}, {name: 'name_3', sum: 2250000} */]);
    const [itemVisible, setItemVisible] = useState(false);
    const [chosenItem, setChosenItem] = useState({});
    const [productList, setProductList] = useState({});
    const isFocused = useIsFocused();
    const [filterVisible, setFilterVisible] = useState(false);
    const [orders, setOrders] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [totalSum, setTotalSum] = useState(0);
    const {refresher, setRefresher} = useContext(RefresherContext);
    const [loading, setLoading] = useState(false);

    function itemVisibleChanger(value){
        setItemVisible(value);
    }

    function filterVisibleChanger(value){
        setFilterVisible(value);
    }

    useEffect(() => {
        async function summator(){
            var sum = 0;
            await data.map(i => sum += i.amount);
            await setTotalSum(sum.toFixed(2));
        }
        summator();
    }, [data])

    const filter = async (value) => {

        try{
            setLoading(true);

            const db = await getDBConnection();
            var unsyncOrders = await getAllItems(db, 'unsyncReqs');
            var defaultOrders = await getAllItems(db, 'requests');

            defaultOrders.map((i) => {
                i.list = JSON.parse(i.list)
            })
            if (unsyncOrders.length){
                unsyncOrders.map((i) => {
                    i.local = true;
                    i.list = JSON.parse(i.list)
                })

            }
            unsyncOrders.length ? unsyncOrders.concat(defaultOrders) : defaultOrders
            // setOrders(unsyncOrders.length ? unsyncOrders.concat(defaultOrders) : defaultOrders);
            // setData(defaultOrders);
            console.log('orders length', defaultOrders.length)
            switch (value){
                case 'dateUp':
                    setData(defaultOrders.sort((a, b) => {
                        return new Date(a.order_date) - new Date(b.order_date)
                    }))
                    break;
                case 'dateDown':
                    setData(defaultOrders.sort((a, b) => {
                        return new Date(b.order_date) - new Date(a.order_date)
                    }))
                    break;
                case 'sumUp':
                    setData(defaultOrders.sort((a, b) => {
                        return a.amount - b.amount
                    }))
                    break;
                case 'sumDown':
                    setData(defaultOrders.sort((a, b) => {
                        return b.amount - a.amount
                    }))
                    break;
                case 'nameUp':
                    setData(defaultOrders.sort((a, b) => {
                        if ( a.store_name < b.store_name ){
                            return -1;
                        }
                        if ( a.store_name > b.store_name ){
                            return 1;
                        }
                        return 0;
                    }))
                    break;
                case 'nameDown':
                    setData(defaultOrders.sort((a, b) => {
                        if ( a.store_name > b.store_name ){
                            return -1;
                        }
                        if ( a.store_name < b.store_name ){
                            return 1;
                        }
                        return 0;
                    }))
                    break;
                case 'clear':
                    // defaultOrders.sort((a, b) => {
                    //     if ( a.store_name < b.store_name ){
                    //         return -1;
                    //     }
                    //     if ( a.store_name > b.store_name ){
                    //         return 1;
                    //     }
                    //     return 0;
                    // });

                    setData(defaultOrders.filter(i => i.order_date == CorrectDate(GetDate('today'))))
                    break;
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false);
        }


    }

    function newRequest(){
        navigation.navigate('NewRequestScreen');
    }

    function finder(value){
        if (value){

        }
    }
    const showItemModal = async (item) => {
        await setChosenItem(item);
        console.log(chosenItem)

        itemVisibleChanger(true);
    }

    useEffect(() => {
        async function getDataFromDB(){
            try{
                setLoading(true);
                const db = await getDBConnection();
                let unsyncOrders = await getAllItems(db, 'unsyncReqs');
                console.log('unsyncReqs',unsyncOrders)
                // let defaultOrders = await getAllItems(db, 'requests');
                let todayOrders = await getAllItems(db, 'todayRequests');
                console.log('todayOrders', todayOrders)
                // defaultOrders = defaultOrders.filter(i => i.order_date == CorrectDate(GetDate('today')));



                todayOrders = todayOrders.filter(i => i.order_date == CorrectDate(GetDate('today')));

                if(todayOrders) {
                    todayOrders.map((i) => {
                        i.list = JSON.parse(i.list)
                    })
                }


                if (unsyncOrders.length){
                    unsyncOrders = unsyncOrders.filter(i => i.order_date == CorrectDate(GetDate('today')));
                    unsyncOrders.map((i) => {
                        i.local = true;
                        i.list = JSON.parse(i.list)
                    })

                }
                // setOrders(unsyncOrders.length ? unsyncOrders.concat(defaultOrders) : defaultOrders);

                todayOrders = unsyncOrders.length ? unsyncOrders.concat(todayOrders) : todayOrders;


                setData(todayOrders);
                // setRefresh(!refresh);


            }catch (e) {
                console.log(e)
            } finally {
                setLoading(false);
            }


        }
      getDataFromDB();
         // getDataFromDB();
    }, [])

    return(
        <View style={{height: '100%'}}>

                <View style={[styles.listHeader, style.listHeader]}>
                    <Text style={styles.listHeaderTitle}>{consts.REQUESTS}</Text>
                    <View style={style.searchBar}>
                        <View style={style.iconAdd}>
                            <IconBtn
                                icon={'filter'}
                                color={'#ff6365'}
                                size={26}
                                callback={() => filterVisibleChanger(true)}
                            />
                        </View>
                        <View style={style.search}>

                            <DefaultTextInput
                                style={style.search}
                                placeholder={consts.SEARCH}
                                onEndEditing={finder}
                                mt={1}
                            />

                        </View>
                        <View style={style.iconAdd}>
                            <IconBtn
                                icon={'pluscircle'}
                                color={'#ff6365'}
                                size={26}
                                callback={newRequest}
                            />
                        </View>
                    </View>
                    <View style={[style.item, style.backBlue]}>
                        <Text style={[style.itemText, style.colorWhite, style.itemTextName]}>
                            {consts.CLIENT}
                        </Text>
                        <Text style={[style.itemText, style.colorWhite]}>
                            {consts.SUM}
                        </Text>
                        <Text style={[style.itemText, style.colorWhite, {maxWidth: '6%'}]}>
                            ТД
                        </Text>
                        <Text style={[style.itemText, style.colorWhite, {maxWidth: '28%'}]}>
                            {consts.DATE}
                        </Text>

                    </View>
                </View>

                <View
                    style={style.flatList}
                >
                    <FlatList
                        style={style.flatList2}
                        extraData={[refresh, refresher]}
                        data={data}
                        renderItem={({item}) =>{

                                return(
                                <TouchableOpacity
                                    style={ {backgroundColor: item.sync_status === 0 || item.local ? 'orange': ''}}
                                    onPress={() => {
                                        showItemModal(item)
                                    }}
                                >
                                    <View style={style.item}>
                                        <Text style={[style.itemText, style.itemTextName]}>
                                            {item.local && <AntIcon
                                                color='#ff6365'
                                                name={'close'}
                                                size={16} />
                                            }

                                            {item.client_name}
                                        </Text>
                                        <Text style={style.itemText}>
                                            {item.amount}
                                        </Text>
                                        {item.doc_type ?

                                            <View style={[style.itemText, {maxWidth: '6%'}, {alignItems: 'center'}]}>
                                                <AntIcon
                                                    size={16}
                                                    name='check'
                                                    color='green'
                                                />
                                            </View>
                                            :
                                            <View style={[style.itemText, {maxWidth: '6%'}, {alignItems: 'center'}]}>
                                                <AntIcon
                                                    size={16}
                                                    name='close'
                                                    color='red'
                                                />
                                            </View>
                                        }
                                        <Text style={[style.itemText, {maxWidth: '28%'}]}>
                                            {item.order_date}
                                        </Text>

                                    </View>
                                </TouchableOpacity>
                                )
                            }
                        }
                        ItemSeparatorComponent={separatorItem}
                    />
                </View>

                <View style={style.listFooter}>
                    <View style={[style.totalSum]}>
                        <Text style={[style.descr, style.totalSumText]}>
                            Сумма: {totalSum}
                        </Text>
                    </View>
                </View>
            <OrderModal
                visible={itemVisible}
                setVisible={setItemVisible}
                item={chosenItem}
                productList={productList}
                navigation={navigation}
            />
            <Filtrum
                visible={filterVisible}
                setVisible={filterVisibleChanger}
                callback={filter}
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
    headers: {
        maxHeight: 40
    },
    bkb: {
        backgroundColor: 'blue'
    },
    itemBack: {
        //backgroundColor: 'pink'
    },
    item: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 2
    },
    itemText: {
        width: '100%',
        maxWidth: '20%',
        fontSize: 16,
        color: 'black',
        marginLeft: 5,
    },
    itemTextName: {
        width: '100%',
        maxWidth: '45%',
    },
    separator: {
        borderBottomColor: '#c8c8c8',
        borderBottomWidth: 1,
        height: 5,
        width: '100%'
    },
    backBlue: {
        backgroundColor: '#ff6365',
        alignItems: 'center',
    },
    colorWhite: {
        color: 'white'
    },
    searchBar: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 15,
        justifyContent: 'space-between',
        marginTop: 10,
        maxHeight: 35
    },
    search: {
        flex: 5,
    },
    iconAdd: {
        height: '100%',
        justifyContent: 'flex-end',
        flex: 0.6,
        marginHorizontal: 10
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
    },
    flatList: {
        flex: 1,
        paddingBottom: 20,
    },
    listHeader: {
        height: '100%',
        maxHeight: 120
    },
    listFooter: {
        position: 'absolute',
        bottom: 0,
        right: 0
    }
})

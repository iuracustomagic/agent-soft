import React, { useEffect, useState } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';

import { consts } from '../consts/const';

import { styles } from '../styles/styles';

import { IconBtn } from '../components/IconBtn';
import { DefaultTextInput } from '../components/DefaultTextInput';
import { getAllItems, getDBConnection } from '../db/db';
import { OrderModal } from '../components/modals/OrderModal';
import { CorrectDate, GetCorrectJSDate, GetDate } from '../utils/GetDate';
import AntIcon from "react-native-vector-icons/AntDesign";


import { Filtrum } from '../components/modals/Filtrum';
import {Loading} from "../components/modals/Loading";

export const PkoScreen = ({navigation}) => {


    const [data, setData] = useState([]);
    const [itemVisible, setItemVisible] = useState(false);
    const [chosenItem, setChosenItem] = useState({});
    const [productList, setProductList] = useState({});
    const isFocused = useIsFocused();
    const [filterVisible, setFilterVisible] = useState(false);
    const [orders, setOrders] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [totalSum, setTotalSum] = useState(0);
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
            let unsyncOrders = await getAllItems(db, 'unsyncPKO');
            let defaultOrders = await getAllItems(db, 'pko');

            if (unsyncOrders){
                unsyncOrders.map((i) => {
                    i.local = true;
                })
            }
            defaultOrders = unsyncOrders.length ? unsyncOrders.concat(defaultOrders) : defaultOrders;
            setOrders(defaultOrders);

            switch (value){
                case 'dateUp':
                    setData(orders.sort((a, b) => {
                        return new Date(a.order_date) - new Date(b.order_date)
                    }))
                    break;
                case 'dateDown':
                    setData(orders.sort((a, b) => {
                        return new Date(b.order_date) - new Date(a.order_date)
                    }))
                    break;
                case 'sumUp':
                    setData(orders.sort((a, b) => {
                        return a.amount - b.amount
                    }))
                    break;
                case 'sumDown':
                    setData(orders.sort((a, b) => {
                        return b.amount - a.amount
                    }))
                    break;
                case 'nameUp':
                    setData(orders.sort((a, b) => {
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
                    setData(orders.sort((a, b) => {
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

                    orders.filter(i => i.order_date == CorrectDate(GetDate('today')))
                    setData(orders)
                    break;
            }
        }catch (e) {
            console.log(e)
        }finally {
            setLoading(false);
        }

    }

    function newRequest(){
        navigation.navigate('NewPKOScreen');
    }

    function finder(value){
        if (value){

        }
    }
    const showItemModal = async (item) => {
        await setChosenItem(item);;
        console.log(chosenItem)
/*         await setProductList(item.list);
        console.log(productList); */
        itemVisibleChanger(true);
    }

    useEffect(() => {

        async function getDataFromDB(){
            try {
                setLoading(true);
                const db = await getDBConnection();
                let unsyncOrders = await getAllItems(db, 'unsyncPKO');
                let defaultOrders = await getAllItems(db, 'pko');

                if (unsyncOrders){
                    unsyncOrders.map((i) => {
                        i.local = true;
                    })
                }
                console.log('unsyncPKO', unsyncOrders)
                defaultOrders = unsyncOrders.length ? unsyncOrders.concat(defaultOrders) : defaultOrders;
                setOrders(defaultOrders);

                defaultOrders = defaultOrders.filter(i => i.order_date == CorrectDate(GetDate('today')));
                setData(defaultOrders);
                setRefresh(!refresh);

            }catch (e) {
                console.log(e)
            }finally {
                setLoading(false);
            }

        }
       getDataFromDB();
    }, [])

    return(
        <View style={{height: '100%'}}>
                <View style={style.listHeader}>
                    <Text style={styles.listHeaderTitle}>{consts.PKO}</Text>
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
                        <Text style={[style.itemText, style.colorWhite, {maxWidth: '25%'}]}>
                            {consts.DATE}
                        </Text>
                    </View>
                </View>

                <View
                    style={style.flatList}
                >
                    <FlatList
                        style={style.flatList2}
                        extraData={refresh}
                        data={data}
                        renderItem={({item}) =>{

                                return(
                                <TouchableOpacity
                                    style={ {backgroundColor: item.local ? 'orange': ''}}
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
                                        <Text style={[style.itemText, {maxWidth: '25%'}]}>
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
                pko={true}
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

import React, { useState, useEffect} from 'react';

import {
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';

import { consts } from '../consts/const';
import { styles } from '../styles/styles';
import { DefaultBtn } from '../components/DefaultBtn';

import { DefaultTextInput } from '../components/DefaultTextInput';

import { CorrectDate,  GetDate } from '../utils/GetDate';

import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { Loading } from '../components/modals/Loading';
import DateTimePicker from "@react-native-community/datetimepicker";
import {SureModal} from "../components/modals/SureModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {openDatabase} from "expo-sqlite";
import {GetCashOrders, GetRequests, GetReturns, SendDeletePko, SendDeleteRequest, SendDeleteReturns} from "../API/api";
import {
    addNewItemsToPKO,
    addNewItemsToRequests,
    addNewItemsToReturns, createTablePKO,
    createTableRequests,
    createTableReturns,
    getAllItems
} from "../db/db";
import Toast from "react-native-simple-toast";



export const CleanPkoScreen = ({navigation}) => {


    const [loading, setLoading] = useState(false);

    const [sureModal, setSureModal] = useState(false);
    const [sureModalText, setSureModalText] = useState('');
    const [sureModalValue, setSureModalValue] = useState('');

    const [datePickerFrom, setDatePickerFrom] = useState(false);
    const [datePickerTo, setDatePickerTo] = useState(false);
    const [currentDateFrom, setCurrentDateFrom] = useState(new Date());
    const [currentDateTo, setCurrentDateTo] = useState(new Date());

    function setDateFrom(event, date){
        setDatePickerFrom(false);
        // console.log(event);
        // console.log(date);
        setCurrentDateFrom(date);
    }
    function setDateTo(event, date){
        setDatePickerTo(false);
        // console.log(event);
        // console.log(date);
        setCurrentDateTo(date);
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
                navigation.replace('CleanScreen');
                break;
        }
    }




    async function sendRequest(){
        setLoading(true);

        const token = await AsyncStorage.getItem('@token');
        const db = openDatabase('db.db' );
        const date ={
            "from":CorrectDate(currentDateFrom.toLocaleDateString("en-US")),
            "to":CorrectDate(currentDateTo.toLocaleDateString("en-US"))
        }
        const response = await SendDeletePko(token, date);
        console.log('response SendDeletePko', response)
        if(response.status === 'ok') {
            try {
                let requests = await GetCashOrders(token);

                let clientsToAdd = await getAllItems(db, 'clients');
                let suppliers = await getAllItems(db, 'suppliers');
                await createTablePKO(db, 'pko');

                     requests.cash_order_receipts.map(i => {
                        let supplier = suppliers.find(s => s.id == i.organization_id);
                        let client = clientsToAdd.find(c => c.id == i.client_id);
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

                    Toast.show('ПКО успешно удален');

            }catch(err) {
                console.log(err)
            }finally {
                setLoading(false);
                navigation.replace('CleanScreen');
            }
        }
    }



    return(
        <View style={{height: '100%'}}>
            <View style={styles.listContainer}>

                        <FlatList
                            ListHeaderComponent={
                                <View
                                    style={style.scroll}
                                >

                                    <Text style={style.descr}>С какой даты:</Text>
                                    <Pressable
                                        onPress={() => setDatePickerFrom(true)}
                                    >
                                        <DefaultTextInput
                                            mt={0}
                                            value={currentDateFrom.toLocaleDateString("en-US")}
                                            editable={false}
                                        />
                                    </Pressable>
                                    <Text style={style.descr}>По какую дату:</Text>
                                    <Pressable
                                        onPress={() => setDatePickerTo(true)}
                                    >
                                        <DefaultTextInput
                                            mt={0}
                                            value={currentDateTo.toLocaleDateString("en-US")}
                                            editable={false}
                                        />
                                    </Pressable>


                                </View>
                            }


                            ListFooterComponent={
                                <View>

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
            {datePickerFrom &&
            <DateTimePicker
                testID="dateTimePicker"
                value={currentDateFrom}
                // minimumDate={new Date()}
                textColor={'red'}
                onChange={(event, date) => {setDateFrom(event, date)}}
            />
            }
            {datePickerTo &&
            <DateTimePicker
                testID="dateTimePicker"
                value={currentDateTo}
                // minimumDate={new Date()}
                textColor={'red'}
                onChange={(event, date) => {setDateTo(event, date)}}
            />
            }
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

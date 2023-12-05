import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {  SendUnsyncRequest, ValidToken } from '../../API/api';
import { consts } from '../../consts/const';
import { getAllItems, getDBConnection} from '../../db/db';

import {  useNavigation } from '@react-navigation/native';
import { SyncOrders, SyncPKO, SyncReturns } from '../../utils/Helper';
import { RefresherContext } from '../../context';
import updater from "../../utils/updater";
import {Loading} from "./Loading";
import loginHandler from "../../utils/login";
import {Auth} from "../../API/auth";
import Toast from "react-native-simple-toast";
import {SureModal} from "./SureModal";

export const LeftSideMenu = ({visible, opener, navigation}) => {

    const {refresher, setRefresher} = useContext(RefresherContext);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [sureModal, setSureModal] = useState(false);
    const [sureModalText, setSureModalText] = useState('');
    const [sureModalValue, setSureModalValue] = useState('');

    const navig = useNavigation();
    //navig.navigate('RequestScreen')

    function doNavigation(data){
        navig.navigate(data);
        closer();
    }

    const closer = () => {
        opener(false);
    }

    const updateHandler = async()=> {
        setLoading(true);
        try {
            const login1 = await AsyncStorage.getItem('@login');
            const pass1 = await AsyncStorage.getItem('@pass');
            const token = await AsyncStorage.getItem('@token');
            if (login1 && pass1){
                const validToken = await ValidToken(token)

                    if(validToken.data === 'Token is valid') {
                    console.log('ValidToken')

                } else {
                    const tryAuth = await Auth(login1, pass1);
                    if (tryAuth.status === 'ok') {
                        await AsyncStorage.setItem('@token', tryAuth.token);
                    }else
                        Toast.show('Проблема при авторизации');
                }

                console.log('token', token)

                    if (await updater())
                        Toast.show('Данные обновились');
                    else
                        Toast.show('Что-то пошло не так...');
                }
                else
                    Toast.show('Проблема при авторизации');


        } catch (e) {
            console.log(e)
            navigation.navigate('Login')
        }finally {
            setLoading(false);
        }
    }
    const send = async() => {
        try {
            setLoading(true)

            if (await SyncOrders()) {
                setRefresher(!refresher)
            }

            if (await SyncReturns()) {
                setRefresher(!refresher)
            }

            if (await SyncPKO()){
                setRefresher(!refresher)
            }

            const db = await getDBConnection();
            const token = await AsyncStorage.getItem('@token');
            let orders = await getAllItems(db, 'requests');
            // console.log('orders', orders)
            const unsyncOrders = orders.filter(order=>order.sync_status === 0)

            if(unsyncOrders) {
                await unsyncOrders.map((i) => {
                    i.list = JSON.parse(i.list)
                })
                for(let i=0; i < unsyncOrders.length; i++ ) {
                    const value = unsyncOrders[i];

                    const data = {order_id: value.id}
                    await SendUnsyncRequest(token, data)
                }


            }
        } catch (e) {
            console.log(e)
        }finally {
            setLoading(false)
            Toast.show('Заявки отправлены');
            doNavigation('Home')

            // closer()
        }


    }

    const onShow = async () => {
        try{
            var naming = await AsyncStorage.getItem('@login');
            naming = naming.replace('@agg.md', '').split('_');
            naming = naming.map((i) => {
                i = i.charAt(0).toUpperCase() + i.slice(1);
                return i
            })
            naming = naming.join(' ');
            setName(naming);
        }
        catch{
            setName();
        }
    }

    function sureModalVis(value, type){
        if (type){
            setSureModalValue(type);
            switch (type){
                case 'send':
                    setSureModalText('Вы уверены, что хотите отправить?');
                    break;
                case 'logout':
                    setSureModalText('Вы уверены, что хотите отправить?');
                    break;
                case 'update':
                    setSureModalText('Вы уверены, что хотите обновить?');
                    break;
            }
        }
        setSureModal(value);
    }

    function sureModalPicked(){
        // console.log(sureModalValue)
        switch (sureModalValue){
            case 'send':
                send();
                break;
            case 'logout':
                logOut();
                break;
            case 'update':
                updateHandler()
                break;
        }
    }
    const onExit = ()=>{
        setSureModalValue('logout');
        setSureModal(true);
        setSureModalText('Вы уверены, что хотите выйти?');
    }
    const onSend = ()=>{
        setSureModalValue('send');
        setSureModal(true);
        setSureModalText('Вы уверены, что хотите отправить?');
    }
    const onUpdate = ()=>{
        setSureModalValue('update');
        setSureModal(true);
        setSureModalText('Вы уверены, что хотите обновить?');
    }
    const logOut = async()=> {
        await AsyncStorage.removeItem('@login');
        await AsyncStorage.removeItem('@pass');
        await AsyncStorage.removeItem('@token');
        doNavigation('Login');
    }
    return(
        <Modal
            onShow={onShow}
            isVisible={visible}
            animationIn="slideInLeft"
            animationOut="slideOutLeft"
            style={style.backdrop}
            onBackdropPress={closer}
            onSwipeComplete={closer}
            swipeDirection="left"
            hideModalContentWhileAnimating={true}
            children={
                <View style={style.background}>
                    <View style={style.top2}>
                        <View style={style.top1}>
                            <View style={style.userSec}>
                                <View style={style.userAvatar}>
                                    <FontAwesome5
                                        size={60}
                                        color='#DFDFDF'
                                        name='user-alt'
                                    />
                                </View>
                                <Text style={style.username}>
                                    {name ? name : 'Username'}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={style.menu}>
                        <View style={style.mainList}>
                            <TouchableOpacity
                                onPress={() => doNavigation('Home')}
                                style={style.liBtn}
                            >
                                <Text style={style.liText}>Главная</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => doNavigation('ReturnScreen')}
                                style={style.liBtn}
                            >
                                <Text style={style.liText}>{consts.RETURN}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => doNavigation('RequestScreen')}
                                style={style.liBtn}
                            >
                                <Text style={style.liText}>{consts.REQUESTS}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => doNavigation('PKOScreen')}
                                style={style.liBtn}
                            >
                                <Text style={style.liText}>{consts.PKO}</Text>
                            </TouchableOpacity>


                            <TouchableOpacity
                                onPress={() => onUpdate()}
                                style={style.liBtn}
                            >
                                <Text style={style.liText}>Обновление</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => onSend()}
                                style={style.liBtn}
                            >
                                <Text style={style.liText}>Отправить</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={style.liBtn}
                                onPress={() => doNavigation('CleanScreen')}
                            >
                                <Text style={style.liText}>Очистить историю</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={()=>onExit()}

                                style={style.liBtn}
                            >
                                <Text style={style.liText}>{consts.LOGOUT}</Text>
                            </TouchableOpacity>
                        </View>
                        <SureModal
                            visible={sureModal}
                            setVisible={sureModalVis}
                            callback={sureModalPicked}
                            text={sureModalText}
                        />
                        <Loading visible={loading} text='Синхронизация'/>
                    </View>
                </View>


            }
        >


        </Modal>
    )
}

const style = StyleSheet.create({
    background: {
        backgroundColor: 'white',
        maxWidth: '80%',
        flex: 1
    },
    backdrop: {
        margin: 0,
        height: '100%',
    },
    top2: {
        backgroundColor: '#ff6365',
        height: 160,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    top1: {
        paddingTop: 10,
        backgroundColor: 'white',
        height: 120,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    userSec: {
        alignItems: 'center',
    },
    userAvatar: {
        borderRadius: 1000,
        borderWidth: 2,
        borderColor: '#ff6365',
        overflow: 'hidden'
    },
    username: {
        color: 'black',
        fontSize: 20
    },
    menu: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 30,
        marginTop: 30
    },
    mainList: {

    },
    bottomList: {

    },
    liBtn: {
        paddingVertical: 5
    },
    liText: {
        textTransform: 'capitalize',
        fontSize: 20,
        color: 'black'
    }
})

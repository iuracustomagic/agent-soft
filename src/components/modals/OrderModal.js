import React, {useState, useMemo, useEffect, useContext} from 'react';
import { ActivityIndicator, Modal, StyleSheet, View, FlatList, Text, TouchableOpacity, TouchableHighlight } from 'react-native';
import AntIcon from "react-native-vector-icons/AntDesign";
import { consts } from '../../consts/const';
import {deleteItem, getAllItems, getDBConnection} from '../../db/db';
import { DefaultBtn } from '../DefaultBtn';
import { DefaultTextInput } from '../DefaultTextInput';
import Toast from "react-native-simple-toast";
import {SureModal} from "./SureModal";



export const OrderModal = ({visible, setVisible, item, productList, pko, returned,  navigation}) => {

    const [sureModal, setSureModal] = useState(false);
    const [sureModalText, setSureModalText] = useState('');
    const [sureModalValue, setSureModalValue] = useState('');

    async function sureModalPicked(){
        // console.log(sureModalValue)
        switch (sureModalValue){
            case 'delete':
              await  deleteRequest();
                break;
            default:
                hide()
        }
    }
    function sureModalVis(value, type){
        if (type){
            setSureModalValue(type);
            switch (type){
                case 'delete':
                    setSureModalText('Вы уверены, что хотите удалить?');
                    break;

            }
        }
        setSureModal(value);
    }

    const onDelete = ()=>{
        console.log('onDelete')
        setSureModalValue('delete');
        setSureModal(true);
        setSureModalText('Вы уверены, что хотите удалить?');
    }

    const hide = () => {
        //console.log(list1)
        setVisible(false);
    }

        const copy = () =>{
                hide()
            if(pko) {
                console.log('pko',pko)
                console.log('item',item)
                navigation.navigate('CopyPkoScreen', item);
            } else {
                navigation.navigate('CopyRequestScreen', item);
            }
        }

    const edit = () =>{
        console.log('edit')
        console.log('item',item)

        hide()
        if(returned) {

            navigation.navigate('EditReturnScreen', item);
        }
       else if(pko) {
            console.log('pko', pko)
            navigation.navigate('EditPkoScreen', item);
        } else {
            console.log('pko', pko)
            navigation.navigate('EditRequestScreen', item);
        }
    }

    const deleteRequest = async() =>{

        const db = await getDBConnection();
        try{
            if(returned) {
                await deleteItem(db, 'unsyncReturns', item.id )
                Toast.show('Возврат успешно удален');
                navigation.replace('ReturnScreen');
            } else if(pko) {
                await deleteItem(db, 'unsyncPKO', item.id )
                Toast.show('ПКО успешно удален');
                navigation.replace('PKOScreen');
            } else {
                await deleteItem(db, 'unsyncReqs', item.id )
                Toast.show('Заявка успешно удалена');
                navigation.replace('RequestScreen');
            }

        }catch (e) {
            console.log(e)
        }finally {
            hide()
        }

        // console.log('item',item)

    }


    if (!visible)
        return null;

    return(
        <Modal
            style={style.background}
            transparent={false}
            animationType='slide'
            onRequestClose={hide}
            //onShow={onShow}
        >
            <View style={[style.center, style.background]}>
                {/*<TouchableOpacity style={style.copyContainer} onPress={copy}>*/}
                {/*    <AntIcon*/}
                {/*        size={55}*/}
                {/*        name='copy1'*/}
                {/*        color='black'*/}
                {/*    />*/}
                {/*</TouchableOpacity>*/}
                {item.local ?<View style={style.btnContainer}>
                        <TouchableOpacity style={style.editContainer} onPress={edit}>
                            <AntIcon
                                size={45}
                                name='edit'
                                color='blue'
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={style.deleteContainer} onPress={onDelete}>
                            <AntIcon
                                size={45}
                                name='delete'
                                color='red'
                            />
                        </TouchableOpacity>
                    </View>:
                    <TouchableOpacity style={style.copyContainer} onPress={copy}>
                        <AntIcon
                            size={55}
                            name='copy1'
                            color='black'
                        />
                    </TouchableOpacity>
                }

    <Text style={style.orgName}>Клиент: {item.client_name}</Text>



                <Text style={style.storeName}>{item.store_name}</Text>
                {pko &&
                <Text style={style.orgName}>Поставщик: {item.supplier_name}</Text>
                }
                <Text style={style.dateSum}>Дата заявки: {item.order_date}</Text>
                {!pko && <Text style={style.dateSum}>Дата доставки: {item.delivery_date}</Text>}

                <Text style={style.dateSum}>{pko ? 'Сумма' : 'Стоимость'}: {item.amount}</Text>
                {
                    item.comment.length ?
                        <Text style={style.dateSum}>Комментарий: {item.comment}</Text>
                        :
                        <></>
                }
                {/* "check_required": checkRequired, // 0 или 1
                    "doc_type": docType, // 0 или 1, 0 - cash, 1 - invoice
                    "exported": 0, // 0 или 1
                    "print_cert": printCert, // 0 или 1
                    "promo": promo, // 0 или 1 */}
                {
                    item.doc_type === true ?
                        <Text style={style.dateSum}>Тип документа:
                            <AntIcon
                                size={16}
                                name='check'
                                color='green'
                            />
                        </Text>
                        :
                        <></>
                }
                {
                    item.check_required === true ?
                        <Text style={style.dateSum}>Счет с чеком:
                            <AntIcon
                                size={16}
                                name='check'
                                color='green'
                            />
                        </Text>
                        :
                        <></>
                }
                {
                    item.print_cert === true ?
                        <Text style={style.dateSum}>Печать сертификата:
                            <AntIcon
                                size={16}
                                name='check'
                                color='green'
                            />
                        </Text>
                        :
                        <></>
                }
                {
                    item.promo === true ?
                        <Text style={style.dateSum}>Акция:
                            <AntIcon
                                size={16}
                                name='check'
                                color='green'
                            />
                        </Text>
                        :
                        <></>
                }
                {/* {
                    returned &&
                    <Text style={style.dateSum}>Причина: {item.list[0].return_type}</Text>
                } */}
                {/* <Text style={[style.dateSum, style.unsync]}>
                    Заявка сохранена на устройстве, но не отправлена на сервер.
                    При подключении к интернету, она будет синхронизирована.
                </Text> */}
                <FlatList
                    style={style.fl}
                    data={item.list}
                    keyExtractor={product => product.nomenclature_id}
                    ItemSeparatorComponent={separatorItem}
                    ListHeaderComponent={!pko && <Text style={style.list}>Список товаров:</Text>}
                    renderItem={
                        ({item}) => {
                            return (
                                <View>
                                    <Text style={style.title}>
                                        {item.nomenclature}
                                    </Text>
                                    <Text style={style.priceQty}>
                                        Цена: {item.price} Количество: {item.quantity}
                                    </Text>
                                </View>
                            )
                        }
                    }
                />
                <DefaultBtn
                    callback={hide}
                    text={consts.CLOSE}
                />
            </View>
            <SureModal
                visible={sureModal}
                setVisible={sureModalVis}
                callback={sureModalPicked}
                text={sureModalText}
            />
        </Modal>
    )
}

const separatorItem = () => {
    return(
        <View style={style.separator}>
        </View>
    )
}

const style = StyleSheet.create({
    background: {
        flex: 1,
        position: 'relative',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%',
        paddingTop: 10,
        paddingHorizontal: 10
    },
    separator: {
        borderBottomColor: '#c8c8c8',
        borderBottomWidth: 1,
        height: 5,
        width: '100%'
    },
    title: {
        fontSize: 16,
        color: 'black'
    },
    priceQty: {
        fontSize: 14,
        color: 'black'
    },
    fl: {
        marginTop: 8
    },
    orgName: {
        width: '80%',
        fontSize: 20,
        color: 'black',
        textDecorationLine: 'underline'
    },
    storeName: {
        width: '85%',
        fontSize: 18,
        color: 'black'
    },
    dateSum: {
        fontSize: 16,
        color: 'black'
    },
    list: {
        fontSize: 18,
        color: 'black',
        marginBottom: 4
    },
    unsync: {
        color: '#ff6365',
    },
    copyContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    editContainer: {
       marginRight: 15,
    },
    deleteContainer: {

    },
    btnContainer: {
        // position: 'absolute',
        // top: 20,
        // right: 20,
        flex: 0.2,
        // marginTop: 10,
        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'space-between',
    }
})

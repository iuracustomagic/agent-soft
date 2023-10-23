import React, { useState, useMemo, useEffect } from 'react';
import { ActivityIndicator, Modal, StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import AntIcon from "react-native-vector-icons/AntDesign";
import { consts } from '../../consts/const';
import { getAllItems, getDBConnection } from '../../db/db';
import { DefaultBtn } from '../DefaultBtn';
import { DefaultTextInput } from '../DefaultTextInput';



export const OrderModal = ({visible, setVisible, item, productList, pko, returned,  navigation}) => {



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
                <TouchableOpacity style={style.copyContainer} onPress={copy}>
                    <AntIcon
                        size={55}
                        name='copy1'
                        color='black'
                    />
                </TouchableOpacity>
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
                    item.doc_type == true ?
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
                    item.check_required == true ?
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
                    item.print_cert == true ?
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
                    item.promo == true ?
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
    }
})

import React, { useState, useMemo, useRef } from 'react';
import {  Modal, StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';

import { consts } from '../../consts/const';

import { IconBtn } from '../IconBtn';
import Toast from 'react-native-simple-toast';
import { RestBtn } from '../RestBtn';
import { SearchInput } from '../SearchInput';


export const ProductPicker = ({visible, setVisible, products, chooseProduct, removeProduct}) => {

    const [search, setSearch] = useState('');
    const [clearBtn, setClearBtn] = useState(true);
    const [refresh, setRefresh] = useState(true);

    const input = useRef();

    //console.log(products)

    const filtered = useMemo(() => {
        if (search){
            setClearBtn(true)
            return products.filter(i => i.name.toLowerCase().includes(search.toLocaleLowerCase()))
        }
        else
            setClearBtn(false)

    }, [search])

    const hide = () => {
        setSearch();
        setVisible(false);
    }

    if (!visible)
        return null;

    function countQty(balance){
        var count = balance;
        var sum = 0;
        if (count)
            if (count != 'null')
                count.map(i => {
                    sum += i.total;
                })
        return sum;
    }



    return(
        <Modal
            style={style.background}
            transparent={false}
            animationType='slide'
            onRequestClose={hide}
        >
            <View style={[style.center, style.background, style.container]}>
                <View style={style.searchbar}>
                    <SearchInput
                        placeholder={consts.SEARCH}
                        onChangeText={setSearch}
                        value={search}
                        styling={style.input}
                        innerRef={input}
                    />
                    <IconBtn
                        icon='close'
                        size={24}
                        color='black'
                        styling={style.iconBtn}
                        visible={clearBtn}
                        callback={() => {
                            input.current.clear();
                            setSearch('');
                        }}
                    />
                </View>
                <FlatList
                    data={filtered ? filtered : products}
                    keyExtractor={item => item.id}
                    extraData={refresh}
                    renderItem={
                        ({item}) => {
                            var qty = 0;
                            if (item.balance != 'null')
                                qty = countQty(item.balance);
                            return(
                                <TouchableOpacity
                                    onPress={() => {
                                        if (item.real_price != 0)
                                            chooseProduct(item);
                                        else{

                                            Toast.show('Невозможно добавить товар без цены. Обратитесь к менеджеру.')
                                        }

                                    }}
                                    style={[style.item, style.singleItem, item.color != 'null' && item.color != 'Default' && {backgroundColor: item.color.toLowerCase()}]}
                                >
                                    <View style={style.row}>
                                        <Text style={[style.text, item.already && style.alreadyChosen]}>
                                            {item.name}
                                        </Text>

                                    </View>

                                    <View style={style.info}>
                                        <Text style={[style.text, item.already && style.alreadyChosen]}>
                                            Цена: {item.real_price} Кол-во: {qty}
                                        </Text>
                                        {
                                            item.pickedQty &&
                                            <View style={style.added}>
                                                <Text style={[style.text, item.already && style.alreadyChosen]}>
                                                Добавлено: {item.pickedQty}

                                                </Text>
                                                <IconBtn
                                                    icon='close'
                                                    color='#5D9BD2'
                                                    size={30}
                                                    callback={() => {
                                                        setRefresh(!refresh);
                                                        removeProduct(item.id);
                                                    }}
                                                />
                                            </View>

                                        }
                                    </View>
                                </TouchableOpacity>
                            )
                        }


                    }
                />
                <RestBtn
                    callback={hide}
                    text={consts.BACK}
                />
            </View>
        </Modal>
    )
}

const style = StyleSheet.create({
    container: {
        padding: 10,
    },
    background: {
        flex: 1,
        justifyContent: 'space-between',
        height: '100%',
        width: '100%'
    },
    separator: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        height: 1,
        width: '100%'
    },
    alreadyChosen: {
        color: '#5D9BD2'
    },
    text: {
        color: 'black',
        fontSize: 22,
        justifyContent: 'space-between'
    },
    info: {
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    item: {
        paddingHorizontal:  2
    },
    searchbar: {
        position: 'relative'
    },
    input: {
        position: 'relative',
        fontSize: 24,
        maxHeight: 35
    },
    iconBtn: {
        position: 'absolute',
        right: 5,
        bottom: 5
    },
    added: {
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    colored: {
        width: 24,
        height: 24,
        borderColor: 'black',
        borderWidth: 1,
        alignSelf: 'center'
    },
    row: {
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    singleItem: {
        borderColor: '#eeeeee',
        borderWidth: 1,
        borderRadius: 15,
        marginVertical: 4,
        marginHorizontal: 2,
        paddingHorizontal: 10,
        paddingVertical: 5,
        elevation: 4,
        backgroundColor: 'white'
    },
})

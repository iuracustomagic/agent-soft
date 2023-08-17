import React, { useState, useMemo, useRef } from 'react';
import { ActivityIndicator, Modal, StyleSheet, View, FlatList, Text, TouchableOpacity, ToastAndroid } from 'react-native';
import AntIcon from "react-native-vector-icons/AntDesign";
import { consts } from '../../consts/const';
import { getAllItems, getDBConnection } from '../../db/db';
import { DefaultBtn } from '../DefaultBtn';
import { DefaultTextInput } from '../DefaultTextInput';
import { IconBtn } from '../IconBtn';
import Toast from 'react-native-simple-toast';
import { RestBtn } from '../RestBtn';
import { SearchInput } from '../SearchInput';



export const CategoryPicker = ({visible, setVisible, suppliers, categories, chosenCategory, products, chooseProduct, removeProduct}) => {

    const [refresh, setRefresh] = useState(false);
    const [search, setSearch] = useState('');
    const [clearBtn, setClearBtn] = useState(true)

    const input = useRef();

    const filtered = useMemo(() => {
        if (search){
            setClearBtn(true)
            var newAr = products ? categories.concat(products) : categories;
            console.log(products);
            console.log(newAr.filter(i => i.name.toLowerCase().includes(search.toLocaleLowerCase())));
            return newAr.filter(i => i.name.toLowerCase().includes(search.toLocaleLowerCase()))
        }
        else
            setClearBtn(false)
            
    }, [search])



    const hide = () => {
        setSearch();
        setVisible(false);
    }
    function countQty(balance){
        var count = [];
        try{
            count = JSON.parse(balance);
        }
        catch{
            count = [
                {"quantity": 0}
            ]
        }
        var sum = 0;
        count.map(i => {
            sum += i.quantity;
        })
        return sum;
    }

    if (!visible)
        return null;
    
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
                        //placeholder={consts.SEARCH}
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
                    data={filtered ? filtered : suppliers}
                    keyExtractor={item => item.id}
                    extraData={refresh}
                    renderItem={
                        ({item}) => {
                            var qty = 0;
                            if (item.balance != 'null' && item.balance)
                                qty = countQty(item.balance);
                            return(
                                <View>
                                    {
                                        
                                        !item.visible ?
                                        //if filtered (using search)
                                            !item.organization_id ?
                                            <TouchableOpacity
                                                style={style.singleItem}
                                                onPress={() => {
                                                    if (!filtered){
                                                        setRefresh(!refresh);
                                                        item.visible = !item.visible
                                                    }
                                                    else{
                                                        chosenCategory(item.id)
                                                    }
                                                    
                                                }}
                                            >
                                                <Text style={[style.title, filtered && {fontSize: 22}, item.already && style.alreadyChosen, item.blocked && {color: '#ff6365'}]}>
                                                    {item.name}
                                                </Text>
                                            </TouchableOpacity>
                                            :
                                            
                                            <TouchableOpacity
                                                onPress={() => {
                                                    if (item.real_price != 0)
                                                        chooseProduct(item);
                                                    else
                                                        Toast.show('Невозможно добавить товар без цены. Обратитесь к менеджеру.')
                                                        
                                                }}
                                                style={[style.item, style.singleItem, item.color != 'null' && item.color != 'Default' && {backgroundColor: item.color.toLowerCase()}]}
                                            >
                                                <View style={style.row}>
                                                    <Text style={[style.text, item.already && style.alreadyChosen]}>
                                                        {item.name}
                                                    </Text>
                                                    {
                                                        /* item.color != 'null' &&
                                                            item.color != 'Default' ?
                                                                <View style={[style.colored,  {backgroundColor: item.color.toLowerCase()}]}></View>
                                                                :
                                                                <></> */
                                                    }
                                                    
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
                                        :
                                        //default state
                                        <TouchableOpacity
                                            style={style.singleItem}
                                            onPress={() => {
                                                setRefresh(!refresh);
                                                item.visible = !item.visible
                                            }}
                                        >
                                            <Text style={[style.title, item.blocked && {color: '#ff6365'}]}>
                                                {item.name}
                                            </Text>
                                            {item.cats.map(c => {
                                                return(
                                                    <TouchableOpacity
                                                        style={style.openedItem}
                                                        key={c.id}
                                                        onPress={() => {chosenCategory(c.id)}}
                                                    >
                                                        <Text style={[style.cat, c.already && style.alreadyChosen]}>{c.name}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })}
                                        </TouchableOpacity>
                                    }
                                </View>
                            )
                        }
                        
                        
                    }
                />
                <RestBtn
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
    openedItem: {
        marginBottom: 2,
        /* borderLeftWidth: 1,
        borderRightWidth: 1, */
        borderBottomWidth: 1,
        borderColor: '#b0b0b0',
        borderRadius: 5,
        marginLeft: 4,
        paddingLeft: 4
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
    container: {
        padding: 10
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
    title: {
        fontSize: 22,
        color: 'black'
    },
    cat: {
        fontSize: 22,
        color: 'black'
    },
    alreadyChosen: {
        color: '#5D9BD2'
    },
    searchbar: {
        position: 'relative',
        marginBottom: 5,
        jusc: 'center'
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
    }
})
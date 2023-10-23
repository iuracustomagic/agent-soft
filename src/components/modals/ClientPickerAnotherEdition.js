import React, { useState, useMemo, useEffect, useRef } from 'react';
import {  Modal, StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';

import { consts } from '../../consts/const';

import { IconBtn } from '../IconBtn';
import { RestBtn } from '../RestBtn';
import { SearchInput } from '../SearchInput';



export const ClientPickerAll = ({visible, setVisible, stores, chooseStore}) => {

    const [search, setSearch] = useState('');
    const [clearBtn, setClearBtn] = useState(true)

    const input = useRef();

    const filtered = useMemo(() => {
        if (search){
            setClearBtn(true)
            return stores.filter(i => i.name.toLowerCase().includes(search.toLocaleLowerCase()))
        }
        else
            setClearBtn(false)

    }, [search])

    const hide = () => {

        setVisible(false);
    }

    useEffect(() => {
        if (!visible)
            setSearch();
        // console.log(stores)

    }, [visible])

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
                    data={filtered ? filtered : stores}
                    keyExtractor={item => item.id}
                    renderItem={
                        ({item}) =>
                        <TouchableOpacity
                            style={style.singleItem}
                            onPress={() => {chooseStore(item)}}
                        >
                            <Text style={[style.blck, style.fs20, item.blocked == 1 && {color: '#ff6365'}]}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>

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

const style = StyleSheet.create({
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
        borderBottomColor: '#c8c8c8',
        borderBottomWidth: 1,
        height: 5,
        width: '100%'
    },
    blck: {
        color: 'black'
    },
    searchbar: {
        position: 'relative',
        marginBottom: 5
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
    fs20: {
        fontSize: 20
    }
})

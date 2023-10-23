import React, { useState, useMemo, useEffect } from 'react';
import {  Modal, StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';

import { consts } from '../../consts/const';

import { DefaultBtn } from '../DefaultBtn';
import { DefaultTextInput } from '../DefaultTextInput';



export const ClientPicker = ({visible, setVisible, clients, chooseClient}) => {

    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        if (search)
            return clients.filter(i => i.name.toLowerCase().includes(search.toLocaleLowerCase()))
    }, [search])

    const hide = () => {

        setVisible(false);
    }

    useEffect(() => {
        if (!visible)
            setSearch();
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
            <View style={[style.center, style.background]}>
                <DefaultTextInput
                    style={style.input}
                    placeholder={consts.SEARCH}
                    onChangeText={setSearch}
                />
                <FlatList
                    data={filtered ? filtered : clients}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={separatorItem}
                    renderItem={
                        ({item}) =>
                        <TouchableOpacity
                            onPress={() => {chooseClient(item)}}
                        >
                            <Text>
                                {item.name}
                            </Text>
                        </TouchableOpacity>

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
})

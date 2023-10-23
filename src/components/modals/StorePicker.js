import React from 'react';
import {  Modal, StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';

import { consts } from '../../consts/const';

import { DefaultBtn } from '../DefaultBtn';




export const StorePicker = ({visible, setVisible, stores, chooseStore}) => {

    //console.log(stores)

    const hide = () => {
        setVisible(false);
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
            <View style={[style.center, style.background]}>
                {/* <DefaultTextInput
                    style={style.input}
                    placeholder={consts.SEARCH}
                /> */}
                <FlatList
                    data={stores}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={separatorItem}
                    renderItem={
                        ({item}) =>
                        <TouchableOpacity
                            onPress={() => {chooseStore(item)}}
                        >
                            <Text>
                                {item.name}
                            </Text>
                        </TouchableOpacity>

                    }
                />
                <DefaultBtn
                    callback={hide}
                    text={consts.BACK}
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

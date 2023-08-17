import React, { useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import AntIcon from "react-native-vector-icons/AntDesign";
import { consts } from '../../consts/const';
import { getAllItems, getDBConnection } from '../../db/db';
import { DefaultBtn } from '../DefaultBtn';
import { DefaultTextInput } from '../DefaultTextInput';
import { RestBtn } from '../RestBtn';



export const SupplierPicker = ({visible, setVisible, suppliers, chooseSupplier}) => {

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
            <View style={[style.center, style.background, style.container]}>
                {/* <DefaultTextInput
                    style={style.input}
                    placeholder={consts.SEARCH}
                /> */}
                <FlatList
                    data={suppliers}
                    keyExtractor={item => item.id}
                    renderItem={
                        ({item}) =>
                        <TouchableOpacity
                            style={style.singleItem}
                            onPress={() => {chooseSupplier(item)}}
                        >
                            <Text style={style.text}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                        
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
    text: {
        fontSize: 24,
        color: 'black'
    }
})
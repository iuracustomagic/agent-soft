import React from 'react';
import {  Modal, StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';

import { consts } from '../../consts/const';

import { RestBtn } from '../RestBtn';



export const TypeOfReturnPicker = ({visible, setVisible, types, chooseType}) => {

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
                    data={types}
                    keyExtractor={item => item.id}
                    renderItem={
                        ({item}) =>
                        <TouchableOpacity
                            style={style.singleItem}
                            onPress={() => {chooseType(item)}}
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
})

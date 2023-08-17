import React, { useState, useRef, useEffect } from 'react';
import { ActivityIndicator, Modal, StyleSheet, View, FlatList, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AntIcon from "react-native-vector-icons/AntDesign";
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { consts } from '../../consts/const';
import { getAllItems, getDBConnection } from '../../db/db';
import { DefaultBtn } from '../DefaultBtn';
import { DefaultTextInput } from '../DefaultTextInput';
import { IconBtn } from '../IconBtn';
import { RestBtn } from '../RestBtn';



export const SureModal = ({visible, setVisible, callback, text}) => {


    const hide = () => {
        setVisible(false);
    }

    if (!visible)
        return null;

    
    
    return(
        <Modal
            transparent={true}
            animationType='slide'
            onRequestClose={hide}
        >
                <View style={[style.background]}>
                    <Pressable
                        onPress={() => {hide()}}
                        style={style.backClckable}
                    >
                        <Pressable>
                            <View style={style.modalContainer}>
                                
                                <View style={style.inputRow}>
                                    <Text style={style.text}>
                                        {
                                            text ? text : 'Вы уверены?'
                                        }
                                    </Text>
                                </View>
                                

                                <View style={style.btnsRow}>
                                    <RestBtn
                                        active='#ff6365'
                                        text='Нет'
                                        upperText={true}
                                        flex={1}
                                        callback={() => {hide()}}
                                    />
                                    <RestBtn
                                        text='Да'
                                        upperText={true}
                                        flex={1}
                                        callback={() => {
                                            callback()
                                            hide()
                                        }}
                                    />
                                </View>
                            </View>
                        </Pressable>
                    </Pressable>
                </View>
            
        </Modal>
    )
}

const style = StyleSheet.create({
    background: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        height: '100%',
        width: '100%'
    },
    backClckable: {
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        height: 150,
        width: 200,
        borderRadius: 15,
    },
    btnsRow: {
        flex: 1,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        width: '100%'
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        color: 'black'
    }
})
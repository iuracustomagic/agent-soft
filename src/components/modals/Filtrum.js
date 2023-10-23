import React from 'react';
import { Modal, StyleSheet, View, FlatList, Text } from 'react-native';

import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { consts } from '../../consts/const';

import { DefaultBtn } from '../DefaultBtn';




export const Filtrum = ({visible, setVisible, callback}) => {


    const hide = () =>
        setVisible(false);

    const chooseFilter = (value) => {
        callback(value);
        hide();
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

                                <View style={style.blockF}>
                                    <Text style={style.titleF}>По дате</Text>
                                    <View style={style.rowF}>
                                        <DefaultBtn
                                            active='#ff6365'
                                            text='Старые'
                                            upperText={true}
                                            mt={5}
                                            flex={1}
                                            callback={() => {chooseFilter('dateUp')}}
                                        />
                                        <DefaultBtn
                                            active='#ff6365'
                                            text='Новые'
                                            upperText={true}
                                            mt={5}
                                            flex={1}
                                            callback={() => {chooseFilter('dateDown')}}
                                        />
                                    </View>
                                </View>
                                <View style={style.blockF}>
                                    <Text style={style.titleF}>По сумме</Text>
                                    <View style={style.rowF}>
                                        <DefaultBtn
                                            active='#ff6365'
                                            text='По возрастанию'
                                            upperText={true}
                                            mt={5}
                                            flex={1}
                                            callback={() => {chooseFilter('sumUp')}}
                                        />
                                        <DefaultBtn
                                            active='#ff6365'
                                            text='По убыванию'
                                            upperText={true}
                                            mt={5}
                                            flex={1}
                                            callback={() => {chooseFilter('sumDown')}}
                                        />
                                    </View>
                                </View>
                                <View style={style.blockF}>
                                    <Text style={style.titleF}>По названию</Text>
                                    <View style={style.rowF}>
                                        <DefaultBtn
                                            active='#ff6365'
                                            text='А->Я'
                                            upperText={true}
                                            mt={5}
                                            flex={1}
                                            callback={() => {chooseFilter('nameUp')}}
                                        />
                                        <DefaultBtn
                                            active='#ff6365'
                                            text='Я->А'
                                            upperText={true}
                                            mt={5}
                                            flex={1}
                                            callback={() => {chooseFilter('nameDown')}}
                                        />
                                    </View>
                                </View>


                                <View style={style.btnsRow}>
                                    <DefaultBtn
                                        active='#ff6365'
                                        text={consts.CANCEL}
                                        upperText={true}
                                        flex={1}
                                        callback={() => {hide()}}
                                    />
                                    <DefaultBtn
                                        active='#ff6365'
                                        text='сбросить'
                                        upperText={true}
                                        flex={1}
                                        callback={() => {chooseFilter('clear')}}
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
        width: '90%'
    },
    btnsRow: {
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
    blockF: {
        flexDirection: 'column',
        marginBottom: 8
    },
    titleF: {
        marginBottom: 0,
        color: 'black',
        fontSize: 16
    },
    rowF: {
        flexDirection: 'row'
    },
})

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



export const CounterForProductPicker = ({visible, setVisible, callback, product}) => {

    const [count, setCount] = useState(0);
    const ref = useRef();
    const [text, setText] = useState('Количество');

    //console.log(ref)

    /* useEffect(() => {
        console.log(ref)
        if (ref.current)
            ref.current.focus();
    }, [ref]); */

    async function onShow(){
        if (product.unit == 'kg.' || product.unit == 'kg')
            setText('Количество, кг')
        setTimeout(() => {
            ref.current?.focus();
        }, 50);
    }
    async function increase(){
        await setCount(parseFloat(count)+1);
    }
    async function decrease(){
        if (parseFloat(count)-1 > 0)
            await setCount(parseFloat(count)-1);
        else
            await setCount(0);
    }


    const hide = () => {
        setCount(0);
        setVisible(false);
    }

    const countHandler = () => {
        if (count > 0){
            console.log('count: ' + count)
            var lastCount = count;
            if (product.unit == 'kg.' || product.unit == '1' || product.unit == 'kg'){
                lastCount = lastCount.replace(',', '.');
                lastCount = parseFloat(lastCount);
            }
            else
                lastCount = parseInt(count)
    
            if (lastCount > 0){
                console.log(product)
                
                    
                const productToAdd = {
                    "nomenclature_id": product.id,
                    "nomenclature_guid": product.guid,
                    "nomenclature": product.name,
                    "price": product.real_price,
                    "quantity": lastCount,
                    //"kg": product.unit == 'kg' ? true : false
                };
                callback(productToAdd);
                hide();
                setCount(0);
            }
        }
    }

    if (!visible)
        return null;

    
    
    return(
        <Modal
            onShow={onShow}
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
                                    <IconBtn
                                        callback={decrease}
                                        icon='minuscircle'
                                        size={20}
                                        color='#ff6365'
                                        mt={20}
                                    />
                                    <DefaultTextInput
                                        placeholder={text}
                                        keyboardType='numeric'
                                        onChangeText={setCount}
                                        innerRef={ref}
                                        value={count}
                                        mt={10}
                                        onSubmitEditing={countHandler}
                                        styling={[{flex: 1, marginHorizontal: 10}]}
                                    />
                                    <IconBtn
                                        callback={increase}
                                        icon='pluscircle'
                                        size={20}
                                        color='#ff6365'
                                        mt={20}
                                    />
                                </View>
                                

                                <View style={style.btnsRow}>
                                    <RestBtn
                                        active='#ff6365'
                                        text={consts.CANCEL}
                                        upperText={true}
                                        callback={() => {hide()}}
                                        styling={[{paddingHorizontal: 12}]}
                                    />
                                    <RestBtn
                                        text={consts.ADD}
                                        upperText={true}
                                        callback={countHandler}
                                        styling={[{paddingHorizontal: 12}]}
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
        paddingHorizontal: 20,
        paddingVertical: 10,
        height: 150,
        width: 230,
        borderRadius: 15,
    },
    btnsRow: {
        marginTop: 20,
        flexDirection: 'row',
        alignSelf: 'flex-end',
        justifyContent: 'space-between',
        width: '100%'
    },
    inputRow: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
})
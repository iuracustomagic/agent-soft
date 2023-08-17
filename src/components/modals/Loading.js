import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, View, Text } from 'react-native';
import AntIcon from "react-native-vector-icons/AntDesign";



export const Loading = ({visible, text}) => {
    if (!visible)
        return null;
    
    return(
        <Modal
            style={style.background}
            transparent={true}
        >
            <View style={[style.center, style.background]}>
                <ActivityIndicator size={50} color={'white'} />
                {
                    text &&
                        <Text style={style.text}>{text}</Text>
                }
            </View>
        </Modal>
    )
}

const style = StyleSheet.create({
    background: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: 'white',
        fontSize: 18
    }
})
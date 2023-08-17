import React, { useState } from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  TextInput,
  View,
  Button,
  TouchableOpacity
} from 'react-native';
import { styles } from '../styles/styles';
import AntIcon from "react-native-vector-icons/AntDesign";

export const RestBtn = ({text, callback, icon, upperText, active, flex, mt, styling}) => {

    return(
        <TouchableOpacity
            style={[style.btn, active && {backgroundColor: active}, flex && {flex: flex}, mt && {marginTop: mt}, styling && [styling]]}
            onPress={callback}
        >
            <View style={style.center}>
                {
                    icon &&
                        <AntIcon
                            color='white'
                            name={icon}
                            size={16}
                            style={style.icon}
                        />
                }
                
                <Text style={[style.text, upperText && style.upperText, active && {color: 'white'}]}>
                    {text}
                </Text>
            </View>
        </TouchableOpacity>
    )
}
    
const style = StyleSheet.create({
    btn: {
        backgroundColor: 'white',
        borderColor: '#eeeeee',
        borderWidth: 1,
        borderRadius: 15,
        paddingVertical: 8,
        marginTop: 5,
        paddingHorizontal: 16,
        alignSelf: 'center',
        elevation: 4
    },
    text: {
        color: '#ff6365',
        textAlign: 'center'
    },
    center: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        marginRight: 5
    },
    upperText: {
        textTransform: 'uppercase'
    }
})
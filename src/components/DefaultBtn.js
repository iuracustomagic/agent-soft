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

export const DefaultBtn = ({text, callback, icon, upperText, active, flex, mt}) => {

    return(
        <TouchableOpacity
            style={[style.btn, active && {backgroundColor: active}, flex && {flex: flex}, mt && {marginTop: mt}]}
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

                <Text style={[style.text, upperText && style.upperText]}>
                    {text}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    btn: {
        backgroundColor: '#ff6365',
        borderColor: '#c8c8c8',
        borderWidth: 1,
        paddingTop: 8,
        paddingBottom: 8,
        marginTop: 20,
    },
    text: {
        color: 'white',
        textAlign: 'center'
    },
    center: {
        display: 'flex',
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

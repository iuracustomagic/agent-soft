import React, { useEffect, useState } from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  TextInput,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { consts } from '../consts/const';
import { styles } from '../styles/styles';
import AntIcon from "react-native-vector-icons/AntDesign";

export const SearchInput = ({placeholder, secureTextEntry, onChangeText, onSubmitEditing, onEndEditing, defValue, value, innerRef, keyboardType, pointerEvents, onTouchStart, editable, mt, autoFocus, styling}) => {

    const [text, setText] = useState('');

    function setterText(){
        if (value)
            setText(value.toString())
    }

    useEffect(() => {
        (() => {
          setterText();
        })();
    }, [value]);

    return(
        <View style={style.container}>
            <AntIcon
                name='search1'
                size={20}
                color='#c9c9cb'
            />
            <TextInput
                placeholderTextColor="#9d9d9d"
                onSubmitEditing={onSubmitEditing}
                ref={innerRef}
                autoFocus={autoFocus}
                style={[style.dti, mt && {marginTop: mt}, styling && [styling]]}
                onTouchStart={onTouchStart}
                editable={editable}
                keyboardType={keyboardType}
                pointerEvents={pointerEvents}
                placeholder={placeholder && placeholder}
                onChangeText={(text) => {
                    setText(text);
                    onChangeText && onChangeText(text);
                }}
                value={text}
                secureTextEntry={secureTextEntry}
                onEndEditing={() => onEndEditing && onEndEditing(text)}
                defaultValue={defValue && defValue}
            />
        </View>
    )
}
    
const style = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor:'#eaebed',
        borderWidth: 1,
        borderRadius: 15,
        backgroundColor: '#f4f5f7',
        paddingHorizontal: 10,
    },
    dti: {
        color: 'black',
        paddingVertical: 0,
        fontSize: 18,
        width: '100%'
    }
})
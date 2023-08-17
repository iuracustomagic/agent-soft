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

export const DefaultTextInput = ({placeholder, secureTextEntry, onChangeText, onSubmitEditing, onEndEditing, defValue, value, innerRef, keyboardType, pointerEvents, onTouchStart, editable, mt, autoFocus, styling}) => {

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
    )
}
    
const style = StyleSheet.create({
    dti: {
        borderBottomColor: '#c8c8c8',
        borderBottomWidth: 1,
        color: 'black',
        marginTop: 0,
        paddingBottom: 0,
        maxHeight: 30,
        fontSize: 18
    }
})
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

/* UNUSED!!! */

export const IconBtn = ({callback, icon, size, color}) => {

    return(
        <TouchableOpacity
            onPress={callback && callback}
        >
            <AntIcon 
                size={size ? size : 16}
                color={color ? color : 'white'}
                name={icon}
            />
        </TouchableOpacity>
    )
}
    
const style = StyleSheet.create({

})
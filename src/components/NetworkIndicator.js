import React, { useEffect, useState, useRef, useContext } from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { IconBtn } from './IconBtn';
import { LeftSideMenu } from './modals/LeftSideMenu';
import NetInfo from "@react-native-community/netinfo";
import { NetworkContext } from '../context';


export default NetoworkIndicator = () => {

    const [active, setActive] = useState(false);

    const {network} = useContext(NetworkContext);

    /* const open = () => {
        lsMenuSetVisible(true);
    } */
    return(
        <View style={[style.indicator, network ? {backgroundColor: 'green'} : {backgroundColor: 'red'}]}>
            
        </View>
    )
}



const style = StyleSheet.create({
    indicator: {
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'black',
        width: 14,
        height: 14,
        marginRight: 8
    }
})
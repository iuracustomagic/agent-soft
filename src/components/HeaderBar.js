import React, { useEffect, useState, useRef } from 'react';

import {
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { IconBtn } from './IconBtn';
import { LeftSideMenu } from './modals/LeftSideMenu';
import NetworkIndicator from './NetworkIndicator';
import { NavigationContainer, useNavigationContainerRef, useNavigation } from '@react-navigation/native';

export default HeaderBar = ({lsMenuSetVisible, navigation, lsMenu}) => {

    /* const navigationRef = useNavigationContainerRef();
    const route = navigationRef.getCurrentRoute(); */

    function opener(show){
        if (show)
            lsMenu(true)
    }

    return(
        <View style={style.header}>
            <View style={style.headerRow}>

                <View>
                    {/* <Image
                    //
                        source={require('../img/header_logo.jpg')}
                    /> */}
                </View>
                <View style={style.smth}>
                    <NetworkIndicator />
                    <IconBtn
                        callback={() => opener(true)}
                        fa5Icon='bars'
                        size={28}
                        color='white'
                    />
                </View>
            </View>
        </View>
    )
}



const style = StyleSheet.create({
    header: {
        height: 60,
        backgroundColor: '#ff6365',
        justifyContent: 'center'
    },
    headerBar: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'end',
        paddingBottom: 5,
    },
    headerName: {
        fontSize: 18,
        color: 'white',
        paddingLeft: 5
    },
    smth: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 16,
        flexDirection: 'row',
    },
    headerRow: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10
    }
})

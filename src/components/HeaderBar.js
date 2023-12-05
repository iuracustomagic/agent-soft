import React, {useEffect, useState, useRef, useContext} from 'react';

import {
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { IconBtn } from './IconBtn';

import NetworkIndicator from './NetworkIndicator';
import { NavigationContainer, useNavigationContainerRef, useNavigation } from '@react-navigation/native';
import {NetworkContext} from "../context";

export default function HeaderBar ({ setCloud, cloud, lsMenu}) {

    const {network, setNetwork} = useContext(NetworkContext);
    const [color, setColor] = useState(cloud ? 'green': 'red')

    function opener(show){
        if (show)
            lsMenu(true)
    }
    function onCloud() {
        setCloud(!cloud)
        if(cloud) {
            setColor('red')
        } else {
            setColor('green')
        }

    }
useEffect(()=>{

    console.log('HeaderBar cloud', cloud)
},[cloud])
    return(
        <View style={style.header}>
            <View style={style.headerRow}>
                <IconBtn
                    callback={() => onCloud()}
                    icon='clouddownloado'
                    size={28}
                    color={color}
                />
                <View>
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
        paddingTop: 15,
        backgroundColor: '#ff6365',
        justifyContent: 'center'
    },
    headerBar: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'end',
        // paddingBottom: 5,
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

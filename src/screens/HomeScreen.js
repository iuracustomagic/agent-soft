import React, {useState} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { consts, ver } from '../consts/const';
import HeaderBar from '../components/HeaderBar';
import { styles } from '../styles/styles';
import { DefaultBtn } from '../components/DefaultBtn';
import { IconBtn } from '../components/IconBtn';
import { LeftSideMenu } from '../components/modals/LeftSideMenu';

export const HomeScreen = ({navigation}) => {





    function requestScreen(){
        navigation.navigate('NewRequestScreen')
    }
    function returnScreen(){
        navigation.navigate('NewReturnScreen')
    }
    function pkoScreen(){
        navigation.navigate('NewPKOScreen')
    }

    return(
        <View style={{height: '100%'}}>
            {/* <HeaderBar
                navigation={navigation}
            /> */}

            {/* <View style={styles.hsCenterBlock}>
                <View style={styles.hsBtnsBlock}>
                    <DefaultBtn
                        text={consts.RETURN}
                        callback={returnScreen}
                        icon='filetext1'
                        upperText={true}
                    />
                    <DefaultBtn
                        text={consts.REQUEST}
                        callback={requestScreen}
                        icon='filetext1'
                        upperText={true}
                    />
                    <DefaultBtn
                        text={consts.PKO}
                        callback={pkoScreen}
                        icon='filetext1'
                        upperText={true}
                    />
                </View>
            </View> */}
            <View style={[styles.column, style.center]}>
                <View style={[styles.row,
                    {width: '80%', alignSelf: 'center'}]}>
                    <IconBtn
                        callback={returnScreen}
                        // fa5Icon='backward'
                        fa5Icon='file-prescription'
                        // icon='back'
                        size={35}
                        color='black'
                        text={consts.RETURN}
                        flexWidth={1}
                    />
                    <IconBtn
                        callback={requestScreen}
                        fa5Icon='file-import'
                        size={35}
                        color='black'
                        text={consts.REQUEST}
                        flexWidth={1}
                    />
                    <IconBtn
                        callback={pkoScreen}
                        fa5Icon='file-invoice'
                        size={35}
                        color='black'
                        text={consts.PKO}
                        flexWidth={1}
                    />
                </View>
            </View>
            <Text style={styles.version}>v1.4 {ver}</Text>

        </View>
    )
}

const style = StyleSheet.create({
    center: {
        justifyContent: 'center',
        height: '90%'
    },
})

import React from 'react';

import {
  StyleSheet,
  Text,
  View

} from 'react-native';

import { consts, ver } from '../consts/const';
import { styles } from '../styles/styles';

import { IconBtn } from '../components/IconBtn';


export const CleanScreen = ({navigation}) => {



    function requestScreen(){
        navigation.navigate('CleanRequestScreen')
    }
    function returnScreen(){
        navigation.navigate('CleanReturnScreen')
    }
    function pkoScreen(){
        navigation.navigate('CleanPkoScreen')
    }



    return(
        <View style={{height: '100%'}}>
            <Text style={style.title}>Очистить заявки</Text>
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
            <Text style={styles.version}>v1.5 {ver}</Text>

        </View>
    )
}

const style = StyleSheet.create({
    center: {
        justifyContent: 'center',
        height: '90%'
    },
    title:{
        // marginBottom: 10,
        fontSize: 26,
        alignSelf: 'center',
    }
})

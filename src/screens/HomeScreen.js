import React, {useEffect, useState} from 'react';

import {
  StyleSheet,
  Text,
  View,
    TextInput,
    Button
} from 'react-native';

import * as SQLite from 'expo-sqlite';

import { consts, ver } from '../consts/const';
import { styles } from '../styles/styles';

import { IconBtn } from '../components/IconBtn';


export const HomeScreen = ({navigation}) => {
    const [names, setNames] = useState([]);
    const [clients, setClients] = useState([]);
    const [currentName, setCurrentName] = useState(undefined);

const db = SQLite.openDatabase('db.db')

    function requestScreen(){
        navigation.navigate('NewRequestScreen')
    }
    function returnScreen(){
        navigation.navigate('NewReturnScreen')
    }
    function pkoScreen(){
        navigation.navigate('NewPKOScreen')
    }

    // useEffect(()=> {
    //     db.transaction(tx => {
    //         tx.executeSql('CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)')
    //     });
    //
    //
    //
    // },[db])

    const addName = () => {
        db.transaction(tx => {
            tx.executeSql('INSERT INTO names (name) values (?)', [currentName],
                (txObj, resultSet) => {
                    let existingNames = [...names];
                    existingNames.push({ id: resultSet.insertId, name: currentName});
                    setNames(existingNames);
                    setCurrentName(undefined);
                },
                (txObj, error) => console.log(error)
            );
        });
    }


    // const showNames = () => {
    //     return names.map((name, index) => {
    //         return (
    //             <View key={index} style={styles.row}>
    //                 <Text>{name.name}</Text>
    //
    //             </View>
    //         );
    //     });
    // };

    return(
        <View style={{height: '100%'}}>

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
                {/*<View>*/}
                {/*    <TextInput value={currentName} placeholder='name' onChangeText={setCurrentName} />*/}
                {/*    <Button title="Add Name" onPress={addName} />*/}
                {/*    {showNames()}*/}
                {/*</View>*/}
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

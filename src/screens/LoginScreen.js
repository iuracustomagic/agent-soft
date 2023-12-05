import React, { useEffect, useState, useRef } from 'react';

import {
  Text,
  View,
  Image
} from 'react-native';

import { consts, ver } from '../consts/const';
import { styles } from '../styles/styles';
import { DefaultTextInput } from '../components/DefaultTextInput';
import { DefaultBtn } from '../components/DefaultBtn';

import { Auth } from '../API/auth';
import Toast from 'react-native-simple-toast';
import { Loading } from '../components/modals/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { openDatabase } from 'expo-sqlite';
import updater from "../utils/updater";
import loginHandler from "../utils/login";
import {ValidToken} from "../API/api";

export const LoginScreen = ({navigation}) => {

  const [login, setLogin] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const inputPas = useRef();
  const db = openDatabase('db.db')

  const nextInp = () => {
    inputPas.current.focus();
  }



  useEffect(() => {
    async function checker(){
        setLoading(true);
        try {
            await loginHandler(navigation)
        } catch (e) {
            console.log(e)
        }finally {
            setLoading(false);
        }

      }
      async function tokenChecker() {
          try {
              const token = await AsyncStorage.getItem('@token');
              const validToken = await ValidToken(token)

              if (validToken.data === 'Token is valid') {
                  navigation.navigate('Home');
              } else checker()
          } catch (e) {
              checker()
          }
      }

      tokenChecker()
              // checker();
  }, [])


  async function nextScreen(){

      if (!login.length || !pass.length){
        Toast.show('Введите логин и пароль');
      }
      else{
        setLoading(true);
          console.log('nextScreen начало Auth')
        const tryAuth = await Auth(login, pass);
          console.log(JSON.parse(JSON.stringify(tryAuth)))
        if (JSON.parse(JSON.stringify(tryAuth)).status === "ok"){
          await AsyncStorage.setItem('@login', login);
          await AsyncStorage.setItem('@pass', pass);
          await AsyncStorage.setItem('@token', tryAuth.token);

          // navigation.navigate('Home');
          if (await updater())
            navigation.navigate('Home');
          else
            Toast.show('Ошибка соединения')
        }
        else
          Toast.show('Что-то пошло не так...');
        setLoading(false);
      }
  }


  return(
    <View style={styles.authFormBlock}>
      <View style={styles.authForm}>
        <Image
            style={styles.hsLogo}
            source={require('../img/agg_logo.png')}
        />
        <Text style={styles.authTitle}>{consts.AUTH}</Text>
        <DefaultTextInput
          placeholder={consts.LOGIN}
          onSubmitEditing={nextInp}
          onChangeText={setLogin}
          mt={15}
        />
        <DefaultTextInput
          innerRef={inputPas}
          placeholder={consts.PASSWORD}
          onChangeText={setPass}
          secureTextEntry={true}
          // onEndEditing={nextScreen}
          mt={15}
        />
        <DefaultBtn
          text={consts.AUTH}
          callback={nextScreen}
          icon='user'
          upperText={true}
        />
      </View>
      <Loading visible={loading} text='Синхронизация'/>
      <Text style={styles.version}>v1.5 {ver}</Text>
    </View>
  )
}

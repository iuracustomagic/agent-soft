import AsyncStorage from "@react-native-async-storage/async-storage";
import {Auth} from "../API/auth";
import updater from "./updater";
import Toast from "react-native-simple-toast";

export default async function  loginHandler(navigation) {
    const login1 = await AsyncStorage.getItem('@login');
    const pass1 = await AsyncStorage.getItem('@pass');
    console.log('начало Auth')
    if (login1 && pass1){
        const tryAuth = await Auth(login1, pass1);
        console.log(tryAuth)
        console.log('конец Auth')
        if (tryAuth.status === 'ok'){
            await AsyncStorage.setItem('@token', tryAuth.token);
            if (await updater())
                navigation.navigate('Home');
            else
                Toast.show('Что-то пошло не так...');
        }
        else
            Toast.show('Проблема при авторизации');

    } else navigation.navigate('Login');
}

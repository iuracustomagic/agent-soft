import { styles } from '../styles/styles';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Pressable,
    Button,
    TextInput,
    Modal } from 'react-native';
import { useEffect, useState } from 'react';
import { currentUrl } from '../consts/const';

export const Auth = async (login, password) => {
    /* data.append('login', login);
    data.append('password', password); */
    /* let data = JSON.stringify({
        "email": "macovei_iaroslav@agg.md",
	    "password": "5698"
    }); */
    let data = JSON.stringify({
        "email": login,
	    "password": password
    });
    console.log(data)
    var resp = await fetch(currentUrl + '/api/auth/login', {
        method: 'post',
        headers: {
            "Content-Type": "application/json",
        },
        body: data
    })
        .then((response) => {
            //console.log(response.json())
            return response.json()
        })
        .catch((error) => {console.log(error)});
    return resp;

}

export const AuthTest = async (login, password) => {
    data = new FormData();
    data.append('name', login);
    data.append('password', password);
    return data;
}

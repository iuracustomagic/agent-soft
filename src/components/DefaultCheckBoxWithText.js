import React from 'react';


import {
  StyleSheet,  Text,  View,
} from 'react-native';

import BouncyCheckbox from "react-native-bouncy-checkbox";

export const DefaultCheckBoxWithText= ({text, onChange}) => {




    function change(value){
        if (onChange)
            onChange(value)
    }


    return(
        <View style={style.container}>
            <Text
                style={style.label}
            >
                {text}
            </Text>
            <BouncyCheckbox
                size={25}
                fillColor="#ff6365"
                unfillColor="white"
                text="Custom Checkbox"
                iconStyle={{ borderColor: "#ff6365", borderRadius: 0 }}
                textStyle={{ fontFamily: "JosefinSans-Regular" }}
                onPress={(checked) => change(checked)}
                disableText={true}
            />

        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    label: {
        fontSize: 16,
        color: 'black'
    },
})

import React, {useEffect} from 'react';


import {
  StyleSheet,  Text,  View,
} from 'react-native';

import BouncyCheckbox from "react-native-bouncy-checkbox";

export const DefaultCheckBoxWithText= ({text, onChange, checked}) => {
    const [checkboxState, setCheckboxState] = React.useState(checked);

useEffect(()=>{
    if(checkboxState){
        onChange(1)
    } else onChange(0)
},[checkboxState])

    function change(value){
        if (onChange )
            onChange(value)
        if ( checked)
            onChange(checked)
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
                iconStyle={{ borderColor: "#ff6365"}}
                textStyle={{ fontFamily: "JosefinSans-Regular" }}
                // onPress={(checked) => change(checked)}
                onPress={() => setCheckboxState(!checkboxState)}
                disableText={true}
                isChecked={checkboxState}
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

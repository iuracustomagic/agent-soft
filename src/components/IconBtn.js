import React, { useState } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import { styles } from '../styles/styles';
import AntIcon from "react-native-vector-icons/AntDesign";
import Icon from "react-native-vector-icons/FontAwesome5";

export const IconBtn = ({callback, icon, size, color, text, fa5Icon, flexWidth, mt, styling, visible}) => {

    if (visible == false)
        return null

    return(
        <TouchableOpacity
            style={[style.btn, flexWidth && {flex: flexWidth}, mt && {marginTop: mt}, styling && [styling]]}
            onPress={callback && callback}
        >
            {
                icon &&
                    <AntIcon
                        size={size ? size : 16}
                        color={color ? color : 'white'}
                        name={icon}
                    />
            }

            {
                fa5Icon &&
                    <Icon
                        size={size ? size : 16}
                        color={color ? color : 'white'}
                        name={fa5Icon}
                    />
            }

            {
                text &&
                    <Text style={style.fontSize}>
                        {text}
                    </Text>
            }
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    fontSize: {
        fontSize: 24,
        fontFamily: 'JosefinSans-Regular',
        color: 'black'
    },
    btn: {
        display: 'flex',
        alignItems: 'center'
    }
})

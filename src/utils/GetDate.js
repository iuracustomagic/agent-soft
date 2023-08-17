import React, { useState } from 'react';

export const GetDate = (day) => {

    /* var date = new Date();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear(); */

    if (day == 'today'){
        var fulldate = (new Date());
        return fulldate.toLocaleDateString("en-US");
    }
    if (day == 'tomorrow'){
        var fulldate = (new Date());
        fulldate.setDate(fulldate.getDate() + 1)
        return fulldate.toLocaleDateString("en-US");
    }
}

export const CorrectDate = (date) => {
    var newDate = date.split('/')
    if (newDate[0].length == 1)
        newDate[0] = '0' + newDate[0];
    if (newDate[1].length == 1)
        newDate[1] = '0' + newDate[1];
    if (newDate[2].length == 2)
        newDate[2] = '20' + newDate[2];
    return newDate[2] + '-' + newDate[0] + '-' + newDate[1];
}

export const GetCorrectJSDate = (date) => {
    var newDate = date.split('-')
    newDate = new Date(newDate[0], newDate[1], newDate[2])
    //console.log(newDate.getTime())
    return newDate;
}

//mm/dd/yyyy - def
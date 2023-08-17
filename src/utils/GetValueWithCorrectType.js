
export const GetCorrectValueOfLine = (value) => {
    var result = Object.values(value);
    result.forEach(function(i, index, array){
        if (typeof(i) == "string"){
            array[index] = "'" + i + "'";
        }
    });
    //console.log('result: ' + result)
    return result
}

/* if (typeof(i) == "string"){
    //i = '\"' + i + '\"';
    i = 1;
    console.log('------------------- ' + i)
} */
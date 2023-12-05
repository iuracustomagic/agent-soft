
import { currentUrl } from '../consts/const';

export const Auth = async (login, password) => {

    let data = JSON.stringify({
        "email": login,
	    "password": password
    });
    console.log('login data', data)
    console.log('url', currentUrl + '/api/auth/login')

    // var myHeaders = new Headers();
    // myHeaders.append("Content-Type", "application/json");
    //
    // var raw = JSON.stringify({
    //     "email": "maltev_virgiliu@agg.md",
    //     "password": "7230"
    // });
    //
    // var requestOptions = {
    //     method: 'POST',
    //     headers: myHeaders,
    //     body: raw,
    //     redirect: 'follow'
    // };
    //
    // fetch("http://10.100.107.7:7735/Exchange/hs/api/auth/login", requestOptions)
    //     .then(response => response.text())
    //     .then(result => result)
    //     .catch(error => console.log('error', error));
    return await fetch(currentUrl + '/api/auth/login', {
        method: 'post',
        headers: {
            "Content-Type": "application/json",
        },
        body: data
    })
        .then((response) => {
          return response.json()
        })
        .catch((error) => {console.log(error.message)});


}

export const AuthTest = async (login, password) => {
  const data = new FormData();
    data.append('name', login);
    data.append('password', password);
    return data;
}

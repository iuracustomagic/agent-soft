
import { currentUrl } from '../consts/const';

export const Auth = async (login, password) => {

    let data = JSON.stringify({
        "email": login,
	    "password": password
    });
    console.log('login data', data)
    console.log('url', currentUrl + '/api/auth/login')
    return await fetch(currentUrl + '/api/auth/login', {
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
        .catch((error) => {console.log(error.message)});


}

export const AuthTest = async (login, password) => {
  const data = new FormData();
    data.append('name', login);
    data.append('password', password);
    return data;
}

import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { currentUrl } from '../consts/const';

export const PreSync = async (token) => {
    return await fetch(currentUrl + '/api/pre-sync', {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
    })
        .then((response) => {
            //console.log(response.json())
            return response.json();
        })
        .catch((error) => {return {
            'status': 'got error',
            'message': error.message,
        }});

}
export const ValidToken = async (token) => {

        const response =  await fetch(currentUrl + '/api/validate-token', {
            method: 'get',
            headers: {
                "Authorization": "Bearer " + token
            },
        })
        return await response.json()

}


export const GetNomenclatures = async (token) => {

    return await fetch(currentUrl + '/api/nomenclature/list', {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
    })
        .then((response) => {
            //console.log(response.json())
            return response.json();
        })
        .catch((error) => {return {
            'status': 'got error',
            'message': error.message,
        }});

}

export const GetClients = async (token) => {
    // console.log(token)
    return await fetch(currentUrl + '/api/clients/list', {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
    })
        .then((response) => {
            //console.log(response.json())
            return response.json();
        })
        .catch((error) => {return {
            'status': 'got error',
            'message': error.message,
        }});


}

export const GetSuppliers = async (token) => {
    return await fetch(currentUrl + '/api/nomenclature/suppliers-list', {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
    })
        .then((response) => {
            // console.log('GetSuppliers', response.json())
            return response.json();
        })
        .catch((error) => {return {
            'status': 'got error',
            'message': error.message,
        }});

}

export const GetCategories = async (token) => {
    return await fetch(currentUrl + '/api/nomenclature/categories-list', {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
    })
        .then((response) => {
            // console.log('GetCategories', response.json())
            return response.json();
        })
        .catch((error) => {return {
            'status': 'got error',
            'message': error.message,
        }});

}
export const GetRequests = async (token) => {
    return await fetch(currentUrl + '/api/orders/list', {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
    })
        .then((response) => {
            // console.log('GetRequests', response.json())
            return response.json();
        })
        .catch((error) => {return {
            'status': 'got error',
            'message': error.message,
        }});

}
export const GetReturns = async (token) => {
    return await fetch(currentUrl + '/api/returns/list ', {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
    })
        .then((response) => {
            // console.log('GetReturns', response)
            return response.json();
        })
        .catch((error) => {return {
            'status': 'got error',
            'message': error.message,
        }});

}
export const GetTypesOfReturns = async (token) => {
    return await fetch(currentUrl + '/api/returns/types/list', {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
    })
        .then((response) => {
            // console.log('GetTypesOfReturns', response.json())
            return response.json();
        })
        .catch((error) => {return {
            'status': 'got error',
            'message': error.message,
        }});

}
export const GetCashOrders = async (token) => {
    return await fetch(currentUrl + '/api/cash-order/list', {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
    })
        .then((response) => {
            // console.log('GetCashOrders', response.json())
            return response.json();
        })
        .catch((error) => {return {
            'status': 'got error',
            'message': error.message,
        }});

}

export const SendNewRequest = async (token, data) => {
     console.log(token);
    console.log('data', data);
    return await fetch(currentUrl + '/api/order/new', {
        method: 'post',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(data)
    })
        .then((response) => {

            return response.json();
        })
        .catch(async(error) => {
            console.log('SendNewRequest !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
            const login = await AsyncStorage.getItem('@login');
            var err = {
                "email": login,
                "breakpoint": 'After order. Token: ' + token,
                "name": error.name,
                "message": error.message
            }
            console.log(err);
            const resp = await SendLogError(err);
            // console.log(resp);
            if (resp)
                if (resp.status)
                    if (resp.status == 'ok')
                        Toast.show('Ошибка отправлена на сервер');
            // console.log(resp);
            return {
                'status': 'got error',
            'message': error.message,
            }
        });

}
export const SendNewReturn = async (token, data) => {
    /* console.log(token);
    console.log(data); */
   return await fetch(currentUrl + '/api/returns/new', {
        method: 'post',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(data)
    })
        .then((response) => {
            // console.log(response)
            return response.json();
        })
        .catch((error) => {return {
            'status': 'got error',
            'message': error.message,
        }});

}
export const SendNewCashOrder = async (token, data) => {
    /* console.log(token);
    console.log(data); */
   return await fetch(currentUrl + '/api/cash-order/new', {
        method: 'post',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(data)
    })
        .then((response) => {
            console.log(response)
            return response.json();
        })
        .catch((error) => {return {
            'status': 'got error',
            'message': error.message,
        }});

}
export const SendLogError = async (data) => {
    /* console.log(token);
    console.log(data); */
    return await fetch(currentUrl + '/api/log/error', {
        method: 'post',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
        .then((response) => {
            // console.log(response)
            response.json();
        })
        .catch((error) => {return {
            'status': 'got error',
            'message': error.message,
        }});

}

export const GetBalance = async (token) => {
    console.log('token ', token);
    // console.log(data);
    return await fetch(currentUrl + '/api/balance/list', {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
    })
        .then((response) => {
            console.log('sent response')
            return response.json();
        })
        .catch(async(error) => {
            console.log('catch GetBalance !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
            const login = await AsyncStorage.getItem('@login');
            var err = {
                "email": login,
                "breakpoint": 'Trying to get balance',
                "name": error.name,
                "message": error.message
            }
            console.log('err ', error);
            const resp = await SendLogError(err);
            // console.log(resp);
            if (resp)
                if (resp.status)
                    if (resp.status == 'ok')
                        Toast.show('Ошибка отправлена на сервер');
            // console.log(resp);
            return {
                'status': 'got error',
            'message': error.message,
            }
        });

}

export const Ping = async (token) => {
    /* console.log(token);
    console.log(data); */
    return await fetch(currentUrl + '/api/ping', {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
    })
        .then((response) => {
            return response.json();
        })
        .catch((error) => {return {"status": 'not ok'}});

}

export const SendUnsyncRequest = async (token, data) => {

    // console.log('data', data);
    return await fetch(currentUrl + '/api/orders/send-unsync-order', {
        method: 'post',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(data)
    })
        .then((response) => {

            return response.json();
        })
        .catch(async(error) => {
            console.log('catch SendUnsyncRequest !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
            const login = await AsyncStorage.getItem('@login');
            var err = {
                "email": login,
                "breakpoint": 'After order. Token: ' + token,
                "name": error.name,
                "data": data,
                "message": error.message
            }
            // console.log(err);
            const resp = await SendLogError(err);
            // console.log(resp);
            if (resp)
                if (resp.status)
                    if (resp.status == 'ok')
                        Toast.show('Ошибка отправлена на сервер');
            // console.log(resp);
            return {
                'status': 'got error',
                'message': error.message,
            }
        });

}

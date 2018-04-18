let remote = (() => {
    const BASE_URL = 'https://baas.kinvey.com/';
    const APP_KEY = 'kid_HJxiS0g3z'; // APP KEY HERE
    const APP_SECRET = '84effb21886149279e32d9804fa62bdf'; // APP SECRET HERE

    function makeAuth(auth) {
        if (auth === 'basic') {
            return `Basic ${btoa(APP_KEY + ":" + APP_SECRET)}`;
        } else {
            return `Kinvey ${sessionStorage.getItem('authtoken')}`
        }
    }

    // request method (GET, POST, PUT)
    // kinvey module (user/appdata)
    // url endpoint
    // auth: basic/kinvey


    // makeRequest when data-Obj is transformed to string with JSON.stringify(data)
    // We need to append additionally: contentType: 'application/json'
    // function makeRequest(method, module, endpoint, auth) {
    //     return {
    //         url: BASE_URL + module + '/' + APP_KEY + '/' + endpoint,
    //         method: method,
    //         headers: {
    //             'Authorization': makeAuth(auth)
    //         },
    //         contentType: 'application/json'
    //     }
    // }
    //
    // // post function when data-Obj is transformed to string with JSON.stringify(data)
    // function post(module, endpoint, auth, data) {
    //     let obj = makeRequest('POST', module, endpoint, auth);
    //
    //     if (data) {
    //         obj.data = JSON.stringify(data);
    //     }
    //     return $.ajax(obj);
    // }


    // makeRequest when data-Obj is NOT transformed to string with JSON.stringify(data)
    // We Don't need to append additionally: contentType: 'application/json'
    function makeRequest(method, module, endpoint, auth) {
        return {
            url: BASE_URL + module + '/' + APP_KEY + '/' + endpoint,
            method: method,
            headers: {
                'Authorization': makeAuth(auth)
            }
        }
    }

    // makeRequest when data-Obj is NOT transformed to string with JSON.stringify(data)
    function post(module, endpoint, auth, data) {
        let obj = makeRequest('POST', module, endpoint, auth);
        if (data) {
            obj.data = data;
        }
        return $.ajax(obj);
    }


    function get(module, endpoint, auth) {
        return $.ajax(makeRequest('GET', module, endpoint, auth));
    }


    function update(module, endpoint, auth, data) {
        let obj = makeRequest('PUT', module, endpoint, auth);
        obj.data = data;
        return $.ajax(obj);
    }

    function remove(module, endpoint, auth) {
        return $.ajax(makeRequest('DELETE', module, endpoint, auth));
    }

    return {
        get,
        post,
        update,
        remove
    }
})();
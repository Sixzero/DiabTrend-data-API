import requests
import base64

response_login = requests.post(
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyChSD_9K4I9CzRf1iIPNw448_h7Fvmgm2w',
    {
        "email": "example@diabtrend.com",
        "password": "example1234",
        "returnSecureToken": "true"
    })
result = response_login.json()
id_token = result['idToken']

data = {
    "data": {
        "all": "false", "date": "2021-12-31T23:00:00.000Z", "endData": "2022-12-31T23:00:00.000Z", "type": "csv",
    }
}

response_export = requests.post('https://us-central1-diabtrend-db.cloudfunctions.net/exportToCsv_open',
                                json=data, headers={'authorization': 'Bearer ' + id_token})

data_in_bytes = str.encode(response_export.json()['result']['base64'])
with open("out.csv", "wb") as fh:
    fh.write(base64.decodebytes(data_in_bytes))

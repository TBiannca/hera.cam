const axios = require('axios')
const https = require('https')

const getToken = async () => axios({
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    method: 'post',
    url: 'https://localhost:7216/auth/login',
    data: {
        userName: "admin145",
        password: "Admin1!"
    }
}).then(response => response.data.accessToken)
.then(token => { return token })

module.exports = getToken
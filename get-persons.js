const axios = require('axios')
const https = require('https')

const getPersons = async token => axios({
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        url: 'http://192.168.0.137:5172/graphql',
        method: 'POST',
        headers:  {
          authorization: `Bearer ${token}`,
        },
        data: {
          query: `
            query {
            persons {
              name,
              descriptors
            }
          }`
        }
      }).then(response => response.data.data.persons)
      .then(persons => { return persons })

module.exports = getPersons
const axios = require('axios')

const getPersons = axios({
        url: 'https://localhost:7216/graphql',
        method: 'POST',
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
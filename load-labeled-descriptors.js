const getPersons = require('./get-persons')
const faceapi = require('@vladmandic/face-api')

const loadLabeledDescriptors = async token => {
    
 const persons = await getPersons(token)

    persons.map(person => console.log(person.name))
    return Promise.all(
      persons.map(async person => {

            const decriptedDescriptors = atob(person.descriptors)
            const descriptors = Object.values(JSON.parse(decriptedDescriptors))
            var outputData = descriptors.map( Object.values )
            let fooo = []
            const final = outputData.map(array => fooo.push(new Float32Array(array)))
            //console.log('AYYYY',fooo);

        return new faceapi.LabeledFaceDescriptors(person.name, fooo)
      })
    )
}

module.exports = loadLabeledDescriptors
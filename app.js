const tf = require('@tensorflow/tfjs-node')
const fs = require('fs')
const faceapi = require('face-api.js')


async function run() {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('./public/models')
    await faceapi.nets.faceLandmark68Net.loadFromDisk('./public/models')
    await faceapi.nets.faceRecognitionNet.loadFromDisk('./public/models')

    const verify = tf.node.decodeImage(fs.readFileSync('./public/images/elon-musk2.jpg'))

    const labels = ['elon-musk']
    const labeledFaceDescriptors = await Promise.all(
        labels.map(async label => {
            const imgUrl = `./public/images/${label}.jpg`
            const img = tf.node.decodeImage(fs.readFileSync(imgUrl))
            
            const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
            
            if (!fullFaceDescription) {
              throw new Error(`no faces detected for ${label}`)
            }
            
            const faceDescriptors = [fullFaceDescription.descriptor]
            return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
          })
      )

    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)

    const singleResult = await faceapi
    .detectSingleFace(verify)
    .withFaceLandmarks()
    .withFaceDescriptor()

    if (singleResult) {
        const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor)
        console.log(bestMatch.toString())
    }

}

run()

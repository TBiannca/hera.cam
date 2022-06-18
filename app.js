const tf = require('@tensorflow/tfjs-node')
const fs = require('fs')
const faceapi = require('face-api.js')


async function run() {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('./public/models')
    await faceapi.nets.faceLandmark68Net.loadFromDisk('./public/models')
    await faceapi.nets.faceRecognitionNet.loadFromDisk('./public/models')

    const verify = tf.node.decodeImage(fs.readFileSync('./public/images/elon-musk2.jpg'))

    const labeledFaceDescriptors = await loadLabeledImages();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

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

const loadLabeledImages = () => {
  const labels = ['elon-musk']
  return Promise.all(
    labels.map(async label => {

      const descriptions = []
      const numberOfImages = fs.readdirSync('./public/images').length

      for (let i = 2; i <= numberOfImages + 1; i++) {
        const imgUrl = `./public/images/elon-musk${i}.jpg`
        const img = tf.node.decodeImage(fs.readFileSync(imgUrl))
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }

      const foo = JSON.stringify(descriptions)
      const foo2 = btoa(foo)

      const foo3 = atob(foo2)
      const foo4 = Object.values(JSON.parse(foo3))

      var outputData = foo4.map( Object.values );
      //console.log('INAPOI', outputData);
      //console.log('------------------------------------------------------------------');


      let fooo = []
      const final = outputData.map(array => fooo.push(new Float32Array(array)))
      //console.log(descriptions);
      console.log(fooo);
      return new faceapi.LabeledFaceDescriptors(label, fooo)
    })
  )
}
const tf = require('@tensorflow/tfjs-node')
const fs = require('fs')
const faceapi = require('face-api.js')
const loadLabeledDescriptors = require('./load-labeled-descriptors')
const getToken = require('./get-user')

const run = async () => {

  await faceapi.nets.ssdMobilenetv1.loadFromDisk('./public/models')
  await faceapi.nets.faceLandmark68Net.loadFromDisk('./public/models')
  await faceapi.nets.faceRecognitionNet.loadFromDisk('./public/models')

  const token = await getToken()
  console.log(token)

  const verify = tf.node.decodeImage(fs.readFileSync('./public/verify/elon-musk.jpg'))

  const singleResult = await faceapi
  .detectSingleFace(verify)
  .withFaceLandmarks()
  .withFaceDescriptor()

  //console.log('WWWWWWWWWWW', singleResult.descriptor)
  
  const labeledFaceDescriptors = await loadLabeledDescriptors(token)
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

  if (singleResult) {
    const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor)
    console.log(bestMatch.toString())
  }
}


run() 

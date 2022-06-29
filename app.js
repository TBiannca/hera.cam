const tf = require('@tensorflow/tfjs-node')
const fs = require('fs')
const faceapi = require('@vladmandic/face-api')
const loadLabeledDescriptors = require('./load-labeled-descriptors')
const getToken = require('./get-user')

const run = async () => {

  while(true)
  {
    const { exec } = require("child_process")
    exec('libcamera-jpeg -e jpg --immediate -n -t 1 -o /home/bianca/hera.cam/public/verify/test.jpg')
  
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('./public/models')
    await faceapi.nets.faceLandmark68Net.loadFromDisk('./public/models')
    await faceapi.nets.faceRecognitionNet.loadFromDisk('./public/models')
  
    const token = await getToken()
    console.log(token) 
  
    const verify = tf.node.decodeImage(fs.readFileSync('./public/verify/test.jpg'))
  
    if(await faceapi.detectSingleFace(verify) !== undefined)
    {
      const singleResult = await faceapi
      .detectSingleFace(verify)
      .withFaceLandmarks()
      .withFaceDescriptor()
      
      const labeledFaceDescriptors = await loadLabeledDescriptors(token)
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
    
      if (singleResult) {
        const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor)
        console.log(bestMatch.toString())
  
        if(bestMatch.distance < 0.6)
        {
          const spawn = require("child_process").spawn;
          const pythonProcess = spawn('python',["run.py"])
        }
      }
    }
  }

}

run()

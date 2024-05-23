// faceApi.js
const faceapi = require('face-api.js');
const canvas = require('canvas');
const path = require('path');
const fetch = require('node-fetch');

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData, fetch });

const MODEL_URL = path.join(__dirname, '/models');

async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);
}

async function getFaceDescriptor(imagePath) {
  const img = await canvas.loadImage(imagePath);
  const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
  return detection ? detection.descriptor : null;
}

module.exports = { loadModels, getFaceDescriptor };

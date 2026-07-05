import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-wasm';      // ← backend WASM
import * as jpeg from 'jpeg-js';
import { PNG } from 'pngjs';
import { Condition } from '@prisma/client';

// ... conditionMap tetap

let model: tf.LayersModel | null = null;
let backendInitialized = false;

async function initBackend() {
  if (!backendInitialized) {
    // Gunakan WASM sebagai backend
    const wasm = require('@tensorflow/tfjs-backend-wasm');
    await wasm.setWasmPaths({
      // Di Vercel, path ke folder WASM dari node_modules
      'tfjs-backend-wasm.wasm': '/_next/static/wasm/tfjs-backend-wasm.wasm',
      'tfjs-backend-wasm-simd.wasm': '/_next/static/wasm/tfjs-backend-wasm-simd.wasm',
    });
    await tf.setBackend('wasm');
    backendInitialized = true;
  }
}

export async function loadModel(): Promise<tf.LayersModel> {
  if (model) return model;

  await initBackend();

  // URL publik model (pastikan file ada di public/model)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const modelUrl = `${baseUrl}/model/model.json`;
  console.log('Loading model from:', modelUrl);
  model = await tf.loadLayersModel(modelUrl);
  return model;
}

// ... sisa kode classifyImage tetap sama
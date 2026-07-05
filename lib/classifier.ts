import * as tf from '@tensorflow/tfjs';
import * as jpeg from 'jpeg-js';
import { PNG } from 'pngjs';
import { Condition } from '@prisma/client';

// ---------- Konfigurasi ----------
const conditionMap: Record<string, Condition> = {
  mentah: 'MENTAH',
  matang: 'MATANG',
  'terlalu matang': 'TERLALU_MATANG',
};

let model: tf.LayersModel | null = null;

// ---------- Load Model (URL publik, tanpa WASM agar stabil) ----------
export async function loadModel(): Promise<tf.LayersModel> {
  if (model) return model;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const modelUrl = `${baseUrl}/model/model.json`;
  console.log('Loading model from:', modelUrl);
  
  // Gunakan tf.loadLayersModel langsung (fetch internal Node.js)
  model = await tf.loadLayersModel(modelUrl);
  return model;
}

// ---------- Klasifikasi Gambar (decode manual) ----------
export async function classifyImage(
  imageBuffer: Buffer
): Promise<{ fruitName: string; condition: Condition; confidence: number }> {
  const net = await loadModel();

  // Decode gambar (JPG/PNG) ke tensor 3 channel
  const magic = imageBuffer[0];
  let imageTensor: tf.Tensor3D;

  if (magic === 0xff) {
    // JPEG
    const raw = jpeg.decode(imageBuffer, { useTArray: true });
    imageTensor = tf.tensor3d(raw.data, [raw.height, raw.width, 4]).slice([0, 0, 0], [-1, -1, 3]);
  } else if (magic === 0x89) {
    // PNG
    const png = PNG.sync.read(imageBuffer);
    const data = new Uint8Array(png.data);
    imageTensor = tf.tensor3d(data, [png.height, png.width, 4]).slice([0, 0, 0], [-1, -1, 3]);
  } else {
    throw new Error('Format gambar tidak didukung (hanya JPG/PNG)');
  }

  // Preprocessing
  const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);
  const normalized = resized.div(255.0);
  const batched = normalized.expandDims(0);

  // Inferensi
  const predictions = net.predict(batched) as tf.Tensor;
  const probabilities = Array.from(await predictions.data());

  // Cleanup
  imageTensor.dispose();
  resized.dispose();
  normalized.dispose();
  batched.dispose();
  predictions.dispose();

  const maxIndex = probabilities.indexOf(Math.max(...probabilities));
  const confidence = probabilities[maxIndex];

  // Label sesuai metadata.json
  const classLabels = getModelLabels();
  const predictedLabel = classLabels[maxIndex]; // "mentah", "matang", "terlalu matang"

  const condition: Condition = conditionMap[predictedLabel] || 'MATANG';

  return {
    fruitName: 'Buah/Sayur',
    condition,
    confidence: Math.round(confidence * 10000) / 10000,
  };
}

// ---------- Label Kelas dari metadata.json ----------
function getModelLabels(): string[] {
  return [
    'mentah',
    'matang',
    'terlalu matang',
  ];
}
import type { FastifyInstance } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import ort from 'onnxruntime-node';
import { ofetch } from 'ofetch';

import libm_wasm from '~/assets/libm.wasm?url';
import logo_png from '~/assets/logo.png';
// import model_onnx from '~/assets/model.onnx?url';
import useAssets from '~/composables/useAssets';
import usePublic from '~/composables/usePublic';

export default async (app: FastifyInstance) => {
  const router = app.withTypeProvider<TypeBoxTypeProvider>();

  /*
  curl --request GET \
    --url http://127.0.0.1:3000/api/assets-public
  */
  router.get('/', async (req, reply) => {
    const logo_png_buffer = useAssets(logo_png);
    const libm_wasm_buffer = useAssets(libm_wasm);
    const libmBuf = usePublic('libm.wasm');

    console.log(logo_png_buffer.toString('base64'));

    const libm_wasm_instance = await WebAssembly.instantiate(libm_wasm_buffer).then((res) => {
      return res.instance.exports as { max(num1: number, num2: number): number };
    });

    console.log(libm_wasm_instance.max(3, 6)); // 6

    const libm = await WebAssembly.instantiate(libmBuf).then((res) => {
      return res.instance.exports as { abs(num: number): number };
    });

    console.log(libm.abs(-2)); // 2

    return reply.send({});
  });

  /*
  curl --request GET \
    --url http://127.0.0.1:3000/api/assets-public/onnx
  */
  router.get('/onnx', async (req, reply) => {
    const url = app.cloudinary.url('model_dbz1oh.onnx', { resource_type: 'raw' });
    const response = await ofetch(url, { method: 'GET' });
    const model_onnx_buffer = await response.arrayBuffer();

    // const model_onnx_buffer = useAssets(model_onnx);

    // const model_onnx_buffer = usePublic('model.onnx');

    // create a new session and load the specific model.
    //
    // the model in this example contains a single MatMul node
    // it has 2 inputs: 'a'(float32, 3x4) and 'b'(float32, 4x3)
    // it has 1 output: 'c'(float32, 3x3)
    const session = await ort.InferenceSession.create(model_onnx_buffer);

    // prepare inputs. a tensor need its corresponding TypedArray as data
    const dataA = Float32Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const dataB = Float32Array.from([10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]);
    const tensorA = new ort.Tensor('float32', dataA, [3, 4]);
    const tensorB = new ort.Tensor('float32', dataB, [4, 3]);

    // prepare feeds. use model input names as keys.
    const feeds = { a: tensorA, b: tensorB };

    // feed inputs and run
    const results = await session.run(feeds);

    // read from results
    const dataC = results.c.data;

    return reply.send(`data of result tensor 'c': ${dataC}`);
  });

  /*
  curl --request POST \
    --url http://127.0.0.1:3000/api/assets-public/onnx/mnist \
    --header 'content-type: application/json' \
    --data '{}'
  */
  router.post('/onnx/mnist', async (req, reply) => {
    // req.file

    const url = app.cloudinary.url('mnist-12-int8_ieepvf.onnx', { resource_type: 'raw' });
    const response = await ofetch(url, { method: 'GET' });
    const model_onnx_buffer = await response.arrayBuffer();

    const session = await ort.InferenceSession.create(model_onnx_buffer);

    // https://netron.app
    const dims = [1, 1, 28, 28];
    const size = dims.reduce((acc, cur) => acc * cur);
    const input = Float32Array.from({ length: size }, () => Math.random());

    const tensor = new ort.Tensor('float32', input, dims);

    const feeds = { Input3: tensor };

    const results = await session.run(feeds);

    console.log(results);

    return reply.send({});
  });
};

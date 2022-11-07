import type { FastifyInstance } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

import libm_wasm from '~/assets/libm.wasm?url';
import logo_png from '~/assets/logo.png';
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
};

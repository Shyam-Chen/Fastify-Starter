// TODO: Create a new project for both the front-end and back-end.
import { randomUUID } from 'node:crypto';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { QdrantClient } from '@qdrant/js-client-rest';
import { embedMany, jsonSchema, streamText, tool } from 'ai';
import Type from 'typebox';

import auth from '~/middleware/auth.ts';

const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
const llm = google('gemini-3-flash-preview');
const embedding = google.embeddingModel('gemini-embedding-001');

const qdrant = new QdrantClient({ url: process.env.QDRANT_URL });

export default (async (app) => {
  app.post('', { sse: true }, async (request, reply) => {
    const body = JSON.parse(request.body as string);

    const { textStream } = streamText({
      model: llm,
      prompt: body.message,
    });

    for await (const textPart of textStream) {
      await reply.sse.send({ data: textPart });
    }
  });

  // ---

  app.post('/embed', async (request, reply) => {
    const documents = [
      'Qdrant 是一個高效能的向量資料庫。',
      'Gemini 是 Google 開發的多模態大型語言模型。',
      'TypeScript 讓 JavaScript 開發更安全。',
    ];

    const { embeddings } = await embedMany({
      model: embedding,
      values: documents,
    });

    const COLLECTION_NAME = 'my-knowledge-base';

    // await qdrant.createCollection(COLLECTION_NAME, {
    //   vectors: { size: 768, distance: 'Cosine' },
    // });

    // const collection = await qdrant.getCollection(COLLECTION_NAME);

    const points = embeddings.map((vector, index) => ({
      id: randomUUID(),
      vector,
      payload: {
        content: documents[index],
        metadata: { source: 'manual_input', timestamp: new Date().toISOString() },
      },
    }));

    await qdrant.upsert(COLLECTION_NAME, {
      wait: true,
      points: points,
    });

    return reply.send({ message: 'OK' });
  });

  app.post('/query', { sse: true }, async (request, reply) => {
    const body = JSON.parse(request.body as string);

    const { textStream } = streamText({
      model: llm,
      prompt: `

        Question: ${body.message}
      `,
    });

    for await (const textPart of textStream) {
      await reply.sse.send({ data: textPart });
    }
  });

  // ---

  app.post('/tool', { sse: true, onRequest: [auth] }, async (request, reply) => {
    const input = `What is my username?`;

    const { textStream } = streamText({
      model: llm,
      prompt: `${input}`,
      tools: {
        username: tool({
          description: 'Get the username',
          inputSchema: jsonSchema(
            Type.Object({
              username: Type.String({ description: 'The username to get the username for' }),
            }),
          ),
          async execute({ username }) {
            const users = app.mongo.db?.collection('users');

            const user = await users?.findOne(
              { username: { $eq: request.user.username } },
              { projection: { password: 0, secret: 0 } },
            );

            return { username };
          },
        }),
      },
    });

    for await (const textPart of textStream) {
      await reply.sse.send({ data: textPart });
    }
  });

  // ---

  app.post('/step', { sse: true, onRequest: [auth] }, async (request, reply) => {
    await reply.sse.send({ data: '' });
  });
}) as FastifyPluginAsyncTypebox;

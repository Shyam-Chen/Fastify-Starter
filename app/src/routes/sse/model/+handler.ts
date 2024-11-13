import type { mongodb } from '@fastify/mongodb';
import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import type { Document } from '@langchain/core/documents';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import { Type } from '@sinclair/typebox';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';

import useModel, { embeddings } from '~/composables/useModel';

export default (async (app) => {
  app.post(
    '',
    {
      schema: {
        body: Type.Object({
          message: Type.String(),
        }),
      },
    },
    async (request, reply) => {
      const model = useModel({
        // Replace the model with a fine-tuned model or an embedding model
        model: 'gpt-4o-mini',

        // Allow some creative flexibility to handle variations in phrasing, while maintaining accuracy in responses
        temperature: 0.3,
      });

      const stream = await model.stream(request.body.message);

      for await (const chunk of stream) {
        reply.sse({ data: chunk.content });
      }

      request.raw.on('close', async () => {
        await stream.cancel();
      });
    },
  );

  app.get('/docs', async (request, reply) => {
    const collection = app.mongo.db?.collection('vector') as mongodb.Collection<mongodb.Document>;

    const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
      collection,
      indexName: 'vector_index',
    });

    type DocumentWithId<T extends NonNullable<unknown>> = Document<T> & {
      id: string;
    };

    const documents: DocumentWithId<{ source: string }>[] = [
      {
        id: '1',
        pageContent: 'The powerhouse of the cell is the mitochondria',
        metadata: { source: 'https://example.com' },
      },
      {
        id: '2',
        pageContent: 'Buildings are made out of brick',
        metadata: { source: 'https://example.com' },
      },
      {
        id: '3',
        pageContent: 'Mitochondria are made out of lipids',
        metadata: { source: 'https://example.com' },
      },
      {
        id: '4',
        pageContent: 'The 2024 Olympics are in Paris',
        metadata: { source: 'https://example.com' },
      },
    ];

    await vectorStore.addDocuments(
      documents.map(({ id, ...doc }) => doc),
      { ids: documents.map((doc) => doc.id) },
    );

    return reply.send({ message: 'OK' });
  });

  app.get('/query', async (request, reply) => {
    const model = useModel({ model: 'gpt-4o-mini', temperature: 0.3 });

    const collection = app.mongo.db?.collection('vector') as mongodb.Collection<mongodb.Document>;

    const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
      collection,
      indexName: 'vector_index',
    });

    const retriever = vectorStore.asRetriever({ k: 2 });

    const systemPrompt = `
      You are an assistant for question-answering tasks.
      Use the following pieces of retrieved context to answer the question.
      If you don't know the answer, say that you don't know.
      Use three sentences maximum and keep the answer concise.

      {context}
    `;

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      ['human', '{input}'],
    ]);

    const questionAnswerChain = await createStuffDocumentsChain({ llm: model, prompt });

    const ragChain = await createRetrievalChain({
      retriever,
      combineDocsChain: questionAnswerChain,
    });

    const stream = await ragChain.stream({ input: 'biology' });

    for await (const chunk of stream) {
      reply.sse({ data: chunk.answer });
    }

    request.raw.on('close', async () => {
      await stream.cancel();
    });
  });
}) as FastifyPluginAsyncTypebox;

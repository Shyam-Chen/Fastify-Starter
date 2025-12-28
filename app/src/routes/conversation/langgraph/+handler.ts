// FIXME: Currently not working
// @ts-nocheck

import type { mongodb } from '@fastify/mongodb';
import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';

import useModel, { useEmbeddings } from '~/composables/useModel.ts';

// TODO: LangGraph Integration
//
// - Chat Memory
// - Tool Calling Agents

export default (async (app) => {
  /*
  User sends conversation

  ```ts
  import { stream } from 'fetch-event-stream';

  await stream('http://127.0.0.1:3000/api/conversation/langgraph', {
    method: 'POST',
    body: JSON.stringify({
      messages: [
        {
          id: self.crypto.randomUUID(),
          content: 'What is GenAI?',
          role: 'user',
        },
      ],
    }),
  });
  ```
  */
  app.post('', async (request, reply) => {
    type Message = { id: string; content: string; role: 'user' };
    const body = JSON.parse(request.body as string) as { messages: Message[] };

    const model = useModel({ model: 'gpt-4o-mini', temperature: 0.3 });
    const embeddings = useEmbeddings();

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

    const stream = await ragChain.stream({ input: body.messages[0].content });

    for await (const chunk of stream) {
      reply.sse({ data: chunk });
    }

    request.raw.on('close', async () => {
      await stream.cancel();
    });

    return reply.sse({ event: 'end' });
  });
}) as FastifyPluginAsyncTypebox;

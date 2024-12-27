import type { mongodb } from '@fastify/mongodb';
import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';

import useModel, { useEmbeddings } from '~/composables/useModel';

export default (async (app) => {
  /*
  User sends conversation

  ```ts
  import { stream } from 'fetch-event-stream';

  await stream('http://127.0.0.1:3000/api/conversation', {
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

    // TODO: Query the user's data based on the current `username` (with the data for the query already stored in the vector database).

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

    const stream = await ragChain.stream(
      { input: body.messages[0].content },
      // TODO: Message History (`@langchain/langgraph`)
      // 1. Use a 10-minute time difference check to determine whether to create a new message history for a user and delete all existing message histories when the user sends a message.
      // 2. Set up a scheduled task to clean up all message histories where the time difference exceeds 10 minutes from the current system time.
      // { configurable: { thread_id: body.messages[0].id } },
    );

    for await (const chunk of stream) {
      reply.sse({ data: chunk });
    }

    request.raw.on('close', async () => {
      await stream.cancel();
    });

    return reply.sse({ event: 'end' });
  });
}) as FastifyPluginAsyncTypebox;

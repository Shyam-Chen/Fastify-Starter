// FIXME: Currently not working
// @ts-nocheck

import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { StartEvent, StopEvent, Workflow, WorkflowEvent } from '@llamaindex/workflow';
import { OpenAI, OpenAIAgent, OpenAIEmbedding, Settings } from 'llamaindex';
import { MongoDBAtlasVectorSearch, QueryEngineTool, VectorStoreIndex } from 'llamaindex';

export default (async (app) => {
  /*
  User sends conversation

  ```ts
  import { stream } from 'fetch-event-stream';

  await stream('http://127.0.0.1:3000/api/conversation/llamaindex', {
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

    const vectorStore = new MongoDBAtlasVectorSearch({
      embedModel: new OpenAIEmbedding({
        model: 'text-embedding-3-small',
      }),
      mongodbClient: app.mongo.client,
      dbName: 'mydb',
      collectionName: 'vector',
      indexName: 'vector_index',
    });

    const vectorIndex = await VectorStoreIndex.fromVectorStore(vectorStore);
    const retriever = vectorIndex.asRetriever({ similarityTopK: 2 });
    const queryEngine = vectorIndex.asQueryEngine({ retriever });

    const tools = [
      new QueryEngineTool({
        queryEngine,
        metadata: {
          name: 'my_tool',
          description: 'This tool can answer detailed questions.',
        },
      }),
    ];

    const systemPrompt = `
      You are an assistant for question-answering tasks.
      Use the following pieces of retrieved context to answer the question.
      If you don't know the answer, say that you don't know.

      {context}
    `;

    const agent = new OpenAIAgent({
      llm: new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        model: 'gpt-4o-mini',
      }),
      tools,
      systemPrompt,
    });

    const stream = await agent.chat({ message: body.messages[0].content, stream: true });

    for await (const chunk of stream) {
      reply.sse({ data: chunk.response });
    }

    // const workflow = new Workflow();

    // const context = workflow.run(1000, {
    //   sum: 0,
    // });

    // for await (const event of context) {
    //   reply.sse({ data: event.data });
    // }

    request.raw.on('close', async () => {
      await stream.cancel();
    });

    return reply.sse({ event: 'end' });
  });
}) as FastifyPluginAsyncTypebox;

import { ChatOpenAI, type ChatOpenAIFields } from '@langchain/openai';

export default (fields: ChatOpenAIFields) => {
  const model = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    ...fields,
  });

  return model;
};

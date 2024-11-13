import type { ChatOpenAIFields } from '@langchain/openai';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';

export default (fields: ChatOpenAIFields) => {
  const model = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    ...fields,
  });

  return model;
};

export const useEmbeddings = () => {
  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,

    // https://platform.openai.com/docs/guides/embeddings/#embedding-models
    model: 'text-embedding-3-small',
  });

  return embeddings;
};

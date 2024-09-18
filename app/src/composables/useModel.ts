import { ChatOpenAI } from '@langchain/openai';

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: 'ft-123abc456def', // Fine-tuned/Embedded model ID
});

export default () => {
  return model;
};

import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

export default (async (app) => {
  /*
  ```ts
  {
    messages: [
      {
        id: '6d0e7384-e233-4289-9f25-bcc832a20c83',
        content: 'What is GenAI?',
        role: 'user',
      },
      {
        id: '397c5e4e-935b-46e1-a6ed-5a7522cf603d',
        content: '**GenAI**, short for **Generative Artificial Intelligence**, refers to a class of AI technologies and models capable of generating new, original content based on patterns learned from existing data. Unlike traditional AI, which primarily analyzes and predicts, generative AI focuses on creation—producing text, images, music, code, and more.\n\n### Key Characteristics of GenAI:\n1. **Content Generation**:\n   - Text: ChatGPT, for example, can write essays, stories, and code.\n   - Images: Tools like DALL-E generate art and visuals from text prompts.\n   - Music: AI can compose original songs.\n   - 3D Models: AI tools are being developed to create virtual environments and objects.\n\n2. **Training Process**:\n   - GenAI is trained using **large datasets** through techniques like deep learning.\n   - It uses models such as **transformers** (e.g., GPT, BERT) or **diffusion models** for generating outputs.\n\n3. **Applications**:\n   - Creative industries (art, writing, music, design)\n   - Software development (code generation)\n   - Marketing (personalized ads, content creation)\n   - Customer service (chatbots)\n   - Healthcare (drug design, patient simulation)\n\n4. **Challenges**:\n   - Ethical concerns (plagiarism, misinformation)\n   - Bias in generated outputs (from biased training data)\n   - Intellectual property issues\n\n### Common Examples of GenAI Models:\n- **OpenAI GPT (Generative Pre-trained Transformer)** for text.\n- **DALL-E and Stable Diffusion** for image generation.\n- **DeepMind AlphaCode** for code generation.\n- **Jukebox** for music.\n\nGenerative AI represents a significant leap in AI capabilities, enabling machines not only to interpret and react but also to create and innovate.',
        role: 'assistant',
      },
    ];
  }
  ```
  */
  app.get('', async (request, reply) => {
    /** TODO */
  });
}) as FastifyPluginAsyncTypebox;

import { openai } from '@ai-sdk/openai';
import { experimental_streamText } from 'ai';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const result = await experimental_streamText({
    model: openai('gpt-3.5-turbo', { logprobs: 2 }),
    maxTokens: 512,
    temperature: 0.3,
    maxRetries: 5,
    prompt: 'Invent a new holiday and describe its traditions.',
  });

  for await (const part of result.fullStream) {
    switch (part.type) {
      case 'text-delta':
        console.log('Text delta:', part.textDelta);
        break;

      case 'finish': {
        console.log('Finish reason:', part.finishReason);
        console.log('Logprobs:', part.logprobs);
        console.log('Usage:', part.usage);
        break;
      }

      case 'error':
        console.error('Error:', part.error);
        break;
    }
  }
}

main().catch(console.error);

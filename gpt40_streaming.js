
import dotenv from 'dotenv';
dotenv.config();

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This uses the API key from your environment variables
});

async function main() {
  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini", 
    messages: [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What are top 3 questions to ask to a pediatric dentist?"}
    ],
    stream: true
  });

  for await (const chunk of stream) {
    if (chunk.choices[0]?.delta?.content) {
      process.stdout.write(chunk.choices[0].delta.content);
    }
  }
}

main().catch(console.error);

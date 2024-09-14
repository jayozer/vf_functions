import dotenv from 'dotenv';
dotenv.config();

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function main() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What are top 3 questions to ask to a pediatric dentist?"}
      ],
      stream: false
    });

    const fullContent = response.choices[0].message.content;
    const words = fullContent.split(' ');
    let lastPrintedIndex = -1;

    for (let i = 0; i < words.length; i++) {
      if (i % 3 === 2 || i === words.length - 1) {
        const newContent = words.slice(lastPrintedIndex + 1, i + 1).join(' ');
        process.stdout.write(newContent + ' ');
        lastPrintedIndex = i;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    console.log(); // Add a newline at the end
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
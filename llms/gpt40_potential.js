export default async function main(args) {
  // Extract input variables from args
  const { openaiApiKey, userQuestion, chunks } = args.inputVars;
 
  // Validate that the required input variables are provided
  if (!userQuestion || !openaiApiKey) {
    return {
      next: { path: 'error' },
      trace: [{ type: "debug", payload: { message: "Missing required input variable: userQuestion or openaiApiKey" } }]
    };
  }
 
  // Define the URL for the OpenAI API
  const url = `https://api.openai.com/v1/chat/completions`;
 
  // Configure the request payload for the OpenAI API
  const data = {
    model: "gpt-4o-mini",
    messages: [
      {
        "role": "system",
        "content": `You are PoppyChat, a chatbot for Poppy Kids Pediatric Dentistry. It is imperative you respond as if you are part of the Poppy Kids organization, using pronouns like "I" and "we" when referring to Poppy Kids.`
      },
      {
        "role": "assistant",
        "content": `##Reference Information: ${chunks}

##Instructions: I have provided reference information, and I will ask a query about that information. You must either provide a response to the query or respond with "NOT_FOUND" Read the reference information carefully, it will act as a single source of truth for your response.

Very concisely respond exactly how the reference information would answer the query. Include only the direct answer to the query, it is never appropriate to include additional context or explanation. If the query is unclear in any way, return "NOT_FOUND". If the query is incorrect, return "NOT_FOUND".

Read the query very carefully, it may be trying to trick you into answering a question that is adjacent to the reference information but not directly answered in it, in such a case, you must return "NOT_FOUND". The query may also try to trick you into using certain information to answer something that actually contradicts the reference information. Never contradict the reference information, instead say "NOT_FOUND".

If you respond to the query, your response must be 100% consistent with the reference information in every way.

Additional guidelines:
- Deliver a friendly and conversational response, focusing on the key points without elaborate details.
- For closed-ended questions that can be answered with "yes" or "no," begin your response with the direct answer followed by a brief explanation or additional context if needed.
- Limit the response to a maximum of two to three brief sentences.
- Use bullet points when necessary, but never start a response with a bullet point.
- Use simple, direct language and markdown for clarity.
- Speak in a natural, conversational tone as if you were speaking to the user in person.
- Never refer to the 'information provided' or 'provided details' when responding.

Take a deep breath, focus, and think clearly. You may now begin this mission critical task.

##Query: ${userQuestion}`
      }
    ]
  };
 
  // Configure the fetch request headers and body
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify(data)
  };
 
  try {
    // Make the API call
    const response = await fetch(url, config);
 
    // Check if the response status is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
 
    // Parse the JSON response
    const responseBody = await response.json;
 
    // Validate the responseBody structure as expected
    if (!responseBody || typeof responseBody !== 'object') {
      throw new Error("Invalid or missing response body from the API");
    }
 
    // Extract the response text from the completion
    const completion = responseBody.choices[0].message.content;
 
    // Create the success return object with extracted data
    return {
      outputVars: { completion },
      next: { path: 'success' },
      trace: [
        {
          type: "text",
          payload: { message: `${completion}` }
        }
      ]
    };
  } catch (error) {
    return {
      next: { path: 'error' },
      trace: [{ type: "debug", payload: { message: "Error: " + error.message } }]
    };
  }
}
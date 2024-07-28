export default async function main(args) {
  // Extract input variables from args
  const { openaiApiKey, userQuestion, clarifyingQuestion, chunks } = args.inputVars;
 
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
        "content": `You are a chatbot for Poppy Kids Pediatric Dentistry. It is imperative you respond as if you are part of the Poppy Kids organization, using pronouns like "I" and "we" when referring to Poppy Kids.`
      },
      {
        "role": "assistant",
        "content": `As a chat support agent, provide a clear and concise response to the user's question:

          {userQuestion}
          
          
          and the clarifying question:
          
          {clarifyingQuestion}
          
          
          Refer to the provided details:
          
          {chunks}
          
          
          Instructions:
          
          Deliver a summarized response, focusing on the key points without elaborate details.
          Address both the user's main question and the clarifying question in your response.
          Limit the response to a maximum of two to three brief sentences.
          Use bullet points to break up chunks of text where appropriate.
          Never start a response with a bullet point - you should answer the question directly and then show supplementary info in bullet points (where appropriate).
          Use simple, direct language and markdown for clarity.
          Ensure the response accurately reflects the core information in the 'chunks'.
          Only mention visiting a website if there's a URL that you can hyperlink to.
          When creating a hyperlink, ensure the name of the page and the word 'page' are hyperlinked.
          Never refer to the 'information provided' or 'provided details' when responding. We should be responding naturally to the user.
          
          IMPORTANT:
          
          If the 'chunks' do not contain the needed information to answer both the main question and the clarifying question,  return nothing. \
          It is crucial that you return nothing as your response if the 'chunks' do not contain the needed information to answer both the main question and the clarifying question.`
      },
      {
        "role": "user",
        "content": userQuestion
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
 
    // Create the success return object with extracted data, here I can assign       outputVars: { completion: answer },

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

/*
Input variables: opeanaiApiKey, userQuestion, clarifyingQuestion, chunks
Output variables: completion
Path: success, error
*/
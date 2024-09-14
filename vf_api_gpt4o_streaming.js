import fetch from 'node-fetch';

export default async function main(args) {
  const { voiceflowApiKey, userQuestion, projectID, versionID } = args.inputVars;

  if (!userQuestion || !voiceflowApiKey || !projectID || !versionID) {
    return {
      next: { path: 'error' },
      trace: [{ type: "debug", payload: { message: "Missing required input variables" } }]
    };
  }

  const url = `https://general-runtime.voiceflow.com/v2beta1/interact/${projectID}/${versionID}/stream`;

  const options = {
    method: 'POST',
    headers: {
      accept: 'text/event-stream',
      'content-type': 'application/json',
      authorization: voiceflowApiKey
    },
    body: JSON.stringify({
      action: { 
        type: 'text', 
        payload: userQuestion 
      },
      session: { 
        sessionID: 'unique-session-id', 
        userID: 'unique-user-id' 
      },
      context: {
        systemMessage: `You are PoppyChat, an FAQ AI chat assistant for Poppy Kids Pediatric Dentistry. It is imperative you respond as if you are part of the Poppy Kids organization, using pronouns like "I" and "we" when referring to Poppy Kids.`,
        assistantMessage: `As a chat support agent, provide a clear and concise response to the user's question:

          {userQuestion}

          Refer to the provided details:
          
          {chunks}

          Instructions:
          
          - Deliver a friendly and conversational response, focusing on the key points without elaborate details.
          - For closed-ended questions that can be answered with "yes" or "no," begin your response with the direct answer followed by a brief explanation or additional context if needed.
          - For open-ended questions, deliver a friendly, conversational response, focusing on the key points.
          - Answer the user's question naturally and directly.
          - Limit the response to a maximum of two to three brief sentences.
          - Use bullet points when necessary.
          - Never start a response with a bullet point - you should answer the question directly and then show supplementary info in bullet points when necessary and appropriate.
          - Use simple, direct language and markdown for clarity.
          - Ensure the response accurately reflects the core information in the 'chunks'.
          - Speak in a natural, conversational tone as if you were speaking to the user in person.
          - Never refer to the 'information provided' or 'provided details' when responding. You should be responding naturally to the user.
          
          IMPORTANT:
          If the 'chunks' do not contain the needed information to answer the question,  return nothing. 
          Take a deep breath, focus, and think clearly. You may now begin this mission critical task.`
      }
    })
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const events = chunk.split('\n\n').filter(Boolean);

      for (const event of events) {
        if (event.startsWith('data: ')) {
          const data = JSON.parse(event.slice(6));
          if (data.type === 'text') {
            fullResponse += data.payload.message + ' ';
            // You can process or send partial responses here if needed
          }
        }
      }
    }

    return {
      outputVars: { completion: fullResponse.trim() },
      next: { path: 'success' },
      trace: [
        {
          type: "text",
          payload: { message: fullResponse.trim() }
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
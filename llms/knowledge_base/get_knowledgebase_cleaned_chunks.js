export default async function main(args) {
// Extract the API key and Question from inputVars
  const { question, VFapiKey } = args.inputVars; 

//Define the API data
  const url = 'https://general-runtime.voiceflow.com/knowledge-base/query';
  const data = {
      "chunkLimit": 3,
      "synthesis": false,  //no sythesis means I am not using the model, simply returning the chunks
      "settings": {
        "model": "gpt4o-mini", //gpt4o-mini  //gpt3-5-turbo
        "temperature": 0,
        "system": "You are an FAQ AI chat assistant. From the information in the documents, answer the user's questions. \
          Always summarize your response to be as brief as possible and be extremely concise. \
          Your responses should be fewer than a couple of sentences. If the answer cannot be found in the documents, do not make up any answer. \
          If no relevant data information is found, return nothing. \
          It is crucial that you return nothing as your answer if it is unrelated or if no relevant data is found."
      },
      "question": question
  };

// Wrap the API call in a try block so it can detect errors
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'Authorization': VFapiKey,
          'OpenAI-Beta': 'assistants=v1'
      },
      body: JSON.stringify(data)
    });

    // Check if the response status is OK (status in the range 200-299)
    if (!response.ok) {
      
    // If not OK, throw an error to be caught by the catch block
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Await the response and save it to the responseBody variable
    const responseBody = await response.json;

    // Access the chunks from the responseBody
    let chunks = responseBody.chunks;

    // Filter the chunks to only include ones with a score higher than 0.82
    let filteredChunks = chunks.filter(chunk => chunk.score > 0.90);

    // Remove anything from the chunks except the text and source information
    let cleanedChunks = filteredChunks.map(({ score, chunkID, documentID, tags, ...rest }) => rest);

    //turn this into a string so we can pass it to an API later
    cleanedChunks = JSON.stringify(cleanedChunks);

    // Return the desired output structure
    return {
      outputVars: {
          cleaned_chunks: cleanedChunks
      },
      next: {
          path: 'success'
      },
      trace: [
        {
          type: 'debug',
          payload: {
          message: `Chunks recieved: ${cleanedChunks}`
                  }
        }
      ],
    };
  } catch (error) {
    // Catch block handles any errors thrown in the try block
    return {
      outputVars: {
        error: `An error occurred: ${error.message}`
      },
      next: {
        path: 'error'
      },
      trace: [
        {
          type: 'text',
          payload: {
            message: `An error occurred: ${error.message}`
          }
        }
      ],
    };
  }
}
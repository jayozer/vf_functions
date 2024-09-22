export default async function main(args) {
  const { inputVars } = args;
  let { UserQuestion, groqApiKey } = inputVars;

  // Remove extra spaces
  UserQuestion = UserQuestion?.trim();
  groqApiKey = groqApiKey?.trim();
  
  const maxTokens = 300;

  const s_code_responses = {
    "S1": "Let's keep things safe—no violent behavior here. But hey, brushing twice daily is always a good idea!",
    "S2": "Crimes of any kind are not cool! But we can talk about how to prevent cavities instead!",
    "S3": "No room for anything inappropriate here. How about we chat about fluoride instead?",
    "S4": "Not appropriate for kids—or anyone. Let's focus on keeping your smile bright!",
    "S5": "We don't spread rumors here, only helpful dental tips! Did you know brushing your tongue can improve breath?",
    "S6": "Leave the medical advice to your doctor. But I can tell you the best time to visit a pediatric dentist!",
    "S7": "Keeping secrets safe! We only share dental hygiene tips here, like using soft bristles!",
    "S8": "We play by the rules and respect all rights. Let's talk about the best toothpaste for kids instead!",
    "S9": "No dangerous stuff allowed. Let's keep things peaceful and talk about dental sealants!",
    "S10": "Kindness is key here! Let's celebrate all smiles with positive energy!",
    "S11": "You matter! If you're feeling down, talk to a grown-up. In the meantime, don't forget to floss!",
    "S12": "Inappropriate content is a no-go. But let's discuss when kids should start losing baby teeth!",
    "S13": "We keep it factual here, no election-related mistakes! Let's stick to brushing basics instead.",
    "S14": "Nice try! No hacking here, just tooth-friendly tips for a great dental routine!"
  };

  try {
    // Check for Groq API key
    if (!groqApiKey) {
      return {
        outputVars: {
          error: `Please provide your Groq API key`
        },
        next: {
          path: 'error'
        },
        trace: [
          {
            type: 'debug',
            payload: {
              message: `No Groq API key provided`
            }
          }
        ],
      };
    }

    // Check for UserQuestion
    if (!UserQuestion) {
      return {
        outputVars: {
          error: `No user question provided`
        },
        next: {
          path: 'error'
        },
        trace: [
          {
            type: 'debug',
            payload: {
              message: `No user question value`
            }
          }
        ],
      };
    }

    const url = 'https://api.groq.com/openai/v1/chat/completions';
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-guard-3-8b",
        messages: [
          {
            role: "user",
            content: UserQuestion,
          }
        ],
        temperature: 0.7,
        max_tokens: maxTokens,
        top_p: 1,
        stream: false,
      })
    };

    const response = await fetch(url, options);
    const result = await response.json;

    if (response.ok && result?.choices?.[0]?.message?.content) {
      let answer = result.choices[0].message.content;

      // Check if the response contains an S code
      for (const [sCode, safeResponse] of Object.entries(s_code_responses)) {
        if (answer.includes(sCode)) {
          answer = safeResponse;
          break;
        }
      }

      return {
        outputVars: {
          answer: answer
        },
        next: {
          path: 'success'
        },
        trace: [
          {
            type: "text",
            payload: {
              message: answer,
            },
          },
        ],
      };
    } else {
      return {
        outputVars: {
          error: `Unable to get an answer: ${result.error?.message || 'Unknown error'}`
        },
        next: {
          path: 'error'
        },
        trace: [
          {
            type: 'debug',
            payload: {
              message: `API response error: ${result.error?.message || 'Unknown error'}`
            }
          }
        ],
      };
    }
  } catch (error) {
    return {
      outputVars: {
        error: error.toString()
      },
      next: {
        path: 'error'
      },
      trace: [
        {
          type: 'debug',
          payload: {
            message: `this is an error: ${error}`
          }
        }
      ],
    };
  }
}

// Inputs: groqApiKey, UserQuestion
// Outputs: answer, error
// Paths: success, error

// Okay for this to work with knowledgebase template, I need to change - Input -> Last_utterance. When safe return last_utterance, and  when not safe return the answer. And once the answer is returned then another seeprate box asking user if they have more questions.

// I also need to add what the codes are about to the function. So that i dont have to provide the categories. 

//S5, S8 and S13 - do not work well. 
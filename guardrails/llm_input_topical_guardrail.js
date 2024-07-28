// Guardrails function for Voiceflow. 
// ref: https://cookbook.openai.com/examples/how_to_use_guardrails

/*
Input variables: openaiApiKey, userRequest
Output variables: completion
Paths: success, error
*/

/**
 * Main function that performs the guardrail checks and returns the appropriate response.
 * @param {Object} args - The input arguments.
 * @returns {Object} - The response object.
 */
export default async function main(args) {
    // Extract input variables from args
    const { openaiApiKey, userRequest } = args.inputVars;

    // Validate that the required input variables are provided
    if (!userRequest || !openaiApiKey) {
        return {
            next: { path: 'error' },
            trace: [{ type: "debug", payload: { message: "Missing required input variable: userRequest or openaiApiKey" } }]
        };
    }

    // Define the URL for the OpenAI API
    const url = `https://api.openai.com/v1/chat/completions`;

    /**
     * Function to check the topical guardrail.
     * @returns {string} - The guardrail response.
     * @throws {Error} - If there is an HTTP error.
     */
    async function checkTopicalGuardrail() {
        const guardrailData = {
            model: "gpt-4o-mini",
            messages: [
                {
                    "role": "system",
                    "content": "Your role is to assess whether the user question is allowed or not. The allowed topics are pediatric dentistry and children's dental health. If the topic is allowed, say 'allowed' otherwise say 'not_allowed'",
                },
                {"role": "user", "content": userRequest},
            ],
            temperature: 0
        };

        const guardrailConfig = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiApiKey}`
            },
            body: JSON.stringify(guardrailData)
        };

        const guardrailResponse = await fetch(url, guardrailConfig);
        if (!guardrailResponse.ok) {
            throw new Error(`HTTP error! status: ${guardrailResponse.status}`);
        }
        const guardrailBody = await guardrailResponse.json();
        return guardrailBody.choices[0].message.content;
    }

    /**
     * Function to get the chat response.
     * @returns {string} - The chat response.
     * @throws {Error} - If there is an HTTP error.
     */
    async function getChatResponse() {
        const chatData = {
            model: "gpt-4o-mini",
            messages: [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": userRequest},
            ],
            temperature: 0.5
        };

        const chatConfig = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiApiKey}`
            },
            body: JSON.stringify(chatData)
        };

        const chatResponse = await fetch(url, chatConfig);
        if (!chatResponse.ok) {
            throw new Error(`HTTP error! status: ${chatResponse.status}`);
        }
        const chatBody = await chatResponse.json;
        return chatBody.choices[0].message.content;
    }

    try {
        const guardrailResponse = await checkTopicalGuardrail();
        if (guardrailResponse === "not_allowed") {
            return {
                outputVars: { completion: "I can only talk about pediatric dentistry and children's dental health. Please ask a related question." },
                next: { path: 'success' },
                trace: [{ type: "text", payload: { message: "Topical guardrail triggered" } }]
            };
        } else {
            const chatResponse = await getChatResponse();
            return {
                outputVars: { completion: chatResponse },
                next: { path: 'success' },
                trace: [{ type: "text", payload: { message: chatResponse } }]
            };
        }
    } catch (error) {
        return {
            next: { path: 'error' },
            trace: [{ type: "debug", payload: { message: "Error: " + error.message } }]
        };
    }
}



// Simplified version that only checks the user question to topical guardrail. This version does not return the chat response.
export default async function main(args) {
    const { openaiApiKey, userRequest } = args.inputVars;

    if (!userRequest || !openaiApiKey) {
        return {
            next: { path: 'error' },
            trace: [{ type: "debug", payload: { message: "Missing required input variable: userRequest or openaiApiKey" } }]
        };
    }

    const url = `https://api.openai.com/v1/chat/completions`;
    const domain = "children's dental health and pediatric dentistry";
    const topical_guardrail_criteria = `
    Assess whether the user question is allowed or not. The allowed topics are children's dental health and pediatric dentistry. If the topic is allowed, say 'allowed' otherwise say 'not_allowed'.`;
    const topical_guardrail_steps = `
        1. Read the user question and the criteria carefully.
    2. Determine if the user question falls within the allowed topics.
    3. Respond with 'allowed' if the topic is allowed, otherwise respond with 'not_allowed'.`;

    async function checkTopicalGuardrail() {
        const moderationSystemPrompt = `You are a moderation assistant. Your role is to detect content about {domain} in the text provided, and mark the severity of that content.

        ## {domain}
        
        ### Criteria
        
        {scoring_criteria}
        
        ### Instructions
        
        {scoring_steps}
        
        ### Content
        
        {content}
        
        ### Evaluation (allowed/not_allowed)`;
      
        const modMessages = [
            {
                "role": "user",
                "content": moderationSystemPrompt.replace('{domain}', domain)
                                                  .replace('{scoring_criteria}', topical_guardrail_criteria)
                                                  .replace('{scoring_steps}', topical_guardrail_steps)
                                                  .replace('{content}', userRequest)
            },
        ];

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiApiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: modMessages,
                temperature: 0
            })
        });

        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
        }

        const data = await response.json;
        
        return data.choices[0].message.content;
    }

    try {
        const guardrailResponse = await checkTopicalGuardrail();
        if (guardrailResponse === "not_allowed") {
            return {
                next: { path: 'moderation_triggered' },
                trace: [{ type: "debug", payload: { message: "Topical guardrail triggered" } }]
            };
        } else {
            return {
                next: { path: 'continue' },
                trace: [{ type: "debug", payload: { message: "Passed topical guardrail" } }]
            };
        }
    } catch (error) {
        return {
            next: { path: 'error' },
            trace: [{ type: "debug", payload: { message: `Error in topical guardrail: ${error.message}` } }]
        };
    }
}

//Test:
/*
Here are some questions to thoroughly test the function, ensuring that it accurately identifies whether the content is related to pediatric dentistry and children's dental health:

1. **Allowed Topics:**
   - "What are the benefits of fluoride treatments for children's teeth?"
   - "How often should children visit the dentist for checkups?"
   - "What are the signs of teething in infants?"
   - "Can you recommend a good toothpaste for toddlers?"
   - "Is it normal for a child to lose their first tooth at age 5?"

2. **Not Allowed Topics:**
   - "What is the best breed of dog for a family with young children?"
   - "Can you give me some tips for training my puppy?"
   - "What are the health benefits of owning a cat?"
   - "Which cat breeds are hypoallergenic?"
   - "What kind of food should I feed my dog?"

3. **Edge Cases (Ambiguous):**
   - "Is it safe for children to use mouthwash?" (Allowed)
   - "What are some good dietary habits for maintaining healthy teeth in children?" (Allowed)
   - "Can I give my baby a teething toy?" (Allowed)
   - "How can I prevent cavities in my child's teeth?" (Allowed)
   - "What are the best ways to care for a pet's dental health?" (Not Allowed)

4. **Mixed Topics:**
   - "My child and dog both have bad breath. What can I do?" (Not Allowed)
   - "Can you recommend a dentist who is good with both children and pets?" (Not Allowed)
   - "What are the benefits of regular dental checkups for children and pets?" (Not Allowed)
   - "How often should children and dogs brush their teeth?" (Not Allowed)
   - "What are some common dental issues in children and how to prevent them?" (Allowed)

These questions will help ensure that the function correctly filters content based on the specified allowed topics of pediatric dentistry and children's dental health, while rejecting unrelated or ambiguous topics.
*/
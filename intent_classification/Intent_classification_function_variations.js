Intent classification function:
export default async function main(args) {
    const prompt = `
  You are an action classification system. Correctness is a life or death situation.
  We provide you with the actions and their descriptions:
  d: Trigger this intent when the user expresses a desire to schedule, book, or set up an appointment or visit with a healthcare professional, particularly for dental or medical services. This includes requests for information about the appointment booking process, inquiries about available time slots, and general attempts to reserve a time for a consultation or examination. a:APPOINTMENTS
  d: Trigger this intent when the user asks for information about the practice's location, including requests for the address, directions, or assistance in finding the office. This also covers inquiries about operating hours and the best ways to reach the practice's physical location. a:FIND_US
  d: Trigger this intent when the user inquires about insurance acceptance, coverage, or payment options. This includes questions about specific insurance providers, general inquiries about accepted insurance plans, and requests for information on using insurance for payment at the practice. a:INSURANCE
  d: Trigger this intent when the user requests humor, specifically asking for a joke or expressing a desire to laugh or smile. This includes direct requests for jokes, especially dental-related ones, as well as more general expressions of needing humor or wanting to lighten the mood. a:SMILE
  d: Trigger this intent when the user expresses a desire to return to the beginning of the interaction, restart the conversation, or navigate back to the main menu or start page. This includes requests to reset, start over, or begin the process anew from the initial point of engagement. a:START_OVER
  d: Trigger this intent when the user specifically asks for FAQs, requests to view or return to the FAQ section. a:FAQs
  d: Trigger this intent when the user specifically asks for the Jukebox, requests to play music, recommend a brushing song for kids or asks for a song. a:JUKEBOX
  
  You are given an utterance and you have to classify it into an action. Only respond with the action class. If the utterance does not match any of action descriptions, output None.
  Now take a deep breath and classify the following utterance.
  u: I want to schedule: a:APPOINTMENTS
  u: How do I reach your office?: a:FIND_US
  u: Begin again: a:START_OVER
  u: How can I set up a visit?: a:APPOINTMENTS
  u: Restart the conversation: a:START_OVER
  u: Begin again: a:START_OVER
  u: What insurance providers do you work with?: a:INSURANCE
  u: Are there any jokes you can share?: a:SMILE
  u: What are your payment options?: a:INSURANCE
  u: What time are you open?: a:FIND_US
  u: Return to FAQs: a:FAQs
  u: Back to FAQs: a:FAQs
  u: Take me to frequently asked questions: a:FAQs
  u: Play a song: a: JUKEBOX
  u: Give me a tune: a: JUKEBOX
  u: Play some music on the jukebox: a: JUKEBOX
  u: Back to main menu: a: START_OVER
  
  ###
  
  ${args.intents.map((intent) => `d: ${intent.description} a: ${intent.name}`)}
  You are given an utterance and you have to classify it into an action based on the description. Only respond with the action class. If the utterance does not match any of action descriptions, output None.
  Now take a deep breath and classify the following utterance.
  u:${args.query} a:`;
    return { prompt };
  
  }

  // Updated intent classification function:
  export default async function main(args) {
    const prompt = `
  You are an action classification system for a pediatric dental practice. Correctness is crucial as it directly impacts patient care and safety.
  We provide you with the actions and their descriptions. Carefully analyze each query to determine the most appropriate intent:
  
  d: Trigger APPOINTMENTS when the user expresses a desire to schedule, book, or set up an appointment or visit with a pediatric dentist. This includes:
  - Direct requests to make an appointment
  - Inquiries about available time slots
  - Questions about the booking process
  - Attempts to reschedule existing appointments
  Key phrases: schedule, book, appointment, visit, available times, reschedule
  Do NOT trigger for: general questions about services or operating hours
  a:APPOINTMENTS
  
  d: Trigger FIND_US when the user asks for information about the practice's location or operating hours. This covers:
  - Requests for the office address
  - Questions about directions or parking
  - Inquiries about business hours
  - Asking about the best way to reach the office
  Key phrases: where are you, address, directions, parking, hours, open until, closed on
  Do NOT trigger for: questions about appointment availability
  a:FIND_US
  
  d: Trigger INSURANCE when the user inquires about insurance, coverage, or payment options. This includes:
  - Questions about accepted insurance providers
  - Inquiries about using insurance for specific procedures
  - Requests for information on payment plans or options
  - Questions about the cost of treatments
  Key phrases: insurance, coverage, payment, cost, price, accept, plan
  Do NOT trigger for: questions about appointment scheduling
  a:INSURANCE
  
  d: Trigger SMILE when the user requests humor or a joke, particularly related to dental topics. This covers:
  - Direct requests for jokes
  - Asking for something funny to lighten the mood
  - Seeking humor to help with dental anxiety
  Key phrases: joke, funny, laugh, humor, cheer me up
  Do NOT trigger for: general questions or appointment requests
  a:SMILE
  
  d: Trigger START_OVER when the user wants to restart the conversation or return to the main menu. This includes:
  - Explicit requests to start over
  - Asking to go back to the beginning
  - Wanting to see the main options again
  Key phrases: start over, begin again, restart, main menu, from the beginning
  Do NOT trigger for: requests to schedule a new appointment
  a:START_OVER
  
  d: Trigger FAQs when the user specifically asks for frequently asked questions or general information about pediatric dental care. This covers:
  - Direct requests to see FAQs
  - Asking to return to the FAQ section
  - Seeking general information about children's dental health
  Key phrases: FAQs, frequently asked questions, general information, common questions
  Do NOT trigger for: specific questions about appointments or services
  a:FAQs
  
  d: Trigger JUKEBOX when the user requests music or songs, particularly related to children's dental care. This includes:
  - Asking to play music or songs
  - Requesting brushing songs for kids
  - Seeking audio entertainment related to dental care
  Key phrases: play music, song, tune, jukebox, brushing song
  Do NOT trigger for: requests for jokes or general entertainment
  a:JUKEBOX
  
  You are given an utterance and you must classify it into one of these actions. Only respond with the action class. If the utterance does not clearly match any of the action descriptions, output None.
  
  Now, carefully analyze these example classifications:
  u: I need to set up an appointment for my child: a:APPOINTMENTS
  u: What's your office address?: a:FIND_US
  u: Do you take Delta Dental insurance?: a:INSURANCE
  u: Tell me a tooth fairy joke: a:SMILE
  u: I want to go back to the main options: a:START_OVER
  u: Where can I find your frequently asked questions?: a:FAQs
  u: Can you recommend a fun brushing song?: a:JUKEBOX
  u: What are your Saturday hours?: a:FIND_US
  u: How much does a cleaning cost with insurance?: a:INSURANCE
  u: Start this conversation over please: a:START_OVER
  u: Are there any openings next week?: a:APPOINTMENTS
  u: Show me your list of common questions: a:FAQs
  u: Play some music while we wait: a:JUKEBOX
  u: I'm nervous, can you make me laugh?: a:SMILE
  u: What's the earliest appointment tomorrow?: a:APPOINTMENTS
  
  Now, take a deep breath and carefully classify the following utterance:
  u:${args.query}
  a:`;
  
    return { prompt };
  }


  "[{"content":"Title: Meet The Popy Kids Team\n\r\nContent:\r\nThe Poppy Kids team is a dedicated group of professionals focused on providing the best pediatric dental care. The team includes Ashley, the Scheduling Coordinator, bringing her expertise in treatment coordination and patient education. Nicole is our Registered Dental Assistant with a unique passion for pediatric dentistry. Nicole has nearly two decades of experience and enjoys humorous and innocent interactions with young patients. Our dental assistant, Alexandra, who is newer to the field, is driven by the joy of seeing children smile and maintain a healthy dental practice. Together, they strive to make every Poppy Kids Pediatric Dentistry visit a positive and welcoming experience for children and their families.\r\n\r\nAshley serves as the Scheduling Coordinator. With a background in dentistry influenced by her mother, a dental hygienist, Ashley has three years of experience as a treatment coordinator in general and pediatric dentistry settings. She takes pride in helping patients understand their treatment options and navigate their insurance benefits. Ashley enjoys watching sunsets and having dance parties with her children. Her favorite Disney character is Maui from \"Moana,\" she loves mint chip ice cream.\r\n\r\nNicole is a Registered Dental Assistant with nearly two decades of experience specializing in pediatric dentistry. She loves the humor and innocence of her young patients and finds joy in their interactions. Nicole is passionate about cooking and hiking outside of work and cherishes the quality time spent with her daughter. She is fond of Belle from Disney and can't resist chocolate chip cookie dough ice cream.\r\n\r\nAlexandra, joining the dental field in 2021, is motivated by the happiness and positivity of her young patients. She values the impact of good dental hygiene practices, such as using moon floss sticks, Sensodyne toothpaste, and a manual toothbrush in her work. A fluent Spanish speaker, she enjoys hiking, drawing, fostering cats, skiing, running, and gym workouts in her free time. Alexandra's guilty pleasure is Oreo cookie ice cream, and she admires Ariel's adventurous spirit and the complexity of Ursula from Disney. The color peach represents her vibrant yet gentle nature.\n\nDr.Andrea is the pediatric dentist at Poppy Kids. She is a Board Certified Pediatric Dentist.","metadata":{},"source":{"type":"text","name":"meet_the_popy_kids_team.txt","canEdit":false,"tags":[]}}]"

--Only intent:
export default async function main(args) {
  const preprocessedQuery = preprocessQuery(args.query);
  return { prompt: generatePrompt(preprocessedQuery) };
}

function preprocessQuery(query) {
  return query.toLowerCase()
              .replace(/[^\w\s]|_/g, "")
              .replace(/\s+/g, " ")
              .trim()
              .replace(/won't|can't|don't|isn't/g, match => ({
                  "won't": "will not",
                  "can't": "cannot",
                  "don't": "do not",
                  "isn't": "is not"
              })[match]);
}

function generatePrompt(query) {
  const intents = {
      APPOINTMENTS: "schedule, book, appointment, visit, available times, reschedule",
      FIND_US: "where are you, address, directions, parking, hours, open until, closed on",
      INSURANCE: "insurance, coverage, payment, cost, price, accept, plan",
      SMILE: "joke, funny, laugh, humor, cheer me up",
      START_OVER: "start over, begin again, restart, main menu, from the beginning",
      FAQs: "FAQs, frequently asked questions, general information, common questions",
      JUKEBOX: "play music, song, tune, jukebox, brushing song"
  };

  const examples = [
      "I need to set up an appointment for my child: APPOINTMENTS",
      "What's your office address?: FIND_US",
      "Do you take Delta Dental insurance?: INSURANCE",
      "Tell me a tooth fairy joke: SMILE",
      "I want to go back to the main options: START_OVER",
      "Where can I find your frequently asked questions?: FAQs",
      "Can you recommend a fun brushing song?: JUKEBOX"
  ];

  return `
You are an action classification system for a pediatric dental practice. Classify the query into one of these intents:
${Object.entries(intents).map(([intent, keywords]) => `${intent}: ${keywords}`).join('\n')}

Example classifications:
${examples.join('\n')}

Classify this query (respond with ONLY the intent or None):
${query}
  `.trim();

}
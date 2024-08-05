export default async function main(args) {
  const descriptions = {
    APPOINTMENTS: "Trigger this action when the user expresses a desire to schedule, book, or set up an appointment or visit with a pediatric dentist. Key phrases: schedule, book, appointment, visit, available times, reschedule. Do NOT trigger for: general questions about services or operating hours.",
    FIND_US: "Trigger this action when the user asks for information about the practice's location or operating hours. Key phrases: where are you, address, directions, parking, hours, open until, closed on. Do NOT trigger for: questions about appointment availability.",
    INSURANCE: "Trigger this action when the user inquires about insurance, coverage, or payment options. Key phrases: insurance, coverage, payment, cost, price, accept, plan. Do NOT trigger for: questions about appointment scheduling.",
    SMILE: "Trigger this action when the user requests humor or a joke, particularly related to dental topics. Key phrases: joke, funny, laugh, humor, cheer me up. Do NOT trigger for: general questions or appointment requests.",
    START_OVER: "Trigger this action when the user wants to restart the conversation or return to the main menu. Key phrases: start over, begin again, restart, main menu, from the beginning. Do NOT trigger for: requests to schedule a new appointment.",
    FAQs: "Trigger this action when the user specifically asks for frequently asked questions or general information about pediatric dental care. Key phrases: FAQs, frequently asked questions, general information, common questions. Do NOT trigger for: specific questions about appointments or services.",
    JUKEBOX: "Trigger this action when the user requests music or songs, particularly related to children's dental care. Key phrases: play music, song, tune, jukebox, brushing song. Do NOT trigger for: requests for jokes or general entertainment.",
    None: "When the user asks about something else."
  };

  const prompt = `
You are an action classification system for a pediatric dental practice. Correctness is crucial as it directly impacts patient care and safety.

We provide you with the actions and their descriptions:
${Object.entries(descriptions).map(([key, value]) => `d: ${value} a:${key}`).join('\n')}

You are given an utterance and you must classify it into one of these actions. Only respond with the action class. If the utterance does not clearly match any of the action descriptions, output None_Intent.

Now, take a deep breath and carefully classify the following utterance:
u:${args.query}
a:`;

  return { prompt };


}
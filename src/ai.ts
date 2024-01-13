import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_KEY,
  dangerouslyAllowBrowser: true,
});

export async function getResponses(prompt: string, system: string) {
  let t1 = Date.now();
  // const gpt3_5 = await openai.chat.completions.create({
  //   messages: [
  //     { role: "system", content: system },
  //     { role: "user", content: prompt },
  //   ],
  //   model: "gpt-3.5-turbo",
  //   temperature: 0.3,
  //   seed: 42,
  // });
  // const gpt3_5_time = Date.now() - t1;

  t1 = Date.now();
  const gpt4 = await openai.chat.completions.create({
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ],
    model: "gpt-4",
    temperature: 0.2,
    seed: 42,
  });
  const gpt4_time = Date.now() - t1;

  // t1 = Date.now();
  // const res = await fetch("https://api.together.xyz/v1/chat/completions", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${import.meta.env.VITE_TOGETHER_API_KEY}`,
  //   },
  //   body: JSON.stringify({
  //     model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
  //     messages: [
  //       { role: "system", content: system },
  //       { role: "user", content: prompt },
  //     ],
  //     temperature: 0.3,
  //   }),
  // });
  // const mistral = await res.json();
  // const mistral_time = Date.now() - t1;

  return {
    // "GPT-3.5 Turbo": {
    //   text: gpt3_5.choices[0].message.content || "",
    //   time: gpt3_5_time,
    // },
    "GPT-4": {
      text: gpt4.choices[0].message.content || "",
      time: gpt4_time,
    },
    // "Mistral Instruct": {
    //   text: mistral.choices[0].message.content || "",
    //   time: mistral_time,
    // },
  };
}

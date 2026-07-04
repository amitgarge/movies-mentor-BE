import { env } from "../config/env.js";

export const getMovieNamesFromAI = async (query) => {
  if (!env.openAiApiKey) {
    const error = new Error("OPENAI_API_KEY is not configured.");
    error.statusCode = 500;
    throw error;
  }

  const response = await fetch(env.openAiChatCompletionsUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openAiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.openAiModel,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "You are a movie recommendation system. Return only movie titles, comma separated. Do not include explanations.",
        },
        {
          role: "user",
          content: `Suggest 5 movies for this query: ${query}`,
        },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data?.error?.message || "OpenAI request failed.");
    error.statusCode = response.status;
    throw error;
  }

  return data.choices?.[0]?.message?.content || "";
};

import axios from "axios";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export async function generateSuggestion(
  prompt: string,
  apiKey?: string
): Promise<string> {
  try {
    const key = apiKey || import.meta.env.VITE_OPENAI_API_KEY;
    if (!key) {
      throw new Error("OpenAI API key not provided");
    }

    const response = await axios.post(
      OPENAI_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You help citizens write clear, respectful statements for social support applications.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 180,
      },
      {
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    const content = response.data?.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }
    return content;
  } catch (e) {
    console.error("OpenAI API error:", e);
    throw e;
  }
}

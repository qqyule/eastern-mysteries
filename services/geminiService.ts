import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DailyPuzzle, Difficulty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Curated list of 22 topics to ensure variety and rotation
const MYSTERY_TOPICS = [
  "The Legend of the White Snake (Bai Suzhen)",
  "The Terracotta Army's Cursed Origins",
  "The Hanging Coffins of the Bo People",
  "The Ghost City of Fengdu",
  "The Monster of Lake Tianchi",
  "The 9,999 Rooms of the Forbidden City",
  "The Weeping of Lady Meng Jiang at the Great Wall",
  "The Fox Spirits (Huli Jing) of the North",
  "The Mystery of the Lop Nur 'Wandering Lake'",
  "The Guizhou Flying Train Incident",
  "The Legend of Nian and the New Year",
  "The Hopping Vampires (Jiangshi) Folklore",
  "The Butterfly Lovers (Liang Zhu)",
  "The Moon Goddess Chang'e and the Elixir",
  "The Old Man Under the Moon (Yue Lao)",
  "The Peach Blossom Spring (Shangri-La)",
  "The Ancient Sanxingdui Civilization Masks",
  "The Mogao Caves of Dunhuang",
  "The Legend of Hou Yi the Sun Shooter",
  "The Cowherd and the Weaver Girl (Qixi)",
  "The Dragon King of the East Sea",
  "The Eight Immortals Crossing the Sea"
];

// Schema for structured output
const puzzleSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Title of the mystery or legend." },
    lunarDate: { type: Type.STRING, description: "The date in Chinese Lunar format (e.g., Year of the Snake, 4th Month, 12th Day)." },
    story: { type: Type.STRING, description: "A captivating 300-400 word story about the specific Eastern mystery provided." },
    questions: {
      type: Type.ARRAY,
      description: "Exactly 3 progressive questions based on the story.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          difficulty: { type: Type.INTEGER, description: "1 for Easy, 2 for Medium, 3 for Hard" },
          text: { type: Type.STRING, description: "The question text." },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "Unique ID for option (A, B, C, D)" },
                text: { type: Type.STRING }
              }
            }
          },
          correctOptionId: { type: Type.STRING, description: "The ID of the correct option." }
        },
        required: ["id", "difficulty", "text", "options", "correctOptionId"]
      }
    }
  },
  required: ["title", "lunarDate", "story", "questions"]
};

export const generateDailyPuzzle = async (): Promise<DailyPuzzle> => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Deterministic selection of topic based on day of year
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    // Cycle through the 22 topics
    const topicIndex = dayOfYear % MYSTERY_TOPICS.length;
    const selectedTopic = MYSTERY_TOPICS[topicIndex];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a "Mystery of the Day" for the app "Eastern Mysteries".
      
      Today's Mandatory Topic: "${selectedTopic}".
      
      Requirements:
      1. Story: Atmospheric, engaging, approx 300 words. Focus on the mystical, historical, or folklore aspects of this topic.
      2. Questions:
         - Q1 (Easy): Direct factual retrieval from text.
         - Q2 (Medium): Deduction or context.
         - Q3 (Hard): Specific detail or deep lore mentioned in the text.
      3. Format: STRICT JSON matching the schema.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: puzzleSchema,
        temperature: 0.7, 
      },
    });

    const data = JSON.parse(response.text || "{}");

    return {
      id: todayStr,
      ...data
    };
  } catch (error) {
    console.error("Failed to generate puzzle:", error);
    // Fallback data
    return {
      id: new Date().toISOString().split('T')[0],
      title: "The Legend of the Nian Monster",
      lunarDate: "Year of the Dragon, 1st Month, 1st Day",
      story: "Long ago, in ancient China, there lived a terrifying beast named Nian. It had the head of a lion and the body of a bull. Every year, on the first day of the Lunar New Year, Nian would come down from the mountains to devour livestock, crops, and even villagers, especially children. The people lived in fear until an old wise man visited the village. He told them that Nian was afraid of three things: the color red, fire, and loud noises. When Nian arrived that night, the villagers were ready. They hung red lanterns and scrolls on their doors/windows, lit firecrackers, and beat drums. The beast, terrified by the commotion and the sea of red, fled back into the mountains, never to return. This is why, to this day, people celebrate Chinese New Year with red decorations and firecrackers.",
      questions: [
        {
          id: "q1",
          difficulty: Difficulty.EASY,
          text: "What three things is the Nian monster afraid of?",
          options: [
            { id: "A", text: "Water, Wind, and Earth" },
            { id: "B", text: "Red color, Fire, and Loud noises" },
            { id: "C", text: "Swords, Shields, and Arrows" },
            { id: "D", text: "Gold, Silver, and Jade" }
          ],
          correctOptionId: "B"
        },
        {
          id: "q2",
          difficulty: Difficulty.MEDIUM,
          text: "Based on the story, when does the Nian monster attack?",
          options: [
            { id: "A", text: "During the Mid-Autumn Festival" },
            { id: "B", text: "On the first day of the Lunar New Year" },
            { id: "C", text: "Every full moon" },
            { id: "D", text: "During the Winter Solstice" }
          ],
          correctOptionId: "B"
        },
        {
          id: "q3",
          difficulty: Difficulty.HARD,
          text: "What combination of animal features does the Nian describe in this specific text?",
          options: [
            { id: "A", text: "Head of a dragon, body of a snake" },
            { id: "B", text: "Head of a tiger, body of a bear" },
            { id: "C", text: "Head of a lion, body of a bull" },
            { id: "D", text: "Head of a dog, body of a wolf" }
          ],
          correctOptionId: "C"
        }
      ]
    };
  }
};
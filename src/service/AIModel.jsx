import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;

if (!apiKey) {
  console.warn("VITE_GOOGLE_GEMINI_AI_API_KEY is not configured.");
}

const ai = new GoogleGenAI({ apiKey });

export async function generateTrip(prompt) {
  return ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      temperature: 0,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          destination: { type: "STRING" },
          duration: { type: "STRING" },
          travelers: { type: "STRING" },
          budget: { type: "STRING" },
          hotels: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                hotelName: { type: "STRING" },
                hotelAddress: { type: "STRING" },
                price: { type: "STRING" },
                hotelImageUrl: { type: "STRING" },
                geoCoordinates: {
                  type: "OBJECT",
                  properties: {
                    latitude: { type: "NUMBER" },
                    longitude: { type: "NUMBER" },
                  },
                  required: ["latitude", "longitude"],
                },
                rating: { type: "NUMBER" },
                description: { type: "STRING" },
              },
              required: [
                "hotelName",
                "hotelAddress",
                "price",
                "rating",
                "description",
                "geoCoordinates",
              ],
            },
          },
          itinerary: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                day: { type: "INTEGER" },
                plan: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      placeName: { type: "STRING" },
                      placeDetails: { type: "STRING" },
                      placeImageUrl: { type: "STRING" },
                      geoCoordinates: {
                        type: "OBJECT",
                        properties: {
                          latitude: { type: "NUMBER" },
                          longitude: { type: "NUMBER" },
                        },
                        required: ["latitude", "longitude"],
                      },
                      ticketPricing: { type: "STRING" },
                      rating: { type: "NUMBER" },
                      travelTime: { type: "STRING" },
                      bestTimeToVisit: { type: "STRING" },
                    },
                    required: [
                      "placeName",
                      "placeDetails",
                      "ticketPricing",
                      "rating",
                      "travelTime",
                      "bestTimeToVisit",
                      "geoCoordinates",
                    ],
                  },
                },
              },
              required: ["day", "plan"],
            },
          },
        },
        required: [
          "destination",
          "duration",
          "travelers",
          "budget",
          "hotels",
          "itinerary",
        ],
      },
    },
  });
}

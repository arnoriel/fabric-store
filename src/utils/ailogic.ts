import Groq from "groq-sdk";
import fabricData from "../data.json";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
  fabricIds?: number[];
}

const quickResponses: Record<string, string> = {
  "halo": "Halo! Selamat datang di Toko Kain Iruka Fabric. Ada jenis kain yang sedang Anda cari?",
  "hi": "Hi! Senang melihat Anda di sini. Mau cari kain batik, sutra, atau bahan lainnya?",
  "p": "Halo! Ada yang bisa kami bantu carikan hari ini?",
  "terima kasih": "Sama-sama! Jika butuh bantuan memilih kain lagi, jangan ragu tanya saya.",
};

export async function getSmartResponse(prompt: string, history: ChatMessage[]) {
  const lowPrompt = prompt.toLowerCase().trim();
  if (quickResponses[lowPrompt]) {
    return { text: quickResponses[lowPrompt], fabricIds: [] };
  }

  try {
    // Optimasi Context: Kirim data kain yang relevan saja
    const fabricContext = fabricData.map((f) => ({
      id: f.id,
      n: f.name,
      c: f.category,
      p: f.price,
      o: f.origin
    }));

    const systemPrompt = `Role: Asisten Toko Kain Iruka Fabric. 
    Format JSON: {"text": "jawaban", "ids": [id_kain_yang_relevan]}. 
    Data: ${JSON.stringify(fabricContext)}. 
    Aturan: Ramah, profesional, Bahasa Indonesia. Jika user mencari kain tertentu, sebutkan kelebihannya dan berikan ID-nya dalam array 'ids'.`;

    const minimalHistory = history.slice(-3).map((chat) => ({
      role: chat.role === "user" ? "user" : "assistant",
      content: chat.content,
    }));

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...minimalHistory,
        { role: "user", content: prompt },
      ] as any,
      model: "llama-3.1-8b-instant",
      temperature: 0.6,
      max_tokens: 400,
      response_format: { type: "json_object" }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(responseContent);

    return {
      text: parsed.text || "Ada lagi yang bisa saya bantu mengenai koleksi kain kami?",
      fabricIds: parsed.ids || []
    };

  } catch (error: any) {
    console.error("AI Error:", error);
    if (error?.status === 429) {
      return { text: "Maaf, saya sedang melayani banyak pelanggan. Tunggu sebentar ya.", fabricIds: [] };
    }
    return { text: "Maaf, terjadi gangguan teknis. Bisa ulangi pertanyaannya?", fabricIds: [] };
  }
}
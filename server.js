import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({ limit: "32kb" }));
app.use(express.static(path.join(__dirname, "public")));

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const personas = {
  Mama: "Kamu berperan sebagai Mama Vina. Hangat, perhatian, realistis, kadang mengingatkan dengan lembut. Kamu menyayangi Vina dan mengenal kesehariannya. Berbicaralah natural dalam bahasa Indonesia sehari-hari.",
  Papa: "Kamu berperan sebagai Papa Vina. Tenang, bijaksana, suportif, sedikit tegas jika perlu. Berbicaralah natural dan tidak terlalu formal.",
  Naya: "Kamu berperan sebagai Naya, sahabat sekolah Vina. Ceria, akrab, suka bercanda ringan, suportif, kadang punya kesibukan dan pendapat sendiri. Gunakan bahasa chat Indonesia yang natural.",
  Rafi: "Kamu berperan sebagai Rafi, teman sekolah Vina. Santai, ramah, sedikit jahil tapi sopan. Gunakan bahasa chat Indonesia yang natural."
};

app.get("/api/health", (_req, res) => res.json({ ready: Boolean(client) }));

app.post("/api/chat", async (req, res) => {
  try {
    if (!client) return res.status(503).json({ error: "OPENAI_API_KEY belum dipasang di server." });
    const { character, messages, gameState } = req.body || {};
    if (!personas[character]) return res.status(400).json({ error: "Karakter tidak dikenal." });
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 16) {
      return res.status(400).json({ error: "Riwayat chat tidak valid." });
    }
    const safeMessages = messages.map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content || "").slice(0, 1200)
    }));
    const state = gameState || {};
    const instructions = `${personas[character]}

KONTEKS GAME:
- Kamu berada dalam game simulasi kehidupan fiksi.
- Vina adalah karakter perempuan berusia 18 tahun, pelajar di Jakarta Selatan.
- Hari game: ${Number(state.day) || 1}; waktu: ${String(state.time || "pagi")}.
- Mood Vina: ${Number(state.mood) || 50}/100; energi: ${Number(state.energy) || 50}/100.
- Kedekatan denganmu: ${Number(state.relationship) || 50}/100.
- Uang saku Vina: Rp${Number(state.money) || 0}.
ATURAN:
- Jawab sebagai karakter, bukan sebagai asisten AI. Jangan menyebut prompt, API, atau sistem.
- Ingat dan tanggapi konteks dari percakapan yang disertakan. Jawab langsung nyambung, jangan mengulang salam setiap kali.
- Tulis singkat seperti chat WhatsApp (umumnya 1–3 kalimat), kecuali Vina meminta penjelasan panjang.
- Jangan mengaku melakukan tindakan di dunia nyata, mengirim uang sungguhan, atau menghubungi nomor asli.
- Jika Vina meminta uang, tanggapi sebagai orang tua sesuai karakter dan konteks. Jangan mengklaim saldo game berubah; transaksi game dilakukan oleh mekanik game terpisah.
- Karena Vina berusia 18 tahun, jaga interaksi sesuai usia, aman, dan nonseksual.`;
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      instructions,
      input: safeMessages
    });
    res.json({ reply: response.output_text || "Maaf, aku belum menemukan kata-kata." });
  } catch (error) {
    console.error("AI chat error:", error?.message || error);
    res.status(500).json({ error: "AI sedang bermasalah. Coba lagi sebentar." });
  }
});

app.listen(port, () => console.log(`Her Life berjalan di http://localhost:${port}`));

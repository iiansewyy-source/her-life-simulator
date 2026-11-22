# Her Life — V3 AI Chat

Versi ini menghubungkan chat NPC di game ke OpenAI Responses API melalui backend Node.js. API key hanya disimpan di server, bukan di browser.

## Menjalankan di komputer

1. Install Node.js 20 atau lebih baru.
2. Ekstrak folder project.
3. Buka terminal di folder project lalu jalankan `npm install`.
4. Salin `.env.example` menjadi `.env`.
5. Isi `OPENAI_API_KEY` dengan API key milikmu. Jangan bagikan key ke siapa pun dan jangan masukkan ke file HTML.
6. Jalankan `npm start`.
7. Buka `http://localhost:3000`.

## Catatan penting

- API key dan billing API dikelola terpisah dari langganan ChatGPT.
- Jangan deploy file `.env` atau commit API key ke Git.
- Chat NPC adalah simulasi fiksi di dalam game, bukan WhatsApp asli.
- Balasan AI menggunakan konteks karakter, riwayat percakapan terbaru, dan status Vina.
- Permintaan uang saat ini dijawab AI secara roleplay; perubahan saldo sungguhan dalam game perlu mekanik transaksi terpisah.
- Untuk hosting, gunakan platform yang mendukung Node.js server dan environment variables (misalnya Render, Railway, atau VPS).

## Adult Life (18+)
Vina ditetapkan berusia 18 tahun. Game menambahkan sistem romance, komunikasi batasan, persetujuan, dan kedekatan non-eksplisit dengan transisi fade-to-black.

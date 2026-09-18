# GymGear — Review & Booking

Lightweight Next.js app for equipment reviews and showroom booking.

- Live demo: https://gymgear-app.vercel.app/

## Quick start

Install dependencies and run locally:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

### AI chatbot

Copy `.env.example` to `.env.local` and set `AI_API_KEY` (or `OPENAI_API_KEY`). The key is read only by `/api/chat` on the server and must not be prefixed with `NEXT_PUBLIC_`. The route supplies the model with public equipment data and filtered knowledge documents, and instructs it to refuse secrets, personal data, credentials, and internal system information.

`AI_BASE_URL` can point to any OpenAI-compatible provider and `AI_MODEL` selects the model.

## Deploy

Deploy on Vercel by linking this repository and adding required environment variables (e.g. Supabase keys).

## License

MIT

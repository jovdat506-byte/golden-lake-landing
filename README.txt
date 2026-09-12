GOLDEN LAKE — VERCEL LANDING

Fayllar:
- index.html — landing page
- assets/golden-lake-hero.webp — optimizatsiya qilingan hero rasm
- api/lead.js — leadlarni Telegramga yuboradigan Vercel Serverless Function
- vercel.json — cache sozlamalari

VERCELGA JOYLASH:
1. Papkani GitHub repoga upload qiling.
2. Vercel > Add New Project > GitHub repo tanlang.
3. Framework Preset: Other.
4. Deploy bosing.

LEADLARNI TELEGRAMGA OLISH:
Vercel > Project > Settings > Environment Variables ichida quyidagilarni kiriting:
- TELEGRAM_BOT_TOKEN = Telegram bot tokeningiz
- TELEGRAM_CHAT_ID = leadlar keladigan chat/group ID
Keyin Redeploy qiling.

Agar Telegram integratsiyasi hali yo'q bo'lsa, sayt ishlaydi, lekin forma submit qilganda integratsiya xatosi chiqadi.

UTM tracking avtomatik qo'shilgan:
utm_source, utm_medium, utm_campaign, utm_content, utm_term
lead bilan birga Telegramga yuboriladi.

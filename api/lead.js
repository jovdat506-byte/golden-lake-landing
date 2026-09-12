export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, phone, rooms, utm_source, utm_medium, utm_campaign, utm_content, utm_term, page, referrer } = req.body || {};
    if (!name || !phone || !rooms) return res.status(400).json({ error: 'Required fields missing' });

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return res.status(500).json({ error: 'Telegram env variables are not configured' });

    const safe = v => String(v || '-').replace(/[<>]/g, '');
    const text = [
      '🏙️ Yangi Golden Lake lead',
      '',
      `👤 Ism: ${safe(name)}`,
      `📞 Telefon: ${safe(phone)}`,
      `🏠 Xonadon: ${safe(rooms)}`,
      '',
      '📊 UTM:',
      `source: ${safe(utm_source)}`,
      `medium: ${safe(utm_medium)}`,
      `campaign: ${safe(utm_campaign)}`,
      `content: ${safe(utm_content)}`,
      `term: ${safe(utm_term)}`,
      '',
      `🔗 Page: ${safe(page)}`,
      `↩️ Referrer: ${safe(referrer)}`
    ].join('\n');

    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });
    const data = await tg.json();
    if (!tg.ok || !data.ok) return res.status(502).json({ error: 'Telegram API error' });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
}

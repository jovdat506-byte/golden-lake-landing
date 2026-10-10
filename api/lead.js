const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwSBOCCXFArpgd0j4RD3DyCqXCCNY3DBKvwSDSt8N5GayPJAzMYS_PvWXl1kux6m78/exec";

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "object") return req.body;
  try {
    return JSON.parse(req.body);
  } catch {
    return Object.fromEntries(new URLSearchParams(req.body));
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const body = parseBody(req);
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const room = String(body.room || "").trim();
    const source = String(body.source || "website").trim();
    const campaign = String(body.campaign || "").trim();
    const content = String(body.content || "").trim();

    if (!name || !phone) {
      return res.status(400).json({ ok: false, error: "Name and phone are required" });
    }

    const params = new URLSearchParams();
    params.set("name", name);
    params.set("phone", phone.startsWith("'") ? phone : "'" + phone);
    params.set("room", room);
    params.set("source", source);
    params.set("campaign", campaign);
    params.set("content", content);

    const upstream = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: params.toString(),
      redirect: "follow"
    });

    const text = await upstream.text();
    const accepted =
      upstream.ok &&
      (
        /^OK\b/i.test(text.trim()) ||
        /"success"\s*:\s*true/i.test(text) ||
        /success\s*[:=]\s*true/i.test(text)
      );

    if (!accepted) {
      console.error("Apps Script rejected lead", upstream.status, text);
      return res.status(502).json({
        ok: false,
        error: "Google Sheets endpoint rejected the lead",
        upstreamStatus: upstream.status,
        upstream: text.slice(0, 300)
      });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Lead API error", error);
    return res.status(500).json({ ok: false, error: error.message || "Internal error" });
  }
}

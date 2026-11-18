module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const webhookUrl = process.env.PABBLY_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(503).json({ error: "Inquiry service is not configured" });
  }

  const { name, email, message, marketing_opt_in: marketingOptIn } = req.body || {};
  const cleanName = typeof name === "string" ? name.trim() : "";
  const cleanEmail = typeof email === "string" ? email.trim() : "";
  const cleanMessage = typeof message === "string" ? message.trim() : "";
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);

  if (!cleanName || cleanName.length > 100 || !emailLooksValid || cleanEmail.length > 254 || !cleanMessage || cleanMessage.length > 2000 || typeof marketingOptIn !== "boolean") {
    return res.status(400).json({ error: "Please check the inquiry fields" });
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: cleanName,
        email: cleanEmail,
        message: cleanMessage,
        marketing_opt_in: marketingOptIn,
        submitted_at: new Date().toISOString(),
        source: "landing_page",
      }),
    });
    if (!upstream.ok) throw new Error(`Pabbly returned ${upstream.status}`);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Pabbly inquiry submission failed", error.message);
    return res.status(502).json({ error: "Inquiry service is temporarily unavailable" });
  }
};

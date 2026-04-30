export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/briefings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: "return=representation"
      },
      body: JSON.stringify({
        nome: body.nome || "",
        email: body.email || "",
        telefone: body.telefone || "",
        linkedin: body.linkedin || "",
        objetivo: body.objetivo || "",
        curriculo_url: "",
        carta_url: ""
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ ok: false, error: data });
    }

    return res.status(200).json({ ok: true, data });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}

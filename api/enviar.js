export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const body = JSON.parse(req.body);

    const { nome, email, telefone, linkedin, objetivo } = body;

    // salva no Supabase
    const response = await fetch(
      process.env.SUPABASE_URL + "/rest/v1/briefings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          Prefer: "return=representation"
        },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          linkedin,
          objetivo
        })
      }
    );

    const data = await response.json();

    res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: "Erro ao enviar briefing"
    });
  }
}

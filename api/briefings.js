export default async function handler(req, res) {
  try {
    const response = await fetch(
      process.env.SUPABASE_URL + "/rest/v1/briefings?select=*",
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );

    const data = await response.json();

    res.status(200).json({
      ok: true,
      briefings: data,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: "Erro ao buscar briefings",
    });
  }
}

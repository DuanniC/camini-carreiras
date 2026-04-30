import formidable from "formidable";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: {
    bodyParser: false,
  },
};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function parseForm(req) {
  const form = formidable({ multiples: false });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

function getValue(fields, name) {
  const value = fields[name];
  return Array.isArray(value) ? value[0] : value || "";
}

async function uploadFile(file, folder) {
  if (!file) return "";

  const realFile = Array.isArray(file) ? file[0] : file;
  const fileBuffer = fs.readFileSync(realFile.filepath);
  const fileName = `${folder}/${Date.now()}-${realFile.originalFilename}`;

  const { error } = await supabase.storage
    .from("documentos")
    .upload(fileName, fileBuffer, {
      contentType: realFile.mimetype,
      upsert: false,
    });

  if (error) throw error;

  return fileName;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const { fields, files } = await parseForm(req);

    const nome = getValue(fields, "nome");
    const email = getValue(fields, "email");
    const telefone = getValue(fields, "telefone");
    const linkedin = getValue(fields, "linkedin");
    const linkedin_user = getValue(fields, "linkedinUser");
    const objetivo = getValue(fields, "objetivo");

    const curriculo_path = await uploadFile(files.curriculo, "curriculos");
    const carta_path = await uploadFile(files.carta, "cartas");

    const { data, error } = await supabase
      .from("briefings")
      .insert([
        {
          nome,
          email,
          telefone,
          linkedin,
          linkedin_user,
          objetivo,
          curriculo_path,
          carta_path,
        },
      ])
      .select();

    if (error) {
      return res.status(400).json({ ok: false, error });
    }

    return res.status(200).json({ ok: true, data });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
}

import { createFileRoute } from "@tanstack/react-router";

const UC = "https://ai.gateway.lovable.dev/v1/images/generations";

async function uret(model: string, istem: string, apiKey: string) {
  const govde =
    model.startsWith("google/")
      ? {
          model,
          messages: [{ role: "user", content: istem }],
          modalities: ["image", "text"],
        }
      : { model, prompt: istem, quality: "low", size: "1024x1024", n: 1 };

  const res = await fetch(UC, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(govde),
  });
  if (!res.ok) {
    return { hata: `${res.status}: ${(await res.text()).slice(0, 200)}`, b64: null as string | null };
  }
  const json = (await res.json()) as { data?: { b64_json?: string }[] };
  const b64 = json.data?.[0]?.b64_json ?? null;
  return { hata: b64 ? null : "Model görsel döndürmedi.", b64 };
}

export const Route = createFileRoute("/api/gorsel-uret")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey)
          return Response.json({ hata: "Yapay zekâ anahtarı yapılandırılmamış." }, { status: 500 });

        const { istem } = (await request.json()) as { istem?: string };
        if (!istem || !istem.trim())
          return Response.json({ hata: "Görsel istemi boş." }, { status: 400 });

        let sonuc = await uret("google/gemini-3.1-flash-image", istem, apiKey);
        if (!sonuc.b64) {
          sonuc = await uret("openai/gpt-image-1-mini", istem, apiKey);
        }
        if (!sonuc.b64) {
          return Response.json({ hata: sonuc.hata ?? "Görsel üretilemedi." }, { status: 502 });
        }
        return Response.json({ b64: sonuc.b64 });
      },
    },
  },
});

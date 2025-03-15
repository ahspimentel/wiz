import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { answers } = await request.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      O usuário respondeu as seguintes perguntas sobre aprendizado de idiomas:
      
      ${answers.map((a, i) => `${i + 1}. ${a}`).join("\n")}
      
      Agora, com base nessas respostas, gere até 4 perguntas adicionais **extremamente relevantes** para refinar ainda mais a recomendação do curso.

      **Foque nas seguintes informações:**
      - Qual idioma o usuário deseja aprender?
      - Quanto tempo ele espera para estar falando o idioma com fluência?
      - Qual seu nível atual no idioma? (Iniciante, Intermediário, Avançado)
      - Quantas horas por semana ele pode dedicar ao curso?
      - Ele prefere aulas presenciais ou online?
      - Tem interesse em programas de intercâmbio?

      **Formato da resposta:** Retorne um JSON **puro** (sem explicações, sem markdown), no formato:
      [
        { "question": "Qual idioma você deseja aprender?", "options": ["Inglês", "Espanhol", "Francês", "Outro"] },
        { "question": "Em quanto tempo você espera estar fluente?", "options": ["3 meses", "6 meses", "1 ano", "Mais de 1 ano"] },
        { "question": "Qual seu nível atual?", "options": ["Iniciante", "Intermediário", "Avançado"] },
        { "question": "Quantas horas por semana pode dedicar ao curso?", "options": ["2h", "5h", "10h", "Tempo Integral"] }
      ]
    `;

    const result = await model.generateContent({ contents: [{ parts: [{ text: prompt }] }] });
    let text = await result.response.text();

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let perguntas;
    try {
      perguntas = JSON.parse(text);
    } catch {
      perguntas = [{ question: text, options: ["Sim", "Não"] }];
    }

    return Response.json({ perguntas });
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    return Response.json({ error: "Erro ao conectar ao Gemini" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { answers } = await request.json();

    let curso = "Curso Genérico";
    if (answers.includes("Carreira")) curso = "Curso Avançado";
    if (answers.includes("Empreender")) curso = "Curso de Empreendedorismo";

    return Response.json({ curso });
  } catch (error) {
    console.error("Erro na recomendação:", error);
    return Response.json({ error: "Erro interno na recomendação" }, { status: 500 });
  }
}

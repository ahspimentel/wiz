"use client";
import { useState } from "react";
import questions from "@/lib/questions.json";
import WizardChat from "@/components/WizardChat";

export default function WizardChat({ name }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [dynamicQuestions, setDynamicQuestions] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  

  async function handleAnswer(option) {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else if (dynamicQuestions.length === 0) {
      // Chamar Gemini para gerar perguntas adicionais
      try {
        const res = await fetch("/api/gemini", {
          method: "POST",
          body: JSON.stringify({ answers: newAnswers }),
          headers: { "Content-Type": "application/json" },
        });
      
        const data = await res.json();
        setDynamicQuestions(Array.isArray(data.perguntas) ? data.perguntas : []);
      } catch (error) {
        console.error("Erro ao buscar perguntas adicionais:", error);
        setDynamicQuestions([]); // Evita erro se a API falhar
      }
    } else {
      // Chamar recomendação final
      try {
        const res = await fetch("/api/recommend", {
          method: "POST",
          body: JSON.stringify({ answers: newAnswers }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        setRecommendation(data.curso);
      } catch (error) {
        console.error("Erro ao buscar recomendação:", error);
      }
    }
  }

  const currentQuestion =
  Array.isArray(dynamicQuestions) && dynamicQuestions.length > 0
    ? dynamicQuestions[current] || {}
    : questions[current] || {};

  if (recommendation) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="shadow rounded-lg p-8">
          <h2 className="text-xl font-bold mb-4">Sugestão para você, {name}:</h2>
          <p className="text-lg">{recommendation}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="shadow rounded-lg p-8">
        <h2 className="text-xl font-bold mb-4">
          {currentQuestion.question}
        </h2>
        {currentQuestion?.options?.map((opt) => (
          <button
            key={opt}
            className="block w-full mb-2 p-2 bg-gray-100 rounded hover:bg-gray-200"
            onClick={() => handleAnswer(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

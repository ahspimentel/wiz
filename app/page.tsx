"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleStart = () => {
    if (name.trim()) router.push(`/wizard?name=${encodeURIComponent(name)}`);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="shadow rounded-lg p-8">
        <h1 className="text-xl mb-4">Informe seu nome:</h1>
        <input
          className="border rounded w-full p-2 mb-4"
          placeholder="Digite aqui"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="bg-blue-500 text-white p-2 rounded w-full" onClick={handleStart}>
          Continuar
        </button>
      </div>
    </div>
  );
}

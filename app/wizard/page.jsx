"use client";
import { useSearchParams } from "next/navigation";
import WizardChat from "@/components/WizardChat";
import { Suspense } from "react";

export default function Wizard() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <WizardWrapper />
    </Suspense>
  );
}

function WizardWrapper() {
  const params = useSearchParams();
  const name = params.get("name") || "Visitante";

  return <WizardChat name={name} />;
}
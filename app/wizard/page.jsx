"use client";
import { useSearchParams } from "next/navigation";
import WizardChat from "@/components/WizardChat";

export default function Wizard() {
  const params = useSearchParams();
  const name = params.get("name");

  return <WizardChat name={name} />;
}

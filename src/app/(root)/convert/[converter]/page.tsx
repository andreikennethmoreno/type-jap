// src/app/(root)/convert/[converter]/page.tsx

import TextConverter from "@/components/text-converter";
import { notFound } from "next/navigation";
import type { TextConverterDefinition } from "@/interface/converter.interface";

export default async function ConverterPage({
  params,
}: {
  params: Promise<{ converter: string }>;
}) {
  const { converter } = await params;

  let converterConfig: TextConverterDefinition | null = null;

  try {
    // Dynamically import the converter file using the slug
    const mod = await import(`@/lib/converters/${converter}`);
    converterConfig = mod.default;
  } catch (err) {
    // File doesn't exist or import failed
    return notFound();
  }

  if (!converterConfig) return notFound();

  return (
    <TextConverter
      slug={converter}
      name={converterConfig.name}
      description={converterConfig.description}
    />
  );
}

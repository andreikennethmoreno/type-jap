// src/app/(root)/convert/[converter]/page.tsx

import TextConverter from "@/components/text-converter";
import { notFound } from "next/navigation";
import type { TextConverterDefinition } from "@/interface/converter.interface";
import { Suspense } from "react";
import SkeletonLoader from "@/components/skeleton-loader";

export default async function ConverterPage({
  params,
}: {
  params: { converter: string };
}) {
  const { converter } = params;

  let converterConfig: TextConverterDefinition | null = null;

  //const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

  try {
    // Dynamically import the converter file using the slug
    //await wait(2000);
    const mod = await import(`@/lib/converters/${converter}`);
    converterConfig = mod.default;
  } catch (err) {
    // File doesn't exist or import failed
    return notFound();
  }

  if (!converterConfig) return notFound();

  return (
    <Suspense fallback={<SkeletonLoader />}>
      <TextConverter
        slug={converter}
        name={converterConfig.name}
        description={converterConfig.description}
      />
    </Suspense>
  );
}

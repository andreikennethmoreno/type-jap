import TextConverter from "@/components/text-converter";
import { converters } from "@/lib/converters";
import { notFound } from "next/navigation";

export default async function ConverterPage({
  params,
}: {
  params: Promise<{ converter: string }>;
}) {
  // Await the params since they're now a Promise in Next.js 15
  const { converter } = await params;

  const converterConfig = converters[converter];

  if (!converterConfig) return notFound();

  return (
    <TextConverter
      slug={converter}
      name={converterConfig.name}
      description={converterConfig.description}
    />
  );
}

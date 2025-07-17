import TextConverter from "@/components/text-converter";
import { converters } from "@/lib/converters";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    converter: string;
  };
}

export default async function ConverterPage({ params }: PageProps) {
  const converter = converters[params.converter];

  if (!converter) return notFound();

  return (
    <TextConverter
      slug={params.converter}
      name={converter.name}
      description={converter.description}
    />
  );
}

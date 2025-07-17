import TextConverter from "@/components/text-converter";
import { converters } from "@/lib/converters";
import { notFound } from "next/navigation";


export default async function ConverterPage({
  params,
}: {
  params: { converter: string };
}) {
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

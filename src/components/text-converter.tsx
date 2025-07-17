"use client";

import { useEffect, useState } from "react";
import { useFormHandler } from "@/hooks/use-form-handler";
import {
  converterInputSchema,
  ConverterInput,
} from "@/schemas/converter.schema";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  slug: string;
  name: string;
  description?: string;
}

export default function TextConverter({ slug, name, description }: Props) {
  const [result, setResult] = useState("");
  const [converterFn, setConverterFn] = useState<
    ((input: string) => string) | null
  >(null);

  // ✅ Lazy load converter module on mount
  useEffect(() => {
    const loadConverter = async () => {
      try {
        const mod = await import(`@/lib/converters/${slug}`);
        setConverterFn(() => mod.default.convert); // preserve function ref
      } catch (err) {
        console.error("Converter not found:", err);
        setConverterFn(null);
      }
    };

    loadConverter();
  }, [slug]);

  const { data, error, handleChange, handleSubmit, reset } =
    useFormHandler<ConverterInput>(converterInputSchema, ({ input }) => {
      if (!converterFn) return;
      const converted = converterFn(input);
      setResult(converted);
    });

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="text-center max-w-4xl mx-auto mb-12">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-pretty lg:text-5xl">
          {name} <span className="text-primary">Converter</span>
        </h1>
        {description && (
          <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
            {description}
          </p>
        )}
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Enter your text below</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={data.input ?? ""}
              onChange={(e) => handleChange("input", e.target.value)}
              placeholder="Type here..."
              className="min-h-[200px]"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <div className="flex gap-2 mt-4">
              <Button onClick={handleSubmit} disabled={!converterFn}>
                Convert
              </Button>
              <Button variant="outline" onClick={reset}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>Your converted output</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={result}
              readOnly
              placeholder="Converted text will appear here..."
              className="min-h-[200px] bg-gray-100"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const convertSchema = z.object({
  input: z.string().min(1, "Must be at least 1 character").max(1000),
});

export default function ZodOnlyTextConverter() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState("");

  const handleConvert = () => {
    const result = convertSchema.safeParse({ input });

    if (!result.success) {
      const firstError = result.error.message; 
      setError(firstError || "Unknown error");
      setResult("");
      return;
    }

    
    setError(null);
    const converted = input.split("").reverse().join(""); // Replace with actual logic
    setResult(converted);
  };

  const handleClear = () => {
    setInput("");
    setError(null);
    setResult("");
  };

  return (
    <div className="min-h-screen py-12 px-4 ">
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto mb-12">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-pretty lg:text-5xl">
          Text{" "}
          <span className="text-primary">Printer</span>
        </h1>
        <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi
          doloremque mollitia fugiat omnis! Porro facilis quo animi consequatur.
          Explicabo.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Card */}
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Enter your text below</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type here..."
              className="min-h-[200px]"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            <div className="flex gap-2 mt-4">
              <Button onClick={handleConvert}>Convert</Button>
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result Card */}
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

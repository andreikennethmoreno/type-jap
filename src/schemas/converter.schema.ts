import { z } from "zod";

export const converterInputSchema = z.object({
  input: z.string().min(1, "Input is required").max(1000),
});

export type ConverterInput = z.infer<typeof converterInputSchema>;

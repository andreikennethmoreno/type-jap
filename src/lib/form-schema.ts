// src/lib/form-schema.ts
import { z } from "zod";

export const TestFormSchema = z.object({
  inputText: z
    .string()
    .min(2, { message: "Must be at least 2 characters" })
    .max(100),
});

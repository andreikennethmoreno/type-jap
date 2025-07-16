// src/lib/form-schema.ts
import { z } from "zod";

export const TestFormSchema = z.object({
  inputText: z
    .string()
    .min(3, { message: "Must be at least 3 characters" })
    .max(100),
});

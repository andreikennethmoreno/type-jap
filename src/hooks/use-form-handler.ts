import { useState } from "react";
import { ZodSchema } from "zod";

export function useFormHandler<T extends Record<string, unknown>>(
  schema: ZodSchema<T>,
  onValid: (data: T) => void
) {
  const [data, setData] = useState<Partial<T>>({});
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: keyof T, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const result = schema.safeParse(data);
    if (!result.success) {
      setError(result.error.message ?? "Unknown error");
    } else {
      setError(null);
      onValid(result.data);
    }
  };

  const reset = () => {
    setData({});
    setError(null);
  };

  return { data, error, handleChange, handleSubmit, reset };
}

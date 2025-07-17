import { useState } from "react";
import { ZodSchema } from "zod";
import { toast } from "react-toastify";

export function useFormHandler<T extends Record<string, unknown>>(
  schema: ZodSchema<T>,
  onValid: (data: T) => void,
  options?: {
    successMessage?: string;
    errorMessage?: string;
    toast?: boolean;
  }
) {
  const [data, setData] = useState<Partial<T>>({});
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: keyof T, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const message =
        options?.errorMessage ?? result.error.message ?? "Unknown error";
      setError(message);
      if (options?.toast !== false) toast.error(message);
    } else {
      setError(null);
      onValid(result.data);
      if (options?.toast !== false) {
        toast.success(options?.successMessage ?? "Successfully submitted!");
      }
    }
  };

  const reset = () => {
    setData({});
    setError(null);
  };

  return { data, error, handleChange, handleSubmit, reset };
}

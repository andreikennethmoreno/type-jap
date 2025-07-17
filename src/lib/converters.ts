// no need for "use client" here

import { TextConverterDefinition } from "@/interface/converter.interface";


export const converters: Record<string, TextConverterDefinition> = {
  reverse: {
    name: "Reverse Text",
    description: "Reverses the input text.",
    convert: (input: string) => input.split("").reverse().join(""),
  },
  upper: {
    name: "Uppercase Text",
    description: "Converts text to uppercase.",
    convert: (input: string) => input.toUpperCase(),
  },
};

import type { TextConverterDefinition } from "@/interface/converter.interface";

const reverseTextConverter: TextConverterDefinition = {
  name: "Reverse Text",
  description: "Reverses the input text.",
  convert: (input: string) => input.split("").reverse().join(""),
};

export default reverseTextConverter;

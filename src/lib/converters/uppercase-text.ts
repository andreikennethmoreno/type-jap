import type { TextConverterDefinition } from "@/interface/converter.interface";

const uppercaseTextConverter: TextConverterDefinition = {
  name: "Uppercase Text",
  description: "Converts text to uppercase.",
  convert: (input: string) => input.toUpperCase(),
};

export default uppercaseTextConverter;

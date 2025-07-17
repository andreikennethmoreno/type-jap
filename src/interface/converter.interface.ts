export interface TextConverterDefinition {
  name: string;
  description?: string;
  convert: (input: string) => string;
}

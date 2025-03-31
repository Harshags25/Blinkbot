export interface BlinkToolType {
  name: string;
  description: string;
  synonyms: string[];
  schema: any;
  function: Function;
  customToolPrompt: string;
  example: {
    query: string;
    output: any;
  }[];
}

export interface AIResponse {
  tool: string;
  inputMint?: string;
  outputMint?: string;
  domain?: string;
  address?: string;
  game_type?: string;
  token: string;
}

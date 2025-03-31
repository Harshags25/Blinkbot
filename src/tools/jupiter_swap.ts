import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import { z } from "zod";
import { BlinkToolType } from "../types";

export async function JupiterSwap(args: {
  outputMint: string;
  inputMint?: string;
}): Promise<{
  status: string;
  error?: string;
  url?: string;
}> {
  let { outputMint, inputMint } = args;

  if (!inputMint) {
    if (outputMint.toUpperCase() != "SOL")
      inputMint = "So11111111111111111111111111111111111111112";
    else inputMint = "USDC";
  }

  try {
    const res = await fetch("https://tokens.jup.ag/tokens?tags=verified");
    const tokens = await res.json();

    const getMintAddressFromSymbol = (symbol: string) => {
      const token = tokens.find(
        (t: any) =>
          t.symbol.toLowerCase().replace(/\s+/g, "") ===
          symbol.toLowerCase().replace(/\s+/g, ""),
      );
      return token ? token.address : null;
    };

    try {
      inputMint = new PublicKey(inputMint).toString();
    } catch (err) {
      const mintAddressFromSymbol = getMintAddressFromSymbol(inputMint);
      if (mintAddressFromSymbol) {
        inputMint = mintAddressFromSymbol;
      } else {
        return {
          status: "error",
          error:
            "Input mintAddress not found. Please provide a valid mintAddress/CA or a valid token symbol",
        };
      }
    }

    try {
      outputMint = new PublicKey(outputMint).toString();
    } catch (err) {
      const mintAddressFromSymbol = getMintAddressFromSymbol(outputMint);
      if (mintAddressFromSymbol) {
        outputMint = mintAddressFromSymbol;
      } else {
        return {
          status: "error",
          error: "Output mintAddress not found",
        };
      }
    }

    if (inputMint === outputMint) {
      return {
        status: "error",
        error: "Input and output mint addresses are the same",
      };
    }

    const quoteResponse = await axios.get(
      `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=100000000&slippageBps=50`,
    );

    const data = quoteResponse.data;

    if (data.error) {
      return {
        status: "error",
        error: "Tokens not Tradable",
      };
    }

    return {
      status: "success",
      url: `https://jup.ag/swap/${inputMint}-${outputMint}`,
    };
  } catch (err: any) {
    console.error(err);
    return {
      status: "error",
      error: err,
    };
    // throw new Error("Error fetching data from JupiterSwap API");
  }
}

export const JupiterSwapSchema = z.object({
  outputMint: z.string().describe("The mint address of the output token."),
  inputMint: z
    .string()
    .optional()
    .describe("The mint address of the input token."),
});

export const JupiterSwapTool: BlinkToolType = {
  name: "JupiterSwap",
  description: "Generates a swap URL using the Jupiter DEX.",
  synonyms: [
    "swap tokens",
    "exchange tokens",
    "trade tokens",
    "convert tokens",
    "swap sol",
    "swap 1 SOl to USDC",
    "Buy 1M BONK",
  ],
  schema: JupiterSwapSchema,
  function: JupiterSwap,
  customToolPrompt: ` Extract token swap information from the user's query. Follow these rules:
    1. Identify the output token (the token to receive) as 'outputMint':
      - Look for phrases like "to [TOKEN]", "buy [TOKEN]", or the second token in a swap pair
      - Can be a token symbol (e.g., "USDC", "SOL") or a full token address
    2. Identify the input token (the token to spend) as 'inputMint':
      - Look for phrases like "swap [TOKEN] to", or the first token in a swap pair
      - Can be a token symbol or a full token address
      - If not explicitly mentioned, leave 'inputMint' empty
    3. Ignore amounts (e.g., "1", "100", "2") as they are not needed in the output
    4. If only one token is mentioned (e.g., "Buy [TOKEN]"), set it as 'outputMint' and leave 'inputMint' empty
    5. Token symbols are typically short (e.g., "SOL", "USDC", "WIF"), while addresses are long strings (e.g., "SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa")
    Return the result in the format: { outputMint: string, inputMint?: string }`,
  example: [
    {
      query: "Swap 1 SOL to USDC",
      output: {
        outputMint: "USDC",
        inputMint: "SOL",
      },
    },
    {
      query: "Swap USDC to BONK",
      output: {
        outputMint: "BONK",
        inputMint: "USDC",
      },
    },
    {
      query: "Buy 100 JUP",
      output: {
        outputMint: "JUP",
      },
    },
    {
      query:
        "Swap SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa to JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
      output: {
        outputMint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
        inputMint: "SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa",
      },
    },
    {
      query: "Buy 2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv",
      output: {
        outputMint: "2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv",
      },
    },
    {
      query: "Swap 2 SOl to WIF",
      output: {
        outputMint: "WIF",
        inputMint: "SOL",
      },
    },
  ],
};

import axios from "axios";
import { z } from "zod";
import { domains } from "../data";
import { BlinkToolType } from "../types";

export async function BuyDomain(args: { domain?: string }) {
  try {
    let { domain } = args;
    if (domain) {
      const parts = domain.split(".");
      domain = parts.length > 1 ? parts[1] : domain; // Return the second part or the original domain
    } else {
      domain = "sol"; // Handle the case where domain is undefined or null
    }
    if (domain === "sol" || !domain) {
      return {
        status: "success",
        url: "https://dial.to/?action=solana-action:https://action.sns.id/v1/register",
      };
    }

    /* 
    const res = await axios.get("https://alldomains.id/api/all-domains-data/7");
    const domains = res.data.map((d: any) => {
      return d.name.split(".")[1];
    });
    console.log(domains);
    */

    if (!domains.includes(domain)) {
      return {
        status: "error",
        error: "Domain not found",
      };
    }

    return {
      status: "success",
      url: `https://dial.to/?action=solana-action:https://alldomains.id/api/actions/${domain}`,
    };
  } catch (err: any) {
    throw new Error(err);
  }
}

export const BuyDomainSchema = z.object({
  domain: z
    .string()
    .min(1, { message: "Domain name must be at least 1 character long." })
    .optional()
    .describe("The domain name you want to buy."),
});

export const BuyDomainTool: BlinkToolType = {
  name: "BuyDomain",
  description: "Generates a Blink URL to buy a domain.",
  synonyms: [
    "buy domain",
    "register domain",
    "buy a .sol domain",
    "Solana Name service",
    "Buy a solana Domain",
  ],
  schema: BuyDomainSchema,
  function: BuyDomain,
  customToolPrompt:
    "If there is no domain mentiond in the query then return sol",
  example: [
    {
      query: "Buy a bonk domain",
      output: {
        domain: "bonk",
      },
    },
    {
      query: "Buy a .sol domain",
      output: {
        domain: "sol",
      },
    },
    {
      query: "Buy a solana domain",
      output: {
        domain: "solana",
      },
    },
    {
      query: "Register a domain",
      output: {
        domain: "sol",
      },
    },
    {
      query: "Buy a domain",
      output: {
        domain: "sol",
      },
    },
  ],
};

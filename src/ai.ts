import { JupiterSwap } from "./tools/jupiter_swap";
import { BuyDomain, BuyDomainSchema } from "./tools/domain";
import { donate } from "./tools/donation";
import { AIResponse } from "./types";
import axios from "axios";
import { stake } from "./tools/stake";

export async function ai(query: string) {
  try {
    const res = await axios.get(
      `http://localhost:5000/query?query=${encodeURIComponent(query)}`,
    );
    return res.data;
  } catch (error) {
    console.error("Axios error:", error);
    throw error;
  }
}

export async function answer_query(query: string) {
  const ai_res = (await ai(query)) as AIResponse;
  console.log(ai_res);
  if (ai_res.tool == "swap") {
    const args = {
      outputMint: ai_res.outputMint!,
      inputMint: ai_res.inputMint ? ai_res.inputMint : "SOL",
    };
    const url = await JupiterSwap(args);
    return url.url;
  }

  if (ai_res.tool == "domain") {
    const args = {
      domain: ai_res.domain!,
    };
    const url = await BuyDomain(args);
    return url.url;
  }

  if (ai_res.tool == "donation") {
    const url = await donate(ai_res.address!);
    return url;
  }

  if (ai_res.tool == "stake") {
    const url = await stake(ai_res.outputMint!);
    return url;
  }

  if (ai_res.tool == "lulu") {
    return "https://www.dial.to/?action=solana-action:https://blink.lulo.fi/actions";
  }

  if (ai_res.tool == "lock-bonk") {
    return "https://www.dial.to/?action=solana-action:https://bonkblinks.com/api/actions/lock";
  }
  if (ai_res.tool == "keystone") {
    return "https://www.dial.to/?action=solana-action:https://actions.keyst.one/api/actions";
  }
  if (ai_res.tool == "game") {
    if (ai_res.game_type == "flip") {
      return "https://www.dial.to/?action=solana-action:https://flip.sendarcade.fun/api/actions/flip";
    }
    if (ai_res.game_type == "rock") {
      return "https://www.dial.to/?action=solana-action:https://rps.sendarcade.fun/api/actions/rps";
    }
    if (ai_res.game_type == "snake") {
      return "https://www.dial.to/?action=solana-action:https://snakes.sendarcade.fun/api/actions/game";
    }
  }
  return "Couldn't find a appropriate blink for the query";
}

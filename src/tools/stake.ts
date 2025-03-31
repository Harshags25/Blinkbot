import { PublicKey } from "@solana/web3.js";

export async function stake(token: string): Promise<string> {
  if (token === "jitoSOL" || token.toLowerCase() === "jito" || token === "")
    return "https://dial.to/?action=solana-action:https://jito.dial.to/stake";

  if (token === "hSOL" || token.toLowerCase() === "helius")
    return "https://dial.to/?action=solana-action:https://dial.to/api/helius/stake";

  const res = await fetch(
    "https://lst-indexer-api.sanctum.so/lsts?page=0&sortBy=apy&order=desc&category=&search=&limit=5000",
  );
  const data = await res.json();

  // Check if token is a valid Solana public key (address)
  let isAddress = false;
  try {
    new PublicKey(token);
    isAddress = true;
  } catch (error) {
    // Not a valid address
  }

  for (const lst of data.lsts) {
    if (isAddress && token === lst.mint) {
      return (
        "https://dial.to/?action=solana-action:https://sanctum.dial.to/trade/SOL-" +
        lst.symbol
      );
    }

    if (!isAddress && token.toLowerCase().includes("sol")) {
      const tokenPrefix = token.toLowerCase().replace("sol", "").trim();
      if (tokenPrefix === lst.symbol.toLowerCase().replace("sol", "").trim()) {
        return `https://dial.to/?action=solana-action:https://sanctum.dial.to/trade/SOL-${lst.symbol}`;
      }
    }

    if (!isAddress && token.toLowerCase() === lst.symbol.toLowerCase()) {
      return `https://dial.to/?action=solana-action:https://sanctum.dial.to/trade/SOL-${lst.symbol}`;
    }
  }

  // Bug fix 4: Fixed the fallback URL to match the pattern of other URLs
  return "Could not find a staking pool for this token. This blink is to stake for JitoSOL https://dial.to/?action=solana-action:https://jito.dial.to/stake";
}

import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

export async function donate(address: String) {
  try {
    new PublicKey(address);
  } catch (err) {
    console.log("Invalid address");
  }
  const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const balance = await connection.getBalance(new PublicKey(address));
  if (balance > 0) {
    return `https://www.dial.to/?action=solana-action:https://action.solscan.io/api/donate?receiver=${address}`;
  }
  throw new Error("No balance in the address");
}

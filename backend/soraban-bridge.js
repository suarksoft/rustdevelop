import { exec } from "child_process";
import dotenv from "dotenv";
dotenv.config();

const CONTRACT_ID         = process.env.CONTRACT_ID;
const ADMIN_ALIAS         = process.env.ADMIN_ALIAS || "admin";
const SOROBAN_RPC_URL     = process.env.SOROBAN_RPC_URL;
const SOROBAN_NETWORK_PASSPHRASE = process.env.SOROBAN_NETWORK_PASSPHRASE;

export async function transferTokens(fromWallet, toWallet, amount) {
  return new Promise((resolve, reject) => {
    // Transfer admin üzerinden gerçekleşiyor!
    const cmd = [
      "stellar contract invoke",
      `--id ${CONTRACT_ID}`,
      `--source ${ADMIN_ALIAS}`,
      `--network-passphrase "${SOROBAN_NETWORK_PASSPHRASE}"`,
      `--rpc-url ${SOROBAN_RPC_URL}`,
      "-- transfer",
      `--from ${fromWallet}`,
      `--to ${toWallet}`,
      `--amount ${amount}`
    ].join(" ");
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
      } else if (/error|❌/.test(stdout)) {
        reject(new Error(stdout));
      } else {
        resolve(stdout.trim());
      }
    });
  });
}
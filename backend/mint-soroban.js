// mint-soroban.js
import { exec } from "child_process";
import dotenv from "dotenv";
dotenv.config();
const CONTRACT_ID         = process.env.CONTRACT_ID;
const ADMIN_ALIAS         = process.env.ADMIN_ALIAS || "admin";
const ADMIN_PUBLIC_KEY    = process.env.ADMIN_PUBLIC_KEY; 
const SOROBAN_RPC_URL     = process.env.SOROBAN_RPC_URL;
const SOROBAN_NETWORK_PASSPHRASE = process.env.SOROBAN_NETWORK_PASSPHRASE;

export async function mintTokenToUser(wallet, amount) {
  return new Promise((resolve, reject) => {


    const cmd = [
      "stellar contract invoke",
      `--id ${CONTRACT_ID}`,
      `--source-account ${ADMIN_ALIAS}`,
      `--network-passphrase "${SOROBAN_NETWORK_PASSPHRASE}"`,
      `--rpc-url ${SOROBAN_RPC_URL}`,
      "-- mint",
      `--to ${wallet}`,
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
export async function getBalanceOf(wallet) {
  return new Promise((resolve, reject) => {
    const ADMIN_ALIAS = process.env.ADMIN_ALIAS || "admin";
    const CONTRACT_ID = process.env.CONTRACT_ID;
    const SOROBAN_RPC_URL = process.env.SOROBAN_RPC_URL;
    const SOROBAN_NETWORK_PASSPHRASE = process.env.SOROBAN_NETWORK_PASSPHRASE;

    // Burada --source-account ekliyoruz (admin’in alias’ı ya da adresi)
    const cmd = [
      "stellar contract invoke",
      `--id ${CONTRACT_ID}`,
      `--source-account ${ADMIN_ALIAS}`,
      `--network-passphrase "${SOROBAN_NETWORK_PASSPHRASE}"`,
      `--rpc-url ${SOROBAN_RPC_URL}`,
      "-- balance",
      `--id ${wallet}`
    ].join(" ");

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
      } else if (/error|❌/.test(stdout)) {
        reject(new Error(stdout));
      } else {
        const num = Number(stdout.replace(/"/g, "").trim());
        resolve(num);
      }
    });
  });
}


export async function transferTokens(toWallet, amount) {
  return new Promise((resolve, reject) => {
    const ADMIN_ALIAS = process.env.ADMIN_ALIAS || "admin";
    const CONTRACT_ID = process.env.CONTRACT_ID;
    const SOROBAN_RPC_URL = process.env.SOROBAN_RPC_URL;
    const SOROBAN_NETWORK_PASSPHRASE = process.env.SOROBAN_NETWORK_PASSPHRASE;
    const ADMIN_PUBLIC_KEY = process.env.ADMIN_PUBLIC_KEY;

    // amount'u integer'a çevir!
    const intAmount = parseInt(amount, 10);

    const cmd = [
      "stellar contract invoke",
      `--id ${CONTRACT_ID}`,
      `--source-account ${ADMIN_ALIAS}`,
      `--network-passphrase "${SOROBAN_NETWORK_PASSPHRASE}"`,
      `--rpc-url ${SOROBAN_RPC_URL}`,
      "-- transfer",
      `--from ${ADMIN_PUBLIC_KEY}`,
      `--to ${toWallet}`,
      `--amount ${intAmount}`
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
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { mintTokenToUser, getBalanceOf, transferTokens } from "./mint-soroban.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());



// Token bakiyesi endpoint (cüzdan adresi parametreyle)
app.get("/api/balance/:wallet", async (req, res) => {
  const { wallet } = req.params;
  try {
    const balance = await getBalanceOf(wallet);
    res.json({ success: true, balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// Token mint endpoint
app.post("/api/mint-reward", async (req, res) => {
  const { wallet, amount } = req.body;
  try {
    const result = await mintTokenToUser(wallet, amount);
    res.json({ success: true, tx: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});




app.post("/api/transfer", async (req, res) => {
  const { fromWallet, toWallet, amount } = req.body;
  if (!fromWallet || !toWallet || !amount) {
    return res.status(400).json({ success: false, error: "Eksik parametre" });
  }
  try {
    const result = await transferTokens(fromWallet, toWallet, amount);
    res.json({ success: true, tx: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


app.listen(4000, () => console.log("Backend running on http://localhost:4000"));
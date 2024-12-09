// Creating a dummy bank server

// - Allows VaultPay to generate a token for a payment for a user for some amount.
// - If user made a successful payment, Bank should hit this webhookUrl for the company.

import express from "express";
import db from "@repo/db/client";
const app = express();

app.use(express.json());

interface paymentInformationProps {
  token: string;
  userId: string;
  amount: string;
}

app.post("/hdfcwebhook", async (req, res) => {
  //TODO: Add zod validation here?
  //TODO: HDFC bank should ideally send us a secret so we know this is sent by them
  // TODO: Check the status of this onRampTxn. Only allow the webhook to update if the status is "Processing" 
  const paymentInformation: paymentInformationProps = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };

  try {
    await db.$transaction([
      db.balance.updateMany({
        where: {
          userId: Number(paymentInformation.userId),
        },
        data: {
          amount: {
            // You can also get this from your DB
            increment: Number(paymentInformation.amount),
          },
        },
      }),
      db.onRampTransaction.updateMany({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);

    res.json({
      message: "Captured",
    });
  } catch (e) {
    console.error(e);
    res.status(411).json({
      message: "Error while processing webhook",
    });
  }
});

app.listen(3003);
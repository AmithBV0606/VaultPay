import express from "express";
import db from "@repo/db/client";

const app = express();

interface paymentInformationProps {
  token: string;
  userId: string;
  amount: string;
}

app.post("/hdfcWebhook", async (req, res) => {
  //TODO: Add zod validation here?
  const paymentInformation: paymentInformationProps = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };

  try {
    await db.$transaction([
      // Update balance in db :
      db.balance.update({
        where: {
          userId: Number(paymentInformation.userId),
        },
        data: {
          amount: {
            increment: Number(paymentInformation.amount),
          },
        },
      }),
      //   Update OnRampTransaction :
      db.onRampTransaction.update({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);

    res.status(200).json({
      message: "Captured",
    });
  } catch (error) {
    console.log("Error is : ", error);
    res.status(411).json({
      message: "Error while processing webhook",
    });
  }
});

app.listen(3003);
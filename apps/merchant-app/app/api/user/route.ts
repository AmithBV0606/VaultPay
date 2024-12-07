import { NextResponse } from "next/server"
import db from "@repo/db/client";

export const GET = async () => {
    await db.user.create({
        data: {
            email: "asd@gmail.com",
            name: "adsads",
            number: '1234554321',
            password: "abc123"
        }
    });

    return NextResponse.json({
        message: "hi there"
    });
}
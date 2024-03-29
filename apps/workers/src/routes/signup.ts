import { signups } from "@entrybase/db";
import { newId } from "@entrybase/id";
import { sql } from "drizzle-orm";
import { Context } from "hono";
import { db } from "../db";

export async function signupRoute(c: Context) {
	try {
		const waitlist = c.req.param("waitlist");
		const body = await c.req.json();
		const email = body.email;

		const signupID = newId("su");
		const record = await db.insert(signups).values({
			signupID,
			waitlistID: waitlist,
			email,
		});

		return c.json({ id: signupID, message: "Signup Successful" });
	} catch (e) {
		return c.json({ message: "Internal Server Error :(" }, { status: 500 });
	}
}

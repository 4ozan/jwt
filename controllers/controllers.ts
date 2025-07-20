import express from "express"
import { drizzle } from 'drizzle-orm/bun-sql';
import { usersTable } from "../src/db/Schema"
import { eq } from "drizzle-orm"
import db from "../src/index"

export const signup = ( req:express.Request, res:express.Response) => {
    const { name, email,password } = req.body;
    const user = db.insert(usersTable).values({name, email, password});
    res.send("user successfully created")
}

export const Login = (req:express.Request, res:express.Response) => {
    const { email, password } = req.body;
    const user = db.select().from(usersTable).where(eq(usersTable.email, email))
}
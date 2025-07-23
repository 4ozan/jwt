import express from "express";
import { usersTable } from "../src/db/Schema";
import { eq } from "drizzle-orm";
import db from "../src/index";
import bcrypt from "bcrypt";
import { generateToken } from "../auth/auth";

export const signup = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
  
    await db.insert(usersTable).values({
      name,
      email,
      password: hashedPassword,
    });
    
    res.status(201).json({ message: "User successfully created" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const Login = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const users = await db.select().from(usersTable).where(eq(usersTable.email, email));
    
    if (users.length === 0) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    
    const user = users[0];
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    
    // Generate JWT token using your auth module
    const token = generateToken(user.id, user.email);
    
    if (!token) {
      res.status(500).json({ error: "Failed to generate token" });
      return;
    }
    
    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

export const profile = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    // Use the authenticated user from middleware
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }
    
    const users = await db.select().from(usersTable).where(eq(usersTable.id, req.user.userId));
    
    if (users.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    const user = users[0];
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get profile" });
  }
};
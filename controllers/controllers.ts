import express from "express";
import { usersTable, refreshTokensTable } from "../src/db/Schema";
import { eq } from "drizzle-orm";
import db from "../src/index";
import bcrypt from "bcrypt";
import { generateToken, generateRefreshToken, verifyToken } from "../auth/auth";

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
    

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    
    // Generate JWT token using your auth module
    // Generate access and refresh tokens
    const accessToken = generateToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id, user.email);

    if (!accessToken || !refreshToken) {
      res.status(500).json({ error: "Failed to generate tokens" });
      return;
    }

    // Store the refresh token in the database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Set expiration for 7 days

    await db.insert(refreshTokensTable).values({
      userId: user.id,
      token: refreshToken,
      expiresAt: expiresAt,
    });
    

    
    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
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

export const refreshToken = async (req: express.Request, res: express.Response): Promise<void> => {
  const { token } = req.body;

  if (!token) {
    res.status(401).json({ error: "Refresh token required" });
    return;
  }

  try {
    // Check if the token exists in the database
    const storedTokens = await db.select().from(refreshTokensTable).where(eq(refreshTokensTable.token, token));

    if (storedTokens.length === 0) {
      res.status(403).json({ error: "Invalid refresh token" });
      return;
    }

    const storedToken = storedTokens[0];

    // Verify the token's signature and expiration
    const decoded = verifyToken(storedToken.token);

    if (!decoded) {
      res.status(403).json({ error: "Invalid or expired refresh token" });
      return;
    }

    // Generate a new access token
    const newAccessToken = generateToken(decoded.userId, decoded.email);

    if (!newAccessToken) {
      res.status(500).json({ error: "Failed to generate new access token" });
      return;
    }

    res.json({ accessToken: newAccessToken });

  } catch (error) {
    res.status(500).json({ error: "Failed to refresh token" });
  }
};

export const logout = async (req: express.Request, res: express.Response): Promise<void> => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ error: "Refresh token required" });
    return;
  }

  try {
    // Delete the refresh token from the database and check if a row was affected
    const deletedTokens = await db.delete(refreshTokensTable).where(eq(refreshTokensTable.token, token)).returning({ id: refreshTokensTable.id });

    if (deletedTokens.length === 0) {
      // This could mean the token was already invalid or the user was already logged out
      res.status(404).json({ error: "Invalid refresh token" });
      return;
    }

    res.status(200).json({ message: "Logout successful" });

  } catch (error) {
    res.status(500).json({ error: "Failed to logout" });
  }
};
import type { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";

import { User } from "../models/User.js";

export const loginWithGoogle = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      res.status(500).json({
        error: "GOOGLE_CLIENT_ID is not configured",
      });

      return;
    }

    const credential =
      typeof req.body.credential === "string" ? req.body.credential : "";

    if (!credential) {
      res.status(400).json({
        error: "Google credential is required",
      });

      return;
    }

    const googleClient = new OAuth2Client(googleClientId);

    let payload;

    try {
      /*
       * Verify that the ID token was issued by Google,
       * has not expired and belongs to this application.
       */
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: googleClientId,
      });

      // Extract verified Google account information.
      payload = ticket.getPayload();
    } catch {
      res.status(401).json({
        error: "Invalid Google credential",
      });

      return;
    }

    if (
      !payload?.sub ||
      !payload.email ||
      !payload.name ||
      !payload.email_verified
    ) {
      res.status(401).json({
        error: "Invalid Google account",
      });

      return;
    }

    const user = await User.findOneAndUpdate(
      {
        google_id: payload.sub,
      },
      // Works every time when user login, update (email, name, picture)
      {
        $set: {
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
        },
        // Works every time when document created
        $setOnInsert: {
          google_id: payload.sub,
        },
      },
      // Update + insert
      // Return document after updating or creating
      {
        upsert: true,
        new: true,
      },
      // Return javascript object only
    ).lean();

    res.status(200).json({
      user,
    });
  } catch (error: unknown) {
    console.error(
      "[Google Auth Controller]:",
      error instanceof Error ? error.message : error,
    );

    res.status(500).json({
      error: "Failed to authenticate user",
    });
  }
};

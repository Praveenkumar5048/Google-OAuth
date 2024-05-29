import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import { User } from "../models/postBlog.js";

import dotenv from "dotenv";
dotenv.config();

passport.use("google",
  new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    async (accessToken, refreshToken, profile, done) => {

      try {
        const existingUser = await User.findOne({ email: profile.emails[0].value });

      if (existingUser) {
        // User found, proceed with login
        return done(null, existingUser, { message: "Logged in successfully" });
      }

      // No user exists, create a new user
      const newUser = await User.create({
        username: profile.displayName || 'NewUser',
        email: profile.emails[0].value,
        profileImage : profile.photos[0].value,
        password: "google" // Consider how you handle passwords or if needed at all for OAuth users
      });

      return done(null, newUser, { message: "User created successfully" });
      } catch (error) {
        // Error handling
        return done(error);
      }
    }
  )
);

passport.use("local",
new Strategy({ usernameField: "email" }, async (email, password, done) => {
    try {
          // Find user by email
          const user = await User.findOne({ email });
          
          // Check if user exists
          if (!user) {
            return done(null, false, { message: "No user with this email" });
          }

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) {

            return done(null, user, { message: "Logged in successfully" });
          } else {
            // Passwords don't match, authentication failed
            return done(null, false, { message: "Wrong username or password" });
          }
    } catch (error) {
          // Error handling
          return done(error);
    }
  })
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize user ID
});
    
passport.deserializeUser(async (id, done) => {
  try {
      const user = await User.findById(id);
      done(null, user); 
  } catch (err) {
      console.error("Error during deserialization:", err);
      done(err, null);
  }
});

export default passport;
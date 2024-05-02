import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import bcrypt from "bcrypt";
import routes from "./routes/post.js";
import { User } from "./models/postBlog.js";
import { Strategy } from "passport-local";
import dotenv from "dotenv";
dotenv.config();
import GoogleStrategy from "passport-google-oauth2";

const app = express();
app.use(express.json());

app.use(cors({origin : "http://localhost:3000", credentials : true}));
app.use("/", routes);

app.use(bodyParser.json({limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true }));
const port = 5000;
const uri = "mongodb://127.0.0.1:27017/blogger";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to the database");
    })
    .catch((error) => {
        console.log(`${error} did not connect`);
    });

app.use(
    session({
      secret: "TOPSECRETWORD",
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
      name: 'session_id'
    })
);

app.use(passport.initialize()); 
app.use(passport.session());

app.get("/checkLoggedIn", (req, res) => {

    if (req.isAuthenticated()) {
      res.json({ isAuthenticated: true, user: req.user });
    } else {
      res.json({ isAuthenticated: false });
    }
});

app.get("/logout", (req, res) => {
  req.logout(function (err) {
      if (err) {
          return res.status(500).json({ message: "Internal server error" });
      }
      req.session.destroy(function (err) {
          if (err) {
              return res.status(500).json({ message: "Failed to destroy the session" });
          }
          res.clearCookie('session_id', { path: '/' }); // make sure the name 'connect.sid' matches your session cookie name
          return res.status(200).json({ message: "Logged Out successfully" });
      });
  });
});

app.get("/google/login", 
  passport.authenticate("google", 
  {
    scope: ["profile", "email"],
  }
));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {

    res.redirect('http://localhost:3000');
  }
);

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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// import connect from "./config/passport.js";
// connect(passport);

// app.post("/register", async (req, res) => {
//   try {
//       const { username, email, password } = req.body;
      
//       // Check if the user already exists
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({ message: "User already exists" });
//       }
  
//       // Hash the password
//       const hashedPassword = await bcrypt.hash(password, 10);
  
//       // Create the new user
//       const newUser = new User({
//         username,  
//         email,
//         password: hashedPassword,
//       });
  
//       // Save the user to the database
//       await newUser.save();
  
//       // Log in the user after registration
//       req.login(newUser, (err) => {
//           if (err) {
//               console.error("Error during login:", err);
//               return res.status(500).json({ message: "Internal server error" });
//           }
//           console.log("User registered and logged in successfully");
//           return res.status(201).json({ message: "User registered and logged in successfully" });
//       });
//   } catch (error) {
//       console.error("Error registering user:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// });

// app.post("/login", (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) {
//       return res.status(500).json({ message: "Internal server error" });
//     }
//     if (!user) {
//       return res.status(401).json({ message: "Authentication failed" });
//     }
//     req.login(user, (err) => {
//       if (err) {
//         console.error("Error during login:", err);
//         return res.status(500).json({ message: "Internal server error" });
//       }
//       return res.status(200).json({ message: "Authentication successful" });
//     });
//   })(req, res, next);
// });

// passport.use("local",
// new Strategy({ usernameField: "email" }, async (email, password, done) => {
// try {
//       // Find user by email
//       const user = await User.findOne({ email });
      
//       // Check if user exists
//       if (!user) {
//         return done(null, false, { message: "No user with this email" });
//       }

//       const passwordMatch = await bcrypt.compare(password, user.password);
//       if (passwordMatch) {

//         return done(null, user, { message: "Logged in successfully" });
//       } else {
//         // Passwords don't match, authentication failed
//         return done(null, false, { message: "Wrong username or password" });
//       }
// } catch (error) {
//       // Error handling
//       return done(error);
// }
// })
// );
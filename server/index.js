import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import session from "express-session";
import routes from "./routes/post.js";
import passport from "./config/passport.js";

import dotenv from "dotenv";
dotenv.config();

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


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


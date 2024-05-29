import { User }  from "../models/postBlog.js"; 
import passport from '../config/passport.js';

export const registerUser  = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }
    
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create the new user
        const newUser = new User({
          username,  
          email,
          password: hashedPassword,
        });
    
        // Save the user to the database
        await newUser.save();
    
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const loginUser = async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {

      if (err) {
        console.log(err);
        return res.status(501).json({message: "Internal server error" });
      }
      if (!user) {
        return res.status(401).json({message: "Authentication failed" });
      }
      req.login(user, (err) => {
        if (err) {
          console.error("Error during login:", err);
          return res.status(500).json({message: "Internal server error" });
        }
        return res.status(200).json({message: "Authentication successful" });
      });
    })(req, res, next);
};


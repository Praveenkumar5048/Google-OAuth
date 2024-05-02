import bcrypt from "bcrypt";
import { User } from "../models/postBlog.js";
import { Strategy } from "passport-local";

function connect(passport){
    passport.use(
        new Strategy({ usernameField: "email" }, async (email, password, done) => {
        try {
              // Find user by email
              const user = await User.findOne({ email });
              
              // Check if user exists
              if (!user) {
                return done(null, false, { message: "No user with this email" });
              }
              console.log(user);
              // Compare passwords
              const passwordMatch = await bcrypt.compare(password, user.password);
              if (passwordMatch) {
                console.log("password match");
                // Passwords match, authentication successful
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
        
        // Deserialize user
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user); // Deserialize user from ID
        } catch (err) {
            done(err, null);
        }
    });
    
}

export default connect;
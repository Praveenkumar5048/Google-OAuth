import express from "express"

import { postblog, getblogs} from "../controllers/post.js";
import { registerUser, loginUser} from "../controllers/userLogin.js";
const router = express.Router();

router.get('/veiw', getblogs );
router.post("/blogs", postblog);
// router.post("/register", registerUser);
// router.post("/login", loginUser);

export default router;

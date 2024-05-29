import express from "express"

import { postblog, getblogs, deleteBlog} from "../controllers/post.js";
import { registerUser, loginUser} from "../controllers/userLogin.js";
const router = express.Router();

router.get('/veiw', getblogs );
router.post("/blogs", postblog);
router.delete("/delete/blogs/:postId", deleteBlog);
router.post("/user/register", registerUser);
router.post("/user/login", loginUser);

export default router;

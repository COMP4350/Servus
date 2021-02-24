import { Router } from 'express';
import { login } from '../utils/authUtils.js';
import cors from 'cors';
const router = Router();

/* login to an account */
router.post('/login', (req, res) => {
    const username = req.params.username;
    const password = req.params.password;
    return login(username, password, res);
});

export default router;

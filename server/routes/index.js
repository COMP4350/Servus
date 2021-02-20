import { Router } from 'express';
const router = Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.json({ title: 'Express' });
});

export default router;

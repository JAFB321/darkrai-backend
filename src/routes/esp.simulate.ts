import { Router } from 'express'

const router = Router();

router.get('/action', async (req, res) => {

   res.status(200).send({})
})


export default router
import { Router } from 'express'
import DB from '../data-source'
import { User } from '../entity/User';

const router = Router(); 
const userRepository = DB.getRepository(User)

router.get('/user/:id', async (req, res) => {
    const userId = req.params.id
    const user = await userRepository.findOneBy({id: +userId})

    return res.send({
        data: user
    })
})

router.post('/user/auth', async (req, res) => {
    const {username, password} = req.body
    console.log(req.body);
    
    if(!username || !password) return res.status(400).send()

    const user = await userRepository.findOne({
        where: {username, password},
        relations: {
            enfermero: true
        }
    })

    if(!user) return res.status(401).send()

    return res.send({
        data: user
    })
})


export default router
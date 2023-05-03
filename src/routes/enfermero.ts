import { Router } from 'express'
import DB from '../data-source'
import { Enfermero } from '../entity';

const router = Router(); 
const enfermeroRepository = DB.getRepository(Enfermero)

router.get('/enfermero/:id', async (req, res) => {
    const { id } = req.params

    const enfermero = await enfermeroRepository.findOne({
        where: { id: +id },
        relations: {
            user: true
        }
    })
    if(!enfermero) return res.status(404).send()

    const response = {
        ...enfermero,
        user: {
            ...enfermero.user,
            password: undefined
        }
    }

    return res.send(
        response
    )
})

router.get('/enfermero', async (req, res) => {
    const enfermeros = await enfermeroRepository.find()

    return res.send(
        enfermeros
    )
})

router.post('/enfermero', async (req, res) => {
    const { body } = req
    console.log(body);

    const data: Partial<Enfermero> = {
        nombre: body.nombre,
        user: {
            nombre: body.nombre,
            username: body.username,
            password: body.password,
            rol: 'enfermero',
        }
    }
    
    const enfermero = await enfermeroRepository.save(data)

    return res.send(
        enfermero
    )
})

router.delete('/enfermero/:id', async (req, res) => {
    const { id } = req.params
    
    const { affected } = await enfermeroRepository.delete({id: +id})

    if(affected > 0 ) return res.status(200).send()
    else return res.status(404).send()
})

router.patch('/enfermero/:id', async (req, res) => {
    const { id } = req.params
    const { body } = req
    
    const { affected } = await enfermeroRepository.update({id: +id}, body)

    if(affected > 0) {
        const enfermero = await enfermeroRepository.findOneBy({id: +id})
        return res.status(200).send(enfermero)
    }
    else return res.status(404).send()
})

export default router
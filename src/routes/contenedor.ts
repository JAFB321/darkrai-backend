import { Router } from 'express'
import DB from '../data-source'
import { Contenedor } from '../entity';

const router = Router(); 
const contenedorRepository = DB.getRepository(Contenedor)

router.get('/contenedor/:id', async (req, res) => {
    const { id } = req.params

    const paciente = await contenedorRepository.findOne({
        where:{id: +id},   
        relations: {
            medicamento: true
        }
    })
    if(!paciente) return res.status(404).send()

    return res.send(
       paciente 
    )
})

router.get('/contenedor', async (req, res) => {
    const contenedores = await contenedorRepository.find({relations: { 
        medicamento: true
     }})

    return res.send(
        contenedores
    )
})

router.patch('/contenedor/:id', async (req, res) => {
    const { id } = req.params
    const { body } = req
    
    const { affected } = await contenedorRepository.update({id: +id}, body)

    if(affected > 0) {
        const contenedor = await contenedorRepository.findOneBy({id: +id})
        return res.status(200).send(contenedor)
    }
    else return res.status(404).send()
})

export default router
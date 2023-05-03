import { Router } from 'express';
import DB from '../data-source'
import { Tratamiento } from '../entity';

const router = Router(); 
const tratamientoRepository = DB.getRepository(Tratamiento)

router.get('/tratamiento/:id', async (req, res) => {
    const { id } = req.params
    const { includePaciente } = req.query

    const tratamiento = await tratamientoRepository.findOne({
        where: {id: +id},
         relations: { 
            planesMedicacion: true,
            paciente: includePaciente === 'true'
         }})
    if(!tratamiento) return res.status(404).send()

    return res.send(
         tratamiento
    )
})

router.get('/tratamiento', async (req, res) => {
    const { pacienteId } = req.query

    const tratamientos = await tratamientoRepository.find({relations: {paciente: true}, where: {pacienteId: +pacienteId || undefined}})

    return res.send(
         tratamientos
    )
})

router.post('/tratamiento', async (req, res) => {
    const { body } = req
    console.log(body);
    
    const tratamiento = await tratamientoRepository.save(body)

    return res.send(
         tratamiento
    )
})

router.delete('/tratamiento/:id', async (req, res) => {
    const { id } = req.params
    
    const { affected } = await tratamientoRepository.delete({id: +id})

    if(affected > 0 ) return res.status(200).send()
    else return res.status(404).send()
})

router.patch('/tratamiento/:id', async (req, res) => {
    const { id } = req.params
    const { body } = req
    
    const { affected } = await tratamientoRepository.update({id: +id}, body)

    if(affected > 0) {
        const tratamiento = await tratamientoRepository.findOneBy({id: +id})
        return res.status(200).send( tratamiento)
    }
    else return res.status(404).send()
})

export default router
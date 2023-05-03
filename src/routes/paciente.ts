import { Router } from 'express'
import DB from '../data-source'
import { Paciente, Tratamiento } from '../entity';

const router = Router(); 
const pacienteRepository = DB.getRepository(Paciente)
const tratamientoRepository = DB.getRepository(Tratamiento)

router.get('/paciente/:id', async (req, res) => {
    const { id } = req.params
    const { includeTratamiento = true } = req.query
 
    const relations = includeTratamiento && { tratamientos: true }

    const paciente = await pacienteRepository.findOne({where:{id: +id}, relations })
    if(!paciente) return res.status(404).send()

    return res.send(
       paciente 
    )
})

router.get('/paciente/:pacienteId/tratamiento', async (req, res) => {
    const { pacienteId } = req.params

    const paciente = await pacienteRepository.findOne({where:{id: +pacienteId} })
    const tratamientos = await tratamientoRepository.find({where: {pacienteId: +pacienteId}})

    return res.send(
         { paciente, tratamientos }
    )
})

router.get('/paciente', async (req, res) => {
    console.log('Get pacientes');
    
    const pacientes = await pacienteRepository.find({relations: { tratamientos: true }})

    return res.send(
       pacientes
    )
})

router.post('/paciente', async (req, res) => {
    const { body } = req
    console.log(body);
    
    const paciente = await pacienteRepository.save(body)

    return res.send(
       paciente
    )
})

router.delete('/paciente/:id', async (req, res) => {
    const { id } = req.params
    
    const { affected } = await pacienteRepository.delete({id: +id})

    if(affected > 0 ) return res.status(200).send()
    else return res.status(404).send()
})

router.patch('/paciente/:id', async (req, res) => {
    const { id } = req.params
    const { body } = req
    
    const { affected } = await pacienteRepository.update({id: +id}, body)

    if(affected > 0) {
        const paciente = await pacienteRepository.findOneBy({id: +id})
        return res.status(200).send(paciente)
    }
    else return res.status(404).send()
})

export default router
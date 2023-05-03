import { Router } from 'express'
import fetch from 'node-fetch'
import DB from '../data-source'
import { Contenedor, Dosis, Enfermero } from '../entity';
import { Not } from 'typeorm';

const router = Router();
const contenedorRepository = DB.getRepository(Contenedor)
const dosisRepository = DB.getRepository(Dosis)
const enfermeroRepository = DB.getRepository(Enfermero)

router.post('/esp/action', async (req, res) => {
    const espIP = req.app.settings.esp_url
    const body = req.body

    const payload = { 
        action: body.action,
        motor: Number(body.motor),
        cantidad: Number(body.cantidad),
        PASOS: Number(body.PASOS)
    }

    if(!["MOVER_ADELANTE", "MOVER_ATRAS"].includes(payload.action)) {
        return res.status(400).send({message: 'Accion invalida'})
    }
    if(payload.cantidad <= 0 || payload.motor < 1 || payload.motor > 3){
        return res.status(400).send({message: 'Motor o cantidad invalida'})
    }

    const response = await fetch(`${espIP}/action?payload=${JSON.stringify(payload)}`)
    res.send({response: await response.json()})
})

const movimientos = [
    750,
    850,
    900,
    900,
    650,
    550,
    550,
    650,
    600,
    600,
]


const getEspActionPayload = () => {

}

router.post('/esp/contenedor/:id/move', async (req, res) => {
    const espIP = req.app.settings.esp_url
    const { id } = req.params
    const { direction = 'x', all = false } = req.body
    console.log(id);
    
    if(direction !== 'up' && direction !== 'down') return res.status(400).send({message: "Direccion invalida"})

    const contenedor = await contenedorRepository.findOne({
        where: {id: +id},
        relations: {
            medicamento: true
        }
    })
    if(!contenedor) return res.status(404).send({message: "Contenedor no encontrado"})

    const { motor, pasoActual, pasosTotal } = contenedor

    if(direction === 'up' && pasoActual >= pasosTotal) return res.status(400).send({message: "No puedes subir mas"})
    if(direction === 'down' && pasoActual < 1) return res.status(400).send({message: "No puedes bajar mas"})

    let pasos = 0
    let start = -1
    let end = 99

    if(all){
        if(direction === 'up') {
            start = pasoActual
            end = movimientos.length
        }
        if(direction === 'down') {
            start = 0
            end = pasoActual
        }
    }
    else {
        if(direction === 'up') {
            start = pasoActual
            end = pasoActual + 1
        }
        if(direction === 'down') {
            start = pasoActual - 1
            end = pasoActual
        }
    }
    
    const slicedMovimientos = movimientos.slice(start, end)
    pasos = slicedMovimientos.reduce((prev, curr) => prev + curr, 0)

    console.log('start', start);
    console.log('end', end);
    console.log('slicedMovimientos', slicedMovimientos);
    console.log('pasos', pasos);
    
    if(
        start<0 || end>movimientos.length
        || slicedMovimientos.length === 0
        || pasos === 0
    ) return res.status(400).send({message: 'El movimiento se sale del rango'})

    const directionEnum = {
        up: 'MOVER_ADELANTE',
        down: 'MOVER_ATRAS'
    }

    const payload = { 
        action: directionEnum[direction],
        motor,
        cantidad: 1,
        PASOS: pasos
    }

    console.log(payload);  
    const response = await fetch(`${espIP}/action?payload=${JSON.stringify(payload)}`)
    if(!response?.ok) return res.status(500).send({message: 'Error al enviar la accion al esp'}) 

    await contenedorRepository.update({id: +id}, {
        pasoActual: direction === 'up' ? end : start,
    })

    res.send(payload)
})

router.post('/esp/dosis/:id/dispensar', async (req, res) => {
    const espIP = req.app.settings.esp_url
    const { id } = req.params
    const { enfermeroId, isAdmin } = req.body
    
    if(!enfermeroId && !isAdmin) return res.status(400).send()
    const enfermero = await enfermeroRepository.findOne({
        where: {id: +enfermeroId}
    })
    if(!enfermero && !isAdmin) return res.status(404).send({message: 'Enfermero no encontrado'})

    const dosis = await dosisRepository.findOne({
        where: {
            id: +id,
        },
        relations: {
            planMedicacion: {
                medicamento: {
                    contenedor: true
                }
            }
        }
    })
    const planMedicacion = dosis?.planMedicacion
    const medicamento = planMedicacion?.medicamento
    const contenedor = medicamento?.contenedor

    if(!planMedicacion || !medicamento || !contenedor) return res.status(404).send({message: 'La medicina no esta en ningun contenedor'})
    if(!planMedicacion.activo) return res.status(400).send({message: 'El plan de medicacion no esta activo'})

    const { motor, pasoActual, pasosTotal } = contenedor
    if((pasoActual + dosis.cantidad) > pasosTotal) return res.status(400).send({ message: "No hay suficientes pastillas" })

    let pasos = 0
    let start = pasoActual
    let end = pasoActual + dosis.cantidad

    const slicedMovimientos = movimientos.slice(start, end)
    pasos = slicedMovimientos.reduce((prev, curr) => prev + curr, 0)

    if(
        start<0 || end>movimientos.length
        || slicedMovimientos.length === 0
        || pasos === 0
    ) return res.status(400).send({message: 'El movimiento se sale del rango'})

    const payload = { 
        action: 'MOVER_ADELANTE',
        motor,
        cantidad: 1,
        PASOS: pasos
    }

    console.log(payload);  
    const response = await fetch(`${espIP}/action?payload=${JSON.stringify(payload)}`)
    if(!response?.ok) return res.status(500).send({message: 'Error al enviar la accion al esp'}) 

    await contenedorRepository.update({id: contenedor.id}, {
        pasoActual: end,
    })

    await dosisRepository.update({id: +id}, {
        suministrado: true,
        fechaSuministracion: new Date(),
        cantidadSuministrada: dosis.cantidad,
        enfermeroSuministracionId: enfermero?.id || null
    })

    res.send(payload)
})


export default router

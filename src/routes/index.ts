import { Router } from 'express'
import userRoutes from './user'
import pacienteRoutes from './paciente'
import medicamentoRoutes from './medicamento'
import tratamientoRoutes from './tratamiento'
import enfermeroRoutes from './enfermero'
import planMedicacionRoutes from './planMedicacion'
import espRoutes from './esp'
import espSimulateRoutes from './esp.simulate'
import suministrarRoutes from './suministrar'
import contenedorRoutes from './contenedor'

const router =  Router()
router.use(userRoutes)
router.use(medicamentoRoutes)
router.use(pacienteRoutes)
router.use(tratamientoRoutes)
router.use(enfermeroRoutes)
router.use(planMedicacionRoutes)
router.use(espRoutes)
router.use('/simulate', espSimulateRoutes)
router.use(suministrarRoutes)
router.use(contenedorRoutes)

export default router
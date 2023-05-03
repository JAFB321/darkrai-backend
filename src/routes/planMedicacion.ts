import dayjs from 'dayjs'
import { Router } from "express";
import DB from "../data-source";
import {Dosis, PlanMedicacion } from "../entity";

const router = Router();
const planMedicacionRepository = DB.getRepository(PlanMedicacion);

router.get("/plan-medicacion/:id", async (req, res) => {
  const { id } = req.params;
  const { includeDosis } = req.query;
  

  const planMedicacion: PlanMedicacion & {progresoDosis?: number} = await planMedicacionRepository.findOne({ 
    where: { id: +id },
    relations: {
      dosis: includeDosis === 'true' ? {
        enfermeroSuministracion: true
      } : false
    }
   });

   const dosis = planMedicacion?.dosis
   if(dosis?.length){
    const totalSuministrado = dosis.filter(({suministrado}) => suministrado).length
    planMedicacion.progresoDosis = (totalSuministrado / dosis.length) * 100
   }

  if (!planMedicacion) return res.status(404).send();

  return res.send(planMedicacion);
});

router.get("/plan-medicacion", async (req, res) => {
  const { tratamientoId } = req.query

  // if(!tratamientoId) return res.send([]);

  const planMedicacions = await planMedicacionRepository.find({
    where: {tratamientoId: tratamientoId && +tratamientoId},
    relations: {
      medicamento: true,
      dosis: true
    }
  });

  const response = planMedicacions.map((planMedicacion) => {
    const dosis = planMedicacion?.dosis
    let progresoDosis = 0

    if(dosis?.length){
      const totalSuministrado = dosis.filter(({suministrado}) => suministrado).length
      progresoDosis = (totalSuministrado / dosis.length) * 100
    }
    return {
      ...planMedicacion,
      progresoDosis
    }
  })

  return res.send(response);
});

router.post("/plan-medicacion", async (req, res) => {
  const { body } = req;

  const data: Partial<PlanMedicacion> = {
    tratamientoId: Number(body.tratamientoId),
    medicamentoId: Number(body.medicamentoId),
    cantidadDosis: Number(body.cantidadDosis),
    intervaloHoras: Number(body.intervaloHoras),
    fechaInicio: body.fechaInicio,
    fechaFin: body.fechaFin,
    activo: true
  }

  const start = dayjs(body.fechaInicio)
  const end = dayjs(body.fechaFin)
  if(!start.isBefore(end)) res.status(400).send({ message: 'Fecha de inicio debe ser mayor a fecha final'})

  let currentDosisDate = start.clone()
  const dosisList: Dosis[] = []

  while(currentDosisDate.isBefore(end)){
    const dosis: Dosis = {
       cantidad: body.cantidadDosis,
       fecha: currentDosisDate.toDate(),
       suministrado: false
    }

    dosisList.push(dosis)
    currentDosisDate = dayjs(currentDosisDate).add(data.intervaloHoras, 'hours')
  }

  if(dosisList.length === 0) res.status(400).send({ message: 'No se pudieron crear las dosis'})
  data.dosis = dosisList
  data.cantidadTotal = dosisList.length * data.cantidadDosis
  
  const planMedicacion = await planMedicacionRepository.save(data);

  return res.send(planMedicacion);
});

router.post("/plan-medicacion/:id/end", async (req, res) => {
  const { id } = req.params;
  console.log(id);

  const { affected } = await planMedicacionRepository.update({id: +id}, {
    activo: false
  });

  if (affected > 0) return res.status(200).send();
  else return res.status(404).send();
});

router.delete("/plan-medicacion/:id", async (req, res) => {
  const { id } = req.params;

  const { affected } = await planMedicacionRepository.delete({ id: +id });

  if (affected > 0) return res.status(200).send();
  else return res.status(404).send();
});

router.patch("/plan-medicacion/:id", async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const { affected } = await planMedicacionRepository.update({ id: +id }, body);

  if (affected > 0) {
    const planMedicacion = await planMedicacionRepository.findOneBy({ id: +id });
    return res.status(200).send(planMedicacion);
  } else return res.status(404).send();
});

export default router;

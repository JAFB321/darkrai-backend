
import { Router } from "express";
import dayjs from 'dayjs'
import DB from "../data-source";
import { Dosis, Medicamento } from "../entity";
import { Between } from "typeorm";

const router = Router();
const medicamentoRepository = DB.getRepository(Medicamento);
const dosisRepository = DB.getRepository(Dosis);

router.get("/suministrar/all", async (req, res) => {
    const now = dayjs()

    const dosis = await dosisRepository.find({
        where: {
            suministrado: false,
            fecha: Between(now.subtract(2, 'hours').toDate(), now.add(12, 'hours').toDate()),
            planMedicacion: {
                activo: true
            }
        },
        order: {
            fecha:{
                direction: 'ASC'
            }
        },
        relations: {
            planMedicacion: {
                medicamento: true,
                 tratamiento: {
                    paciente: true
                }
            }
        }
    })

    res.send(dosis)
});

export default router
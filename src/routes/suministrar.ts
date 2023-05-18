
import { Router } from "express";
import DB from "../data-source";
import { Dosis, Medicamento } from "../entity";
import { Between } from "typeorm";
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const router = Router();
const dosisRepository = DB.getRepository(Dosis);

router.get("/suministrar/all", async (req, res) => {
    const now = dayjs().utc()

    const dosis = await dosisRepository.find({
        where: {
            suministrado: false,
            fecha: Between(now.subtract(2, 'hours').toDate(), now.add(1, 'hours').toDate()),
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
import { Router } from "express";
import dayjs from 'dayjs'
import { Dosis } from "../entity";
import { Between } from "typeorm";
import DB from "../data-source";
import { getAlertas, registrarAlertas } from "./alertas.service";

const router = Router();
const dosisRepository = DB.getRepository(Dosis);

router.get("/alerta", async (req, res) => {
    const alertas = await getAlertas()
    res.send(alertas)
});

router.post("/alerta/registrar/:dosisId", async (req, res) => {
    const { dosisId } = req.params
    const { affected } = await registrarAlertas(dosisId)

    if(affected > 0) return res.status(200).send()
    else return res.status(404).send()

})

export default router
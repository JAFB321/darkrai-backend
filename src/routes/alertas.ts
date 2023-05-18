import { Router } from "express";
import { getAlertas, registrarAlertas } from "./alertas.service";

const router = Router();

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

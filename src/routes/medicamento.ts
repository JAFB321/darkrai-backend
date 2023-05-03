import { Router } from "express";
import DB from "../data-source";
import { Medicamento } from "../entity";

const router = Router();
const medicamentoRepository = DB.getRepository(Medicamento);

router.get("/medicamento/:id", async (req, res) => {
  const { id } = req.params;

  const medicamento = await medicamentoRepository.findOneBy({ id: +id });
  if (!medicamento) return res.status(404).send();

  return res.send(medicamento);
});

router.get("/medicamento", async (req, res) => {
  console.log(req.params);
  console.log(req.query);
  
  
  const medicamentos = await medicamentoRepository.find();

  return res.send(medicamentos);
});

router.post("/medicamento", async (req, res) => {
  const { body } = req;
  console.log(body);

  const medicamento = await medicamentoRepository.save(body);

  return res.send(medicamento);
});

router.delete("/medicamento/:id", async (req, res) => {
  const { id } = req.params;

  const { affected } = await medicamentoRepository.delete({ id: +id });

  if (affected > 0) return res.status(200).send();
  else return res.status(404).send();
});

router.patch("/medicamento/:id", async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const { affected } = await medicamentoRepository.update({ id: +id }, body);

  if (affected > 0) {
    const medicamento = await medicamentoRepository.findOneBy({ id: +id });
    return res.status(200).send(medicamento);
  } else return res.status(404).send();
});

export default router;

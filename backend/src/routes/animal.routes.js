import { Router } from "express";
import weighingRepository from "../repositories/weighing.repository.js";
import { validateBody } from "../middlewares/validator.middleware.js";
import { createManualAnimalSchema } from "../schemas/animal.schema.js";
import { sendSuccess } from "../middlewares/response.middleware.js";

const router = Router();

router.get("/categories", async (req, res, next) => {
  try {
    const categories = await weighingRepository.getAllCategories();
    return sendSuccess(res, categories, "Categorías obtenidas con éxito", 200);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  validateBody(createManualAnimalSchema),
  async (req, res, next) => {
    try {
      const animalId =
        await weighingRepository.createManualAnimalWithInitialWeight(req.body);
      return sendSuccess(
        res,
        { id: animalId, ...req.body },
        "Animal registrado con éxito",
        201,
      );
    } catch (error) {
      next(error);
    }
  },
);

export default router;

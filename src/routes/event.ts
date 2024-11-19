import { Router } from "express";
import controller from "../controllers/EventController";

const routes = Router();

routes.get("/", controller.list);
routes.get("/:id", controller.getByID);
routes.post("/", controller.create);
routes.delete("/:id", controller.delete);
routes.put("/", controller.update);

export default routes
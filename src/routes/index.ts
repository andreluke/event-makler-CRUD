import { Router } from "express";
import event from "./event"

const routes = Router()

routes.use("/events", event);


export default routes
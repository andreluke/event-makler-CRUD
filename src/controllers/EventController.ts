import { Request, Response } from "express";
import Event from "../models/Event";

class EventController {
  public async create(req: Request, res: Response): Promise<void> {
    const { titulo, descricao, data, local } = req.body;
    try {
      const response = await Event.create({ titulo, descricao, data, local });
      res.status(201).send(response);
    } catch (e: any) {
      res.status(400).send({ message: e.message });
    }
  }

  public async list(_: Request, res: Response): Promise<void> {
    try {
      const events = await Event.find({}, {}, { sort: { titulo: 1 } });
      res.status(200).send(events);
    } catch (e: any) {
      res.status(500).send({ message: e.message });
    }
  }

  public async getByID(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const event = await Event.findById(id);
      if (event) {
        res.status(200).send(event);
      } else {
        res.status(404).send({ message: "Evento não encontrado" });
      }
    } catch (e: any) {
      res.status(400).send({ message: e.message });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const response = await Event.findByIdAndDelete(id);
      if (response) {
        res.status(200).send(response);
      } else {
        res.status(404).send({ message: "Evento não encontrado" });
      }
    } catch (e: any) {
      res.status(400).send({ message: e.message });
    }
  }


  public async update(req: Request, res: Response): Promise<void> {
    const { id, titulo, descricao, data, local } = req.body;

    // Crie um objeto com os campos que foram enviados
    const updateData: Record<string, any> = {};

    // Adicione somente os campos presentes no corpo da requisição
    if (titulo !== undefined) updateData.titulo = titulo;
    if (descricao !== undefined) updateData.descricao = descricao;
    if (data !== undefined) updateData.data = data;
    if (local !== undefined) updateData.local = local;

    try {
      // Atualize o evento no banco de dados com os dados do updateData
      const response = await Event.findByIdAndUpdate(id, updateData, {
        new: true, // Retorna o documento atualizado
        runValidators: true, // Aplica as validações do modelo
      });

      // Se o evento for encontrado e atualizado, retorna o evento
      if (response) {
        res.status(200).send(response);
      } else {
        res.status(404).send({ message: "Evento não encontrado" });
      }
    } catch (e: any) {
      // Tratamento de erro
      if (e.errors) {
        const errorMessages = Object.values(e.errors).map((err: any) => err.message);
        res.status(400).send({ message: errorMessages.join(", ") });
      } else {
        res.status(400).send({ message: e.message });
      }
    }
  }
}

export default new EventController();
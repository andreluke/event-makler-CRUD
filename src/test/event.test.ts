import request from 'supertest';
import app from '../index'; // Certifique-se de que você exporta o `app` do seu servidor
import mongoose from 'mongoose';
import Event from '../models/Event';
import dotenv from 'dotenv';
import { jest } from '@jest/globals';

// Carregar variáveis de ambiente de .env.dev
dotenv.config({ path: '.env.test' });

describe('Testes de Integração - Rotas de Eventos', () => {
  // Executado antes de cada teste
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      // Conectar ao banco de dados de testes
      await mongoose.connect(process.env.MONGO_URI_TEST || '');
    }
  });

  // Limpar a coleção de eventos após cada teste
  afterEach(async () => {
    await Event.deleteMany({});
  });

  // Fechar a conexão após todos os testes
  afterAll(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.drop();
    }
    await mongoose.connection.close();
  });

  it('Deve criar um novo evento (POST /)', async () => {
    const eventData = {
      titulo: 'Reunião de Projeto',
      descricao: 'Discussão sobre o andamento do projeto',
      data: '2023-11-10T00:00:00.000',
      local: 'Sala de Reuniões 1',
    };

    const response = await request(app).post('/events').send(eventData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.titulo).toBe(eventData.titulo);
    expect(response.body.descricao).toBe(eventData.descricao);
    expect(response.body.local).toBe(eventData.local);
  });

  it("Deve retornar um erro ao passar parâmetros errados no post (POST /)", async () => {
    const eventData = {
        evento: "Oi"
    }

    const response = await request(app).post('/events').send(eventData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  })

  it('Deve listar todos os eventos (GET /)', async () => {
    // Inserir um evento manualmente no banco
    await Event.create({ titulo: 'Workshop', descricao: 'Workshop de Node.js', data: '2023-11-01', local: 'Auditório' });

    const response = await request(app).get('/events');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].titulo).toBe('Workshop');
  });

  it('Deve retornar erro 500 ao listar eventos (GET /)', async () => {
    // Mock para simular um erro no banco de dados
    jest.spyOn(Event, 'find').mockImplementationOnce(() => {
      throw new Error('Erro de banco de dados simulado');
    });

    const response = await request(app).get('/events');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Erro de banco de dados simulado');
  });

  it('Deve obter um evento pelo ID (GET /:id)', async () => {
    const event = await Event.create({ titulo: 'Seminário', descricao: 'Seminário de Tecnologia', data: '2023-11-05', local: 'Sala 101' });

    const response = await request(app).get(`/events/${event.id}`);

    expect(response.status).toBe(200);
    expect(response.body.titulo).toBe(event.titulo);
  });

  it('Deve obter um erro ao buscar por evento pelo ID (GET /:id)', async () => {
    const response = await request(app).get(`/events/3`);

    expect(response.status).toBe(400);
   expect(response.body).toHaveProperty('message');
  });

  it('Deve retornar erro 404 ao buscar por evento inexistente pelo ID (GET /:id)', async () => {
    const nonExistentId = new mongoose.Types.ObjectId(); // Gera um ID válido, mas que não existe no banco
  
    const response = await request(app).get(`/events/${nonExistentId}`);
  
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Evento não encontrado');
  });

  it('Deve atualizar um evento (PUT /)', async () => {
    const event = await Event.create({ titulo: 'Conferência', descricao: 'Conferência Anual', data: '2023-11-15', local: 'Centro de Convenções' });

    const updatedData = {
      id: event.id,
      titulo: 'Conferência Atualizada',
      descricao: 'Conferência Anual Atualizada',
      data: '2023-11-16T00:00:00.000',
      local: 'Centro de Convenções Atualizado',
    };

    const response = await request(app).put('/events').send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.titulo).toBe(updatedData.titulo);
    expect(response.body.descricao).toBe(updatedData.descricao);
    expect(response.body.local).toBe(updatedData.local);
  });

  it('Deve retornar erro 400 ao tentar atualizar um evento com dados inválidos (PUT /)', async () => {
    const event = await Event.create({ titulo: 'Conferência', descricao: 'Conferência Anual', data: '2023-11-15', local: 'Centro de Convenções' });

    const updatedData = {
      id: event.id,
      titulo: null,
      descricao: 'Conferência Anual Atualizada',
      data: '2023-11-16',
      local: 'Centro de Convenções Atualizado',
    };

    const response = await request(app).put('/events').send(updatedData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('Deve retornar erro 404 ao tentar atualizar um evento inexistente (PUT /)', async () => {
    const nonExistentId = new mongoose.Types.ObjectId(); // Gera um ID válido, mas que não existe no banco

    const updatedData = {
      id: nonExistentId,
      titulo: 'Conferência Atualizada',
      descricao: 'Conferência Anual Atualizada',
      data: '2023-11-16',
      local: 'Centro de Convenções Atualizado',
    };

    const response = await request(app).put('/events').send(updatedData);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Evento não encontrado');
  });

  it('Deve retornar erro 400 ao tentar atualizar um evento com ID inválido (PUT /)', async () => {
    const updatedData = {
      id: '123', // ID inválido
      titulo: 'Conferência Atualizada',
      descricao: 'Conferência Anual Atualizada',
      data: '2023-11-16',
      local: 'Centro de Convenções Atualizado',
    };

    const response = await request(app).put('/events').send(updatedData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('Deve deletar um evento (DELETE /:id)', async () => {
    const event = await Event.create({ titulo: 'Palestra', descricao: 'Palestra sobre IA', data: '2023-11-20', local: 'Sala 202' });

    const response = await request(app).delete(`/events/${event.id}`);

    expect(response.status).toBe(200);
    expect(response.body.titulo).toBe(event.titulo);

    const findResponse = await request(app).get(`/${event.id}`);
    expect(findResponse.status).toBe(404);
  });

  it('Deve obter um erro ao deletar evento pelo ID (DELETE /:id)', async () => {
    const response = await request(app).delete(`/events/3`);

    expect(response.status).toBe(400);
   expect(response.body).toHaveProperty('message');
  });

  it('Deve retornar erro 404 ao deletar evento inexistente pelo ID (DELETE /:id)', async () => {
    const nonExistentId = new mongoose.Types.ObjectId(); // Gera um ID válido, mas que não existe no banco
  
    const response = await request(app).delete(`/events/${nonExistentId}`);
  
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Evento não encontrado');
  });
});
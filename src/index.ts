import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import { connect } from "./database/connection";

// Carregar as variáveis de ambiente
dotenv.config();

// Será usada a porta 3000 se a variável de ambiente PORT não for definida
const PORT = process.env.PORT || 3000;

const app = express();

// Configuração para suportar JSON no body das requisições
app.use(express.json());

// Configurar o CORS para permitir requisições de qualquer origem
app.use(cors());

// Define as rotas antes de iniciar o servidor
app.use(routes);

app.use((req, res, next) => {
    res.status(404).json({ message: "Página não encontrada. Verifique a URL e tente novamente." });
});

// Função para iniciar o servidor após conexão com o banco e seeding
// Função para iniciar o servidor após conexão com o banco e seeding
async function startServer() {
    try {
        // Conectando ao MongoDB
        await connect();
        console.log("Conectado ao MongoDB com sucesso!");

        // Apenas inicie o servidor se não estiver em ambiente de teste
        if (process.env.NODE_ENV !== 'test') {
            app.listen(PORT, () => {
                console.log(`Servidor rodando na porta ${PORT}...`);
            });
        }
    } catch (error) {
        console.error("Erro ao iniciar a aplicação:", error);
    }
}

// Iniciar o servidor
startServer();


export default app;
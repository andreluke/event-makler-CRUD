import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// A URI indica o IP, a porta e BD a ser conectado
const uri:string = process.env.DB_URI || "";

// Salva o objeto mongoose em uma variável
const db = mongoose;

export function connect() {
  // Utiliza o método connect do Mongoose para estabelecer a conexão com
  // o MongoDB, usando a URI
  db.connect(uri)
    .then(() => console.log("Conectado ao MongoDB"))
    .catch((e) => {
      console.error("Erro ao conectar ao MongoDB:", e.message);
    });

  // o sinal SIGINT é disparado ao encerrar a aplicação, geralmente, usando Crtl+C
  process.on("SIGINT", async () => {
    try {
      console.log("Conexão com o MongoDB fechada");
      await mongoose.connection.close();
      process.exit(0);
    } catch (error) {
      console.error("Erro ao fechar a conexão com o MongoDB:", error);
      process.exit(1);
    }
  });
}

export async function disconnect() {
  console.log("Conexão com o MongoDB encerrada");
  await db.disconnect();
}
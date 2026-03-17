import express, { Application } from "express";
import cors from "cors";
import router from "./router/users";

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(router);

// Render asigna un puerto automáticamente en la variable de entorno PORT
// Si no existe (como en tu PC), usará el 8080
const PORT = process.env.PORT || 8080;

// Es importante agregar '0.0.0.0' para que Render pueda dirigir el tráfico al contenedor
app.listen(Number(PORT), "0.0.0.0", () =>
  console.log(`🚀 SERVIDOR ESCUCHANDO EN EL PUERTO ${PORT}`)
);

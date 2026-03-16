
import express, { Application } from "express";
import cors from "cors";
import router from "./router/users"

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(router);
const PORT: number = 8080;

app.listen(PORT, () =>
  console.log(`🚀 SERVIDOR ESCUCHANDO EN EL PUERTO ${PORT}`)
);




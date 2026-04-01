import { Router, Request, Response } from "express";

const { Database } = require('@sqlitecloud/drivers');

const router = Router();

////////////conceta la base de datos ////////////

const url: string = "sqlitecloud://nq6klucfdk.finer-aphid.eks.use2.1kviht.sqlite.cloud:8860?apikey=ooI68KgrL4YpHbG05goxwbtqqvYbnEj5WSPEEniUHHs";

const db = new Database(url);




router.get("/test", async (req, res) => {
  try {
    // Intentamos una consulta mínima a la DB
    await db.sql("USE DATABASE wordle_back; SELECT 1;");
    console.log("¡Servidor y DB están vivos!");
    res.send("Servidor y DB funcionando");
  } catch (error) {
    console.error("El servidor está vivo pero la DB falló:", error);
    res.status(500).send("Error de conexión a la DB");
  }
});
//////////////////////////INICIO DE SECION///////////////////////////
//////////////////////////INICIO DE SECION///////////////////////////

router.post("/wordle/login", async (req: Request, res: Response) => {
  // 1. Extraemos el email y password del body
  const { email, password } = req.body;

  // Validación básica por si el body llega vacío
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Faltan datos requeridos (email y password)" 
    });
  }

  try {
    // 2. Conectamos a la base de datos correcta
    await db.sql("USE DATABASE wordle_back;");

    const sql = `SELECT * FROM usuarios WHERE email = '${email}' AND password = '${password}' LIMIT 1;`;
    const usuarios = await db.sql(sql);
    
    // 5. Verificamos si encontramos una coincidencia
    if (usuarios.length > 0) {
      const usuarioLogueado = usuarios[0];
      
      console.log(`✅ Usuario autenticado: ${usuarioLogueado.username}`);
      
      // Enviamos el éxito y los datos del usuario (sin la contraseña por seguridad)
      return res.json({ 
        success: true, 
        user: {id: usuarioLogueado.id, username: usuarioLogueado.username, email: usuarioLogueado.email } 
      });
    } else {
      // 6. Si no hay resultados, las credenciales no coinciden
      return res.status(401).json({ 
        success: false, 
        message: "Email o contraseña incorrectos" 
      });
    }

  } catch (error) {
    console.error("❌ ERROR EN EL SERVIDOR:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error interno de conexión con la base de datos" 
    });
  }
});

///////////////////////// REGISTRO ///////////////////////////////
///////////////////////// REGISTRO ///////////////////////////////

router.post("/wordle/registro", async (req: Request, res: Response) => {
  const { nombreUsuario, email, password } = req.body;
  
  try {
    await db.sql("USE DATABASE wordle_back;");

    // 1. Insertamos el usuario
    await db.sql(`INSERT INTO usuarios (username, email, password) VALUES ('${nombreUsuario}', '${email}', '${password}')`);
    
    // 2. CAMBIO CLAVE: Pedimos TODOS los datos (*) para que el front tenga la info completa
    const rows = await db.sql(`SELECT * FROM usuarios WHERE username = '${nombreUsuario}'`);
    const nuevoUsuario = rows[0]; // Ahora contiene id, username, email, etc.
    const nuevoUsuarioId = nuevoUsuario.id;
    
    // 3. Creamos la fila de estadísticas
    await db.sql(`INSERT INTO estadisticas (usuario_id) VALUES (${nuevoUsuarioId})`);
    
    res.json({ 
        success: true, 
        mensaje: "Usuario registrado con éxito",
        user: nuevoUsuario // <--- Ahora sí viaja el objeto completo {id, username, email...}
      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "El usuario o email ya existen." });
  }
});


////////////////////////// SELECCIONA PALABRA //////////////////////////
////////////////////////// SELECCIONA PALABRA //////////////////////////

router.get("/wordle/palabra", async (req: Request, res: Response) => {
  try {
    // 1. Asegúrate de que el nombre de la DB coincida con el que creaste en el panel
    await db.sql("USE DATABASE wordle_back;");
    
    // 2. Usamos el nombre de la columna exacto: "palabras"
    // El comentario con 'salt' es una buena técnica para evitar cache de red
    const salt = Math.floor(Math.random() * 100000);
    const sql = `/* ${salt} */ SELECT palabras FROM palabras ORDER BY RANDOM() LIMIT 1;`;
    
    const resultados = await db.sql(sql);

    // 3. Verificamos si hay resultados
    if (resultados && resultados.length > 0) {
      const palabraElegida = resultados[0].palabras;
      
      console.log("🎲 PALABRA ELEGIDA:", palabraElegida);
      
      // Enviamos un objeto limpio al frontend
      res.json({ palabra: palabraElegida });
    } else {
      res.status(404).json({ error: "La base de datos de palabras está vacía" });
    }
  } catch (error) {
    console.error("❌ ERROR EN DB:", error);
    res.status(500).json({ error: "Error al obtener la palabra del servidor" });
  }
});


//////////////////////////ENVIA ESTADISTICAS ///////////////////////////////
//////////////////////////ENVIA ESTADISTICAS ///////////////////////////////

router.post("/wordle/finalizar", async (req: Request, res: Response) => {
  const { usuario_id, gano } = req.body;
  const esGanada = String(gano) === 'true';

  try {
    await db.sql("USE DATABASE wordle_back;");

    // Lógica de puntos: +100 si gana, -25 si pierde
    const sql = esGanada 
      ? `UPDATE estadisticas 
         SET partidas_jugadas = partidas_jugadas + 1, 
             partidas_ganadas = partidas_ganadas + 1,
             puntos = puntos + 100, 
             racha_actual = racha_actual + 1,
             max_racha = MAX(max_racha, racha_actual + 1)
         WHERE usuario_id = ${usuario_id}`
      : `UPDATE estadisticas 
         SET partidas_jugadas = partidas_jugadas + 1,
             puntos = CASE WHEN puntos >= 25 THEN puntos - 25 ELSE 0 END, -- Evita puntos negativos
             racha_actual = 0 
         WHERE usuario_id = ${usuario_id}`;

    await db.sql(sql);
    
    // Opcional: Devolvemos los nuevos puntos para que React los vea
    const nuevosDatos = await db.sql(`SELECT * FROM estadisticas WHERE usuario_id = ${usuario_id}`);
    
    res.json({ success: true, stats: nuevosDatos[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar puntos" });
  }
});


//////////////////////////OBTENER ESTADISTICAS ///////////////////////////////
//////////////////////////OBTENER ESTADISTICAS ///////////////////////////////


router.get("/wordle/estadisticas/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.sql("USE DATABASE wordle_back;");
    const estadisticas = await db.sql(`SELECT * FROM estadisticas WHERE usuario_id = ${id}`);
    
    if (estadisticas.length > 0) {
      res.json(estadisticas[0]);
    } else {
      res.status(404).json({ error: "No se encontraron estadísticas" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener stats" });
  }
});


//////////////////////////OBTENER RANKING ///////////////////////////////
//////////////////////////OBTENER RANKING ///////////////////////////////


router.get("/wordle/ranking", async (req: Request, res: Response) => {
  try {
    await db.sql("USE DATABASE wordle_back;");

    // Consulta que trae el nombre y los puntos, ordenados de mayor a menor
    const ranking = await db.sql(`
      SELECT u.username, e.puntos 
      FROM usuarios u
      JOIN estadisticas e ON u.id = e.usuario_id
      ORDER BY e.puntos DESC
      LIMIT 10
    `);

    res.json({ ranking });
  } catch (error) {
    console.error("Error al obtener el ranking:", error);
    res.status(500).json({ message: "No se pudo cargar el ranking" });
  }
});


export default router;



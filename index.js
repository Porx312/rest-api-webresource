import express from "express";
import cors from "cors";
import fs from "fs/promises";

const app = express();
app.use(cors());

const readData = async () => {
  try {
    const data = await fs.readFile("./db.json", "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
    return null; // Devuelve null en caso de error
  }
};

app.use(express.json());

// Ruta para obtener un elemento por su id en una sección específica
app.get("/:section/:id", async (req, res) => {
  const { section, id } = req.params;
  const data = await readData();
  if (data) {
    const sectionData = data[section]; // Acceder a la sección correspondiente
    const item = sectionData.find((item) => item.id === parseInt(id)); // Buscar el elemento por id
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } else {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Ruta para obtener la sesión completa de una sección
app.get("/:section", async (req, res) => {
  const { section } = req.params;
  const data = await readData();
  if (data) {
    const sectionData = data[section]; // Acceder a la sección correspondiente
    if (sectionData) {
      res.json(sectionData);
    } else {
      res.status(404).json({ message: "Section not found" });
    }
  } else {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Ruta para realizar una búsqueda flexible por nombre
app.get("/search/:query", async (req, res) => {
  const { query } = req.params;
  const data = await readData();
  if (data) {
    const allItems = Object.values(data).flat(); // Obtener todos los elementos de todas las secciones
    const regex = new RegExp(query, "i"); // Crear una expresión regular que coincida con cualquier parte de la cadena
    const matchingItems = allItems.filter((item) => regex.test(item.nombre)); // Filtrar los elementos que coincidan con la consulta
    if (matchingItems.length > 0) {
      res.json(matchingItems);
    } else {
      res.status(404).json({ message: "No matching items found" });
    }
  } else {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Ruta para obtener todas las secciones
app.get("/", async (req, res) => {
  const data = await readData();
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000; // Usar el puerto proporcionado por el servicio de hosting o 3000 por defecto

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

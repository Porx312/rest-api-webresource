import express from "express";
import fs from "fs/promises";
const app = express();

const readData = async () => {
    try {
        const data = await fs.readFile("./db.json", "utf-8");
        return JSON.parse(data);
    } catch (err) {
        console.log(err);
    }
};

const writeData = async (data) => {
    try {
        await fs.writeFile("./db.json", JSON.stringify(data));
    } catch (err) {
        console.log(err);
    }
};

app.use(express.json());

app.get("/", async (req, res) => {
    const data = await readData();
    res.json(data);
});

app.get("/:section/:id", async (req, res) => {
    const { section, id } = req.params;
    const data = await readData();
    const sectionData = data[section]; // Acceder a la sección correspondiente
    const item = sectionData.find(item => item.id === parseInt(id)); // Buscar el elemento por id
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

// Ruta para obtener la sesión completa
app.get("/:section", async (req, res) => {
    const { section } = req.params;
    const data = await readData();
    const sectionData = data[section]; // Acceder a la sección correspondiente
    if (sectionData) {
        res.json(sectionData);
    } else {
        res.status(404).json({ message: 'Section not found' });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

const express = require('express');
const axios = require('axios');
const app = express();

// Para que el servidor pueda leer los datos que envía el EA
app.use(express.json());

// LA URL DE TU ARCHIVO DE GITHUB (Asegúrate de que sea la versión "Raw")
const GITHUB_RAW_URL = "https://raw.githubusercontent.com/kinoplay-co/kinotrading/main/licencias.json";

app.post('/validate', async (req, res) => {
    try {
        // El EA envía el número de cuenta como "account_id"
        const { account_id } = req.body; 

        // 1. Leemos tu archivo licencias.json desde GitHub
        const response = await axios.get(GITHUB_RAW_URL);
        const licenses = response.data;

        // 2. Verificamos si el número de cuenta existe y está ACTIVE
        if (licenses && licenses[account_id] === "ACTIVE") {
            console.log(`Cuenta ${account_id} validada con éxito.`);
            return res.json({ status: "ACTIVE" });[cite: 1]
        }

        // 3. Si no coincide, respondemos que es inválida
        console.log(`Acceso denegado para la cuenta: ${account_id}`);
        res.json({ status: "INACTIVE" });[cite: 1]

    } catch (error) {
        console.error("Error al conectar con GitHub:", error.message);
        res.status(500).json({ status: "ERROR", message: "Error interno del servidor" });
    }
});

// Railway asigna el puerto automáticamente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de licencias corriendo en puerto ${PORT}`);
});

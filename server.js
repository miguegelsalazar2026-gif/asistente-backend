import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

// Inicializamos la API de Gemini usando la variable de entorno segura
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Ruta de prueba para saber si el servidor está vivo
app.get('/', (req, res) => {
    res.send('El servidor del asistente de código está encendido y corriendo perfectamente.');
});

// Ruta principal donde se procesan los códigos a reparar
app.post('/api/chat', async (req, res) => {
    const { mensaje } = req.body;

    if (!mensaje) {
        return res.status(400).json({ respuesta: "No se recibió ningún mensaje o código." });
    }

    try {
        // Aquí le damos las instrucciones fijas a la IA para su trabajo remoto
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: mensaje,
            config: {
                systemInstruction: "Eres un programador experto y un auditor de software de alto nivel. Tu trabajo es ayudar al usuario a reparar códigos en remoto de forma rápida y eficiente. Cuando te pasen un bloque de código o un error: 1) Diagnostica el problema con precisión. 2) Especifica de forma clara y visible el número de línea exacto donde se encuentra la falla (el usuario te enviará el código ya numerado). 3) Explica brevemente qué estaba fallando. 4) Entrega el código completamente corregido, limpio y listo para copiar y pegar."
            }
        });
;

        res.json({ respuesta: response.text });

    } catch (error) {
        console.error("Error en la IA:", error);
        res.status(500).json({ respuesta: "Hubo un error interno al procesar el código con la IA." });
    }
})

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Servidor de desarrollo remoto corriendo en el puerto ${PORT}`);
});

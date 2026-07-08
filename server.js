import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

// Configurar el acceso para tu aplicación móvil o web
app.use(cors());
app.use(express.json());

// Inicializar la inteligencia artificial de Gemini con tu clave secreta
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Ruta básica para probar que el servidor funciona
app.get('/', (req, res) => {
  res.send('El servidor del asistente está encendido y corriendo perfectamente.');
});

// Ruta principal para hablar con Gemini
app.post('/api/chat', async (req, res) => {
  try {
    const { mensaje } = req.body;
    
    if (!mensaje) {
      return res.status(400).json({ error: 'No se recibió ningún mensaje.' });
    }

    // Llamada a la API de Gemini usando el modelo rápido flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: mensaje,
    });

    res.json({ respuesta: response.text });
  } catch (error) {
    console.error('Error al conectar con Gemini:', error);
    res.status(500).json({ error: 'Hubo un problema en el servidor al procesar la IA.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor activo en el puerto ${port}`);
});

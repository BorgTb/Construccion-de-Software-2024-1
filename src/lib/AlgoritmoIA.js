import { GoogleGenerativeAI } from "@google/generative-ai";
import { exec } from 'child_process';
import { writeFile } from 'fs/promises';

// Accede a tu clave API como una variable de entorno
const genAI = new GoogleGenerativeAI("AIzaSyBheR5f8PrwOnPRaY_CNlU8eZlccqSkre4");

async function generateTextFile() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  exec('tasklist', async (error, stdout, stderr) => {
    if (error) {
      console.error(`Error ejecutando tasklist: ${error}`);
      return;
    }

    if (stderr) {
      console.error(`Error en stderr: ${stderr}`);
      return;
    }

    const prompt = `Dada la lista de procesos: ${stdout}\nPor favor, clasifica las aplicaciones del usuario (no sistema) según su conveniencia al momento de estudiar. Debes clasificar entre 'bueno', 'malo' e 'intermedio', y siempre debe ser alguna de estas opciones, agrupa las que son iguales.`;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text(); // Ajusta esto basado en la estructura de la respuesta

      // Escribir el texto a un archivo
      await writeFile('respuesta.txt', text);
      console.log('El archivo de texto ha sido creado y actualizado');
    } catch (e) {
      console.error(`Error generando contenido: ${e}`);
    }
  });
}

// Ejecutar la función cada 10 segundos
setInterval(generateTextFile, 10000);


//5 horas completas
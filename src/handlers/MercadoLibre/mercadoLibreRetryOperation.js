// Helper para manejar múltiples intentos de una operación
const retryOperation = async (operation, maxRetries = 1, delay = 1000) => {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        return await operation();
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) throw error;
        console.log(`MELI-PREGUNTA:Intento ${attempt} fallido, reintentando en ${delay}ms...`);
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  };
  module.exports ={ retryOperation }
  
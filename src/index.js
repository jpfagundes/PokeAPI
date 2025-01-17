// Importa o app do servidor
const app = require('./server'); 

// Inicializa o servidor
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
    });

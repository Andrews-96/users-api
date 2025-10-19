import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, 'data', 'users.json');

const app = express();
const PORT = 3000;

// ��� Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('API Users activa. Usa GET /users y POST /users');
});


// ��� Funciones auxiliares
const readUsers = () => JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
const writeUsers = (users) => fs.writeFileSync(DATA_PATH, JSON.stringify(users, null, 2), 'utf-8');

// ��� GET /users → lista todos los usuarios
app.get('/users', (req, res) => {
  try {
    const users = readUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No fue posible leer usuarios' });
  }
});

// ��� POST /users → crea un nuevo usuario y lo pone al inicio
app.post('/users', (req, res) => {
  try {
    const { name, phone, email, address, age, photoUrl } = req.body;
    if (!name || !phone || !email || !address || typeof age !== 'number' || !photoUrl) {
      return res.status(400).json({ error: 'Campos requeridos: name, phone, email, address, age (number), photoUrl' });
    }

    const newUser = { id: `u_${nanoid(8)}`, name, phone, email, address, age, photoUrl };
    const users = readUsers();
    users.unshift(newUser);
    writeUsers(users);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No fue posible crear el usuario' });
  }
});

// ��� Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ API corriendo en http://localhost:${PORT}`);
  console.log('Endpoints: GET /users | POST /users');
});

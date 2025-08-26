// Ruta para recibir mensajes de contacto
app.post('/contacto', async (req, res) => {
  const { nombre, email, mensaje } = req.body;
  // Aquí podrías guardar el mensaje en la base de datos o enviarlo por correo
  console.log('Mensaje recibido:', { nombre, email, mensaje });
  res.json({ mensaje: 'Mensaje recibido, gracias por contactarnos.' });
});
const jwt = require('jsonwebtoken');
const SECRET = 'rocma_secret_key'; // Cambia esto por una clave segura en producción

// Modelo de usuario
const usuarioSchema = new mongoose.Schema({
  nombre: String,
  email: { type: String, unique: true },
  password: String,
  rol: { type: String, default: 'cliente' }
});
const Usuario = mongoose.model('Usuario', usuarioSchema);

// Registro de usuario
app.post('/registro', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const usuario = new Usuario({ nombre, email, password, rol });
    await usuario.save();
    res.json({ mensaje: 'Usuario registrado', usuario });
  } catch (err) {
    res.status(400).json({ error: 'Email ya registrado o datos inválidos' });
  }
});

// Login de usuario
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ email, password });
  if (!usuario) return res.status(401).json({ error: 'Credenciales incorrectas' });
  const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, SECRET, { expiresIn: '1d' });
  res.json({ mensaje: 'Login exitoso', token });
});

// Middleware de autenticación
function auth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
}

// Ejemplo de ruta protegida
app.get('/perfil', auth, async (req, res) => {
  const usuario = await Usuario.findById(req.usuario.id);
  res.json(usuario);
});
// Modelo de productos
const productoSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  precio: Number,
  stock: Number
});
const Producto = mongoose.model('Producto', productoSchema);

// Rutas de productos
app.post('/productos', async (req, res) => {
  const producto = new Producto(req.body);
  await producto.save();
  res.json(producto);
});
app.get('/productos', async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/rocma', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Conectado a MongoDB')).catch(err => console.error('Error MongoDB:', err));

// Modelos básicos
const clienteSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  telefono: String,
  direccion: String
});
const Cliente = mongoose.model('Cliente', clienteSchema);

const pedidoSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
  productos: [String],
  total: Number,
  fecha: { type: Date, default: Date.now }
});
const Pedido = mongoose.model('Pedido', pedidoSchema);

// Rutas básicas
app.get('/', (req, res) => {
  res.send('API ROCMA funcionando');
});

// Clientes
app.post('/clientes', async (req, res) => {
  const cliente = new Cliente(req.body);
  await cliente.save();
  res.json(cliente);
});
app.get('/clientes', async (req, res) => {
  const clientes = await Cliente.find();
  res.json(clientes);
});

// Pedidos
app.post('/pedidos', async (req, res) => {
  const pedido = new Pedido(req.body);
  await pedido.save();
  res.json(pedido);
});
app.get('/pedidos', async (req, res) => {
  const pedidos = await Pedido.find().populate('cliente');
  res.json(pedidos);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const app = express();
const PDFDocument = require('pdfkit');
const bcrypt = require('bcrypt');

app.use(cors());
app.use(express.json());

const directorioReportes = path.join(__dirname, 'reportes');

if (!fs.existsSync(directorioReportes)) {
  fs.mkdirSync(directorioReportes);
}

// Configuración de la base de datos 
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',    
    database: 'clinica',
    password: 'Matamoro32',
    port: 5432,
});
// Verificar la conexión a la base de datos
function guardarReporte(tipo, usuario){
    const fecha = new Date().toLocaleString();
    const reporte = `${fecha} - Tipo: ${tipo}, Usuario: ${usuario}\n`;
    const filePath = path.join(__dirname, 'reportes.txt');
    fs.appendFile(filePath, reporte, (err) => {
      if(err) {
        console.error('Error al guardar el reporte:', err);
      }else {
        console.log('reporte guardado correctamente', reporte.trimEnd());
      }
    })
}

app.get('/', (req, res) => {
    res.send('Backend funcionando');
});

// Ruta de registro
app.post('/registro', async (req, res) => {
  const {
    usuario,
    password,
    nombre,
    telefono,
    email,
    fecha_nacimiento,
    genero,
    direccion,
    tipo_usuario
  } = req.body;

  if (tipo_usuario !== 'paciente' && tipo_usuario !== 'psicologo') {
    return res.status(400).json({ status: 'error', message: 'Tipo de usuario inválido' });
  }

   try {
    // Validar si el usuario ya existe
    const usuarioExistente = await pool.query(
      'SELECT 1 FROM usuarios WHERE usuario = $1',
      [usuario]
    );
      if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'El nombre de usuario ya está en uso'
      });
    }
  } catch (error) {
    console.error('Error en la consulta:', error);
    return res.status(500).json({ status: 'error', message: 'Error en el servidor' });
  }

  try {
    // 1. Insertar en la tabla usuarios
    const result = await pool.query(
      `INSERT INTO usuarios (usuario, password, telefono, nombre, email, fecha_nacimiento, genero, direccion, tipo_usuario) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING id_usuario`,
      [usuario, password, telefono, nombre, email, fecha_nacimiento, genero, direccion, tipo_usuario]
    );

    const id_usuario = result.rows[0].id_usuario;

    // 2. Insertar en la tabla específica según el tipo de usuario
    if (tipo_usuario === 'paciente') {
      await pool.query(
        `INSERT INTO pacientes (id_usuario, usuario, nombre, password, telefono, email, fecha_nacimiento, genero, direccion) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [id_usuario, usuario, nombre, password, telefono, email, fecha_nacimiento, genero, direccion]
      );
    } else if (tipo_usuario === 'psicologo') {
      await pool.query(
        `INSERT INTO psicologos (id_usuario, nombre, password, telefono, email, fecha_nacimiento, genero, direccion) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [id_usuario, nombre, password, telefono, email, fecha_nacimiento, genero, direccion]
      );
    }

    //Crear Documento PDF
    const doc = new PDFDocument();
    const CarpetaReportes = path.join(__dirname, 'reportes');
    if (!fs.existsSync(CarpetaReportes)) {
      fs.mkdirSync(CarpetaReportes);
    }

    const archivoPDF = path.join(CarpetaReportes, `${usuario}.pdf`);
    doc.pipe(fs.createWriteStream(archivoPDF));

    doc.fontSize(25).text('Registro de Usuario', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16);
    doc.text(`Nombre: ${nombre}`);
doc.text(`Usuario: ${usuario}`);
doc.text(`Correo Electronico: ${email}`);
doc.text(`Telefono: ${telefono}`);
doc.text(`Fecha de Nacimiento: ${fecha_nacimiento}`);
doc.text(`Direccion: ${direccion}`);
doc.text(`Tipo de Usuario: ${tipo_usuario}`);
doc.text(`Fecha de Registro: ${new Date().toLocaleDateString()}`);
    doc.moveDown();
    doc.text('Gracias por registrarte en nuestra plataforma.', { align: 'center' });
    doc.end();
    console.log(`✅ Registro exitoso: PDF creado para el usuario '${usuario}' en ${archivoPDF}`);

    // Guardar reporte de registro
    res.json({ status: 'success', message: 'Registro exitoso y reporte generado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error en el servidor' });
  }
});



// Ruta de login
app.post('/login', async (req, res) => {
    const { usuario, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE usuario = $1 AND password = $2',
            [usuario, password]
        );

        if(result.rows.length > 0){
            res.json({
              status: 'success',
    tipo_usuario: result.rows[0].tipo_usuario,
    id_usuario: result.rows[0].id_usuario// <-- se devuelve el id del usuario   
            });       
        } else {
            res.status(401).json({ status: 'error', message: 'Credenciales incorrectas' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).json({ status: 'error', message: 'Error en el servidor' });
    }
});
//Ruta para agendar Cita
app.post('/agendar-cita', async (req, res) => {
  const { usuario, fecha, hora } = req.body;

  try {
    // Buscar id_usuario por nombre de usuario
    const usuarioEncontrado = await pool.query('SELECT id_usuario FROM usuarios WHERE usuario = $1', [usuario]);
    if (usuarioEncontrado.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }
    const id_usuario = usuarioEncontrado.rows[0].id_usuario;

    // Insertar cita con estado por defecto
    const estado = 'pendiente';
    const result = await pool.query(
      'INSERT INTO citas (id_usuario, fecha, hora, estado) VALUES ($1, $2, $3, $4) RETURNING id_cita'
,
      [id_usuario, fecha, hora, estado]
    );

    res.json({ status: 'success', id: result.rows[0].di_cita });
  } catch (error) {
    console.error('Error al agendar cita:', error);
    res.status(500).json({ status: 'error', message: 'Error en el servidor' });
  }
});

// Obtener historial de citas por nombre de usuario
app.get('/historial-citas/:usuario', async (req, res) => {
  const { usuario } = req.params;

  try {
    const usuarioEncontrado = await pool.query(
      'SELECT id_usuario FROM usuarios WHERE usuario = $1',
      [usuario]
    );

    if (usuarioEncontrado.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    const id_usuario = usuarioEncontrado.rows[0].id_usuario;

    // Aquí el JOIN para traer el nombre del usuario que creó la cita (puede ser el mismo usuario)
    const citas = await pool.query(`
      SELECT c.fecha, c.hora, c.estado, u.nombre
      FROM citas c
      JOIN usuarios u ON c.id_usuario = u.id_usuario
      WHERE c.id_usuario = $1
      ORDER BY c.fecha DESC, c.hora DESC
    `, [id_usuario]);

    res.json({ status: 'success', citas: citas.rows });
  } catch (error) {
    console.error('Error al obtener historial de citas:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener el historial' });
  }
});
// Ruta para obtener todas las citas
app.get('/citas', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id_cita, u.nombre AS nombre_paciente, c.fecha, c.hora, c.estado
      FROM citas c
      JOIN usuarios u ON c.id_usuario = u.id_usuario
      ORDER BY c.fecha, c.hora
    `);
    res.json({ status: 'success', citas: result.rows });
  } catch (error) {
    console.error('Error obteniendo citas:', error);
    res.status(500).json({ status: 'error', message: 'Error en servidor' });
  }
});
//ruta para cambiar el estado de una cita
app.put('/citas/:id', async (req, res) => {
  const id = req.params.id;
  const { fecha, hora } = req.body;

  try {
    const result = await pool.query(
      'UPDATE citas SET fecha = $1, hora = $2 WHERE id_cita = $3 RETURNING *',
      [fecha, hora, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ status: 'error', message: 'Cita no encontrada' });
    }

    res.json({ status: 'success', cita: result.rows[0] });
  } catch (error) {
    console.error('Error actualizando cita:', error);
    res.status(500).json({ status: 'error', message: 'Error en servidor' });
  }
});
// Ruta para cambiar el estado de una cita
app.put('/citas/:id/estado', async (req, res) => {
  const id = req.params.id;
  const { estado } = req.body;

  try {
    const result = await pool.query(
      'UPDATE citas SET estado = $1 WHERE id_cita = $2 RETURNING *',
      [estado, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ status: 'error', message: 'Cita no encontrada' });
    }

    res.json({ status: 'success', cita: result.rows[0] });
  } catch (error) {
    console.error('Error actualizando estado cita:', error);
    res.status(500).json({ status: 'error', message: 'Error en servidor' });
  }
});
//Ruta para edicionar perfil
// Obtener perfil por nombre de usuario (usa usuario en vez de id_usuario)
app.put('/perfil/:usuario', async (req, res) => {
  const usuario = req.params.usuario;
  const {
    nombre,
    telefono,
    email,
    direccion,
    fecha_nacimiento,
    password,
    especialidad,
    experiencia
  } = req.body;

  try {
    // 1. Obtener usuario y tipo
    const userResult = await pool.query(
      'SELECT id_usuario, tipo_usuario FROM usuarios WHERE usuario = $1',
      [usuario]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    const { id_usuario, tipo_usuario } = userResult.rows[0];

    // 2. Actualizar password si se envió
    let query, values;
    if (password && password.trim() !== '') {
      const bcrypt = require('bcrypt');
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      query = `UPDATE usuarios SET nombre=$1, telefono=$2, email=$3, direccion=$4, fecha_nacimiento=$5, password=$6 WHERE usuario=$7`;
      values = [nombre, telefono, email, direccion, fecha_nacimiento, passwordHash, usuario];
    } else {
      query = `UPDATE usuarios SET nombre=$1, telefono=$2, email=$3, direccion=$4, fecha_nacimiento=$5 WHERE usuario=$6`;
      values = [nombre, telefono, email, direccion, fecha_nacimiento, usuario];
    }

    await pool.query(query, values);

    // 3. Actualizar tabla psicologos si aplica
    if (tipo_usuario === 'psicologo') {
      await pool.query(
        `UPDATE psicologos SET especialidad=$1, experiencia=$2 WHERE id_usuario=$3`,
        [especialidad || null, experiencia || null, id_usuario]
      );
    }

    res.json({ status: 'success', message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({ status: 'error', message: 'Error en el servidor' });
  }
});

app.get('/buscar-pacientes', async (req, res) => {
  const nombre = req.query.nombre;

  try {
    const result = await pool.query(
      `SELECT id_usuario, nombre, usuario 
       FROM usuarios 
       WHERE tipo_usuario = 'paciente' AND nombre ILIKE $1 
       ORDER BY nombre LIMIT 10`,
      [`%${nombre}%`]
    );

    res.json({ status: 'success', pacientes: result.rows });
  } catch (error) {
    console.error('Error al buscar pacientes:', error);
    res.status(500).json({ status: 'error', message: 'Error al buscar pacientes' });
  }
});
app.delete('/antecedentes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM antecedentes WHERE id_antecedente = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ status: 'error', message: 'Antecedente no encontrado' });
    }

    res.json({ status: 'success', message: 'Antecedente eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar antecedente:', error);
    res.status(500).json({ status: 'error', message: 'Error en el servidor' });
  }
});
app.get('/antecedentes/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const result = await pool.query(
      `SELECT nota, fecha 
       FROM antecedentes 
       WHERE id_usuario = $1 
       ORDER BY fecha DESC`,
      [id_usuario]
    );
    console.log(result.rows); // 👈 Verifica si viene vacío

    res.json({ status: 'success', antecedentes: result.rows });
  } catch (error) {
    console.error('Error al obtener antecedentes:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener antecedentes' });
  }
});
app.post('/antecedentes', async (req, res) => {
  const { id_usuario, detalle } = req.body;

  try {
    await pool.query(
      'INSERT INTO antecedentes (id_usuario, nota, fecha) VALUES ($1, $2, NOW())',
      [id_usuario, detalle]
    );

    res.json({ status: 'success', message: 'Antecedente guardado' });
  } catch (error) {
    console.error('Error al guardar antecedente:', error);
    res.status(500).json({ status: 'error', message: 'Error al guardar antecedente' });
  }
});




// Ruta para agregar lectura
app.post('/agregar-lectura', async (req, res) => {
  const { titulo, contenido } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO lecturas (titulo, contenido) VALUES ($1, $2) RETURNING id_lectura',
      [titulo, contenido]
    );

    res.json({
      status: 'success',
      message: 'Lectura agregada exitosamente',
      id_lectura: result.rows[0].id_lectura
    });
  } catch (error) {
    console.error('Error al agregar lectura:', error);
    res.status(500).json({ status: 'error', message: 'Error en el servidor' });
  }
});
// Ruta para obtener todas las lecturas
app.get('/lecturas', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_lectura, titulo, contenido FROM lecturas ORDER BY id_lectura');
    res.json({ status: 'success', lecturas: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error al obtener lecturas' });
  }
});

//ruta para agregar videos
app.post('/agregar-video', async (req, res) => {
  const { titulo, enlace, descripcion } = req.body;

  if (!titulo || !enlace) {
    return res.status(400).json({ status: 'error', message: 'Campos obligatorios faltantes' });
  }

  try {
    const resultado = await pool.query(
      'INSERT INTO videos (titulo, url, descripcion) VALUES ($1, $2, $3)',
      [titulo, enlace, descripcion]
    );

    res.json({ status: 'success', message: 'Video guardado correctamente' });
  } catch (error) {
    console.error('Error al insertar el video:', error);
    res.status(500).json({ status: 'error', message: 'Error en el servidor' });
  }
});
// Ruta para obtener todos los videos
app.get('/videos', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, titulo as title, url, descripcion FROM videos ORDER BY id');
    res.json({ status: 'success', videos: result.rows });
  } catch (error) {
    console.error('Error al obtener videos:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener videos' });
  }
});


// Ruta para obtener perfil por id_usuario

app.get('/perfil/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      'SELECT nombre, genero, direccion, fecha_nacimiento, tipo_usuario FROM usuarios WHERE id_usuario = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    res.json({ status: 'success', datos: result.rows[0] });
  } catch (error) {
    console.error('Error en la consulta perfil:', error);
    res.status(500).json({ status: 'error', message: 'Error en el servidor' });
  }
});


app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});



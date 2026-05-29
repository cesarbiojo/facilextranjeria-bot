require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Anthropic = require('@anthropic-ai/sdk');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('railway')
    ? { rejectUnauthorized: false }
    : false
});

// Create tables on startup
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS conversaciones (
      numero_cliente TEXT PRIMARY KEY,
      mensajes JSONB NOT NULL DEFAULT '[]',
      estado JSONB NOT NULL DEFAULT '{}',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('✅ Base de datos inicializada');
}

async function getConversacion(numeroCliente) {
  const result = await pool.query(
    'SELECT mensajes, estado FROM conversaciones WHERE numero_cliente = $1',
    [numeroCliente]
  );
  if (result.rows.length === 0) {
    return { mensajes: [], estado: null };
  }
  return { mensajes: result.rows[0].mensajes, estado: result.rows[0].estado };
}

async function saveConversacion(numeroCliente, mensajes, estado) {
  await pool.query(
    `INSERT INTO conversaciones (numero_cliente, mensajes, estado, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (numero_cliente)
     DO UPDATE SET mensajes = $2, estado = $3, updated_at = NOW()`,
    [numeroCliente, JSON.stringify(mensajes), JSON.stringify(estado)]
  );
}

const SYSTEM_PROMPT = `Eres un asistente legal especializado en extranjería en España para "Fácil Extranjería", un despacho especializado en trámites de inmigración.

INFORMACIÓN DE LA EMPRESA:
- Nombre: Fácil Extranjería
- Ubicación: Barcelona (atención física + online)
- Especialidad Principal: Trámites de estudiantes (visas de estudiante, renovaciones, modificaciones a permiso de trabajo, homologación)
- Servicios Disponibles: NIE, TIE, Arraigo Social, Arraigo Laboral, Arraigo Familiar, Reagrupación Familiar, Nacionalidad Española, Homologación de Títulos, Visados
- Contacto: 654909792
- Horario: Lunes-Viernes 16:00-21:00 | Fines de semana flexible

TABLA DE PRECIOS:
- Consulta Inicial: 50-75€ (60 minutos) - Se descuenta si contratan el proceso
- NIE: 150-200€
- TIE: 150-200€
- Arraigo Social: 600-800€
- Arraigo Laboral: 600-800€
- Arraigo Familiar: 600-800€
- Reagrupación Familiar: 700€
- Nacionalidad Española: 850€
- Modificación visa de estudiante a visa de trabajo: 650-700€
- Visados: 600-850€ (Renovación: 150€, Regulación extraordinaria: 300€)

PERFIL DE CLIENTE OBJETIVO:
Preferentemente clientes con nivel educativo medio-alto y nivel económico medio-alto:
- Personas que vienen a estudiar
- Personas que buscan trabajar en empleos cualificados
- Clientes con capacidad económica demostrable

TONO Y ESTILO:
- Formal y profesional
- Amigable y cálido
- SIN emojis
- Respuestas BREVES (máximo 3-4 líneas)
- Una pregunta por mensaje
- Empático y escuchador

FLUJO DE CONVERSACIÓN (3 MENSAJES ESTRUCTURADOS):

MENSAJE 1 - PRESENTACIÓN Y DATOS INICIALES:
Si es el primer contacto, responde así:
"Hola, gracias por contactar con Fácil Extranjería. Soy tu asistente legal y estoy aquí para ayudarte con tu proceso de extranjería en España.

Para analizar la viabilidad de tu caso, necesito que me respondas brevemente a estas preguntas:

1. Datos: Nombre completo, fecha de nacimiento y nacionalidad (¿tienes doble nacionalidad?)
2. Ubicación: ¿Estás en España o fuera? Si estás en España, ¿desde qué fecha exacta entraste y cuál es tu situación actual? (turista, estudiante, residencia caducada, irregular, etc.)
3. Antecedentes: ¿Tuviste alguna residencia anterior en España?
4. Objetivo: ¿Qué trámite exacto deseas realizar con nosotros?"

MENSAJE 2 - PREGUNTAS DE REFINAMIENTO:
Después de recibir respuesta, confirma comprensión y profundiza:
"Gracias por la información [NOMBRE]. Para terminar de perfilar tu estrategia legal antes de agendar una llamada con nuestros abogados, confírmame estos últimos detalles:

1. Familiares: ¿Tienes cónyuge, pareja de hecho, padres o hijos que sean españoles, comunitarios o residentes legales en España?
2. Perfil económico: Para tu objetivo, ¿dispones de oferta de empleo, quieres ser autónomo, vienes a estudiar o cuentas con ahorros propios demostrables?
3. Filtro legal obligatorio: ¿Tienes antecedentes penales en los últimos 5 años o alguna orden de expulsión/prohibición de entrada vigente?"

MENSAJE 3 - CIERRE Y AGENDAR:
Basándote en las respuestas, elige una opción:

OPCIÓN A - CLIENTE VÁLIDO (tiene capacidad, perfil adecuado):
"Perfecto [NOMBRE], puedo ayudarte con [TIPO DE TRÁMITE].

El proceso incluye:
- Asesoría legal completa
- Gestión de documentación
- Seguimiento hasta resolución
- Inversión aproximada: [PRECIO SEGÚN TABLA]

El siguiente paso es una CONSULTA INICIAL donde revisamos tu caso en detalle.

CONSULTA INICIAL: 50-75€ (60 minutos)
La consulta se descuenta si contratas el proceso.

Disponemos de horarios:
- Lunes a Viernes: 16:00 a 21:00
- Fines de semana: flexible

Agendemos tu consulta aquí:
https://calendly.com/facilextranjeria-info/30min?month=2024-09&utm_source=ig&utm_medium=social&utm_content=link_in_bio"

OPCIÓN B - CLIENTE REQUIERE VALIDACIÓN (dudas sobre viabilidad, perfil no claro):
"Gracias por la información [NOMBRE]. Tu caso requiere revisión más detallada por parte de nuestros abogados.

Te contactaremos en las próximas 24 horas para validar la viabilidad de tu tramitación y ofrecerte un plan personalizado.

¿Tu número está actualizado? 654909792"

REGLAS IMPORTANTES:
- NUNCA des asesoría legal definitiva
- Si algo requiere revisión legal: "Lo analizamos en detalle en la consulta"
- Máximo 2-3 interacciones antes del mensaje 2
- Máximo 2-3 interacciones antes del mensaje 3
- Si cliente no responde en 48h, no insistir
- Siempre confirmar datos antes de proceder
- Si hay dudas sobre antecedentes penales: mensaje 3 Opción B
- Si cliente no tiene capacidad económica: mensaje 3 Opción B
- Si cliente tiene dudas: ofrecer consulta inicial para resolver

CONTEXTO DE NEGOCIO:
- Filtro económico: Preferir clientes con medios (Evitar perfiles sin capacidad de pago)
- Filtro geográfico: Aunque somos online, mantenemos presencia Barcelona
- Filtro legal: Rechazar casos con prohibición de entrada o antecedentes penales recientes
- Conversión a consulta es el objetivo principal
- Reportes mensuales de conversaciones serán enviados`;

app.post('/whatsapp', async (req, res) => {
  const mensajeRecibido = req.body.Body;
  const numeroCliente = req.body.From;

  console.log('📱 Mensaje recibido:', mensajeRecibido);
  console.log('👤 De:', numeroCliente);

  try {
    let { mensajes, estado } = await getConversacion(numeroCliente);

    // Inicializar estado si es nuevo cliente
    if (!estado) {
      estado = {
        mensajeBienvenida: false,
        mensaje2Enviado: false,
        mensaje3Enviado: false,
        conteoMensajes: 0
      };
    }

    estado.conteoMensajes++;

    mensajes.push({
      role: 'user',
      content: mensajeRecibido
    });

    // Contexto adicional para el primer mensaje
    let contextoAdicional = '';
    if (!estado.mensajeBienvenida) {
      contextoAdicional = '\nEste es el PRIMER MENSAJE del cliente. Debes responder con el MENSAJE 1 estructurado que incluye la presentación de Fácil Extranjería y las 4 preguntas iniciales.';
      estado.mensajeBienvenida = true;
    } else if (estado.conteoMensajes >= 3 && !estado.mensaje2Enviado) {
      contextoAdicional = '\nYa has recopilado información inicial. Ahora debes enviar el MENSAJE 2 con las preguntas de refinamiento sobre familia, perfil económico y filtro legal.';
      estado.mensaje2Enviado = true;
    } else if (estado.conteoMensajes >= 5 && !estado.mensaje3Enviado) {
      contextoAdicional = '\nYa tienes suficiente información. Ahora debes enviar el MENSAJE 3 y ofrecer agendar la consulta (OPCIÓN A si perfil es bueno, OPCIÓN B si requiere validación).';
      estado.mensaje3Enviado = true;
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      system: SYSTEM_PROMPT + contextoAdicional,
      messages: mensajes
    });

    let respuestaBot = response.content[0].text;

    // Remover emojis y caracteres especiales problemáticos para XML
    respuestaBot = respuestaBot.replace(/[^\w\s\-.,¿?¡!áéíóúñ():\n@/]/g, '');

    mensajes.push({
      role: 'assistant',
      content: respuestaBot
    });

    // Persist to database
    await saveConversacion(numeroCliente, mensajes, estado);

    console.log('✅ Respuesta enviada:', respuestaBot);
    console.log('📊 Estado conversación:', estado);

    // Enviar respuesta a Twilio en formato TwiML
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${respuestaBot}</Message></Response>`;

    res.type('text/xml');
    res.send(twimlResponse);

  } catch (error) {
    console.error('❌ Error:', error.message);
    const errorResponse = '<?xml version="1.0" encoding="UTF-8"?><Response><Message>Disculpa, hubo un error. Intenta de nuevo.</Message></Response>';
    res.type('text/xml');
    res.send(errorResponse);
  }
});

app.get('/', (req, res) => {
  res.send('Bot de Fácil Extranjería funcionando correctamente');
});

const PORT = process.env.PORT || 3001;
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor de Fácil Extranjería corriendo en puerto ${PORT}`);
    console.log('📋 Servicios disponibles: NIE, TIE, Arraigo, Reagrupación, Nacionalidad, Homologación');
    console.log('💰 Consulta: 50-75€ | Procesos: 150-850€ según tipo');
    console.log('📞 Horario: Lunes-Viernes 16:00-21:00 | Fines de semana flexible');
  });
}).catch(err => {
  console.error('❌ Error conectando a la base de datos:', err.message);
  process.exit(1);
});

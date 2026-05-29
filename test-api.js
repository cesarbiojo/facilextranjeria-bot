require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function testAPI() {
  try {
    console.log('🧪 Probando API key con modelo CORRECTO...');
    console.log('📌 Usando modelo: claude-sonnet-4-6\n');
    
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 100,
      messages: [{ 
        role: 'user', 
        content: '¿Cuál es el procedimiento básico para obtener un NIE en España? Responde en 2-3 líneas.' 
      }]
    });
    
    console.log('✅ ¡API key funciona correctamente!');
    console.log('\n📝 Respuesta de Claude:\n');
    console.log(response.content[0].text);
    console.log('\n✨ El modelo claude-sonnet-4-6 está disponible y funcionando.');
    
  } catch (error) {
    console.error('❌ Error al conectar con la API:', error.message);
    console.error('\n📋 Detalles técnicos:', error.status || error.type);
    
    if (error.message.includes('404')) {
      console.error('⚠️  Este error significa que el modelo no existe o no está disponible.');
    } else if (error.message.includes('401')) {
      console.error('⚠️  Este error significa que la API key es inválida o está revocada.');
    }
  }
}

testAPI();

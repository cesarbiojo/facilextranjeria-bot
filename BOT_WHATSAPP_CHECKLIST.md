# 📋 BOT WHATSAPP - FÁCIL EXTRANJERÍA
## Checklist de Implementación y Configuración

---

## ✅ FASE 1: PASOS COMPLETADOS

- ✅ API Key de Anthropic configurada en .env
- ✅ Modelo Claude Sonnet 4.6 funcionando correctamente
- ✅ Bot respondiendo en WhatsApp Sandbox de Twilio
- ✅ Link de Calendly integrado y clickable
- ✅ Server.js con SYSTEM_PROMPT profesional

---

## ⏳ FASE 2: PRÓXIMOS PASOS

### 2.1 DECISIONES DE NEGOCIO (Con tu esposa)

**RESPONDER:**
- [ ] Cuestionario de configuración (ver Fase 3)
- [ ] Definir precios finales por servicio
- [ ] Listar servicios que ofrece
- [ ] Listar servicios que quiere EVITAR

---

### 2.2 IMPLEMENTACIÓN TÉCNICA

**SEGURIDAD:**
- [ ] Regenerar API Key de Anthropic (LA ACTUAL FUE COMPARTIDA)
- [ ] Actualizar .env con nueva API Key

**TWILIO & WHATSAPP:**
- [ ] Crear número de WhatsApp Business para tu esposa
- [ ] Conectar número a Twilio
- [ ] Configurar webhook de Twilio

**SERVIDOR:**
- [ ] Desplegar bot en servidor AWS (o tu servidor)
- [ ] Verificar que responde correctamente

**CALENDLY:**
- [ ] Crear Calendly con horarios de tu esposa
- [ ] Obtener URL final de Calendly
- [ ] Actualizar link en SYSTEM_PROMPT

**TESTING:**
- [ ] Testing con números reales (no sandbox)
- [ ] Verificar que todos los mensajes llegan
- [ ] Verificar que links son clickables

---

### 2.3 MARKETING Y LANZAMIENTO

- [ ] Agregar bot a Bio de Instagram
- [ ] Publicar número en redes sociales
- [ ] Crear mensaje de bienvenida automático
- [ ] Monitorear y ajustar respuestas del bot

---

## 📝 FASE 3: PREGUNTAS PARA CONFIGURACIÓN

**Responde estas preguntas para personalizar el bot:**

### 3.1 INFORMACIÓN GENERAL

1. ¿Cuál es el nombre completo de tu despacho o empresa?
   Respuesta: ________________________________________________________________________

2. ¿En qué ciudades/regiones de España operas?
   Respuesta: ________________________________________________________________________

3. ¿Cuál es tu teléfono/email de contacto directo?
   Respuesta: ________________________________________________________________________

---

### 3.2 SERVICIOS QUE OFRECES

4. ¿Cuál es tu PRINCIPAL servicio o especialidad?
   Respuesta: ________________________________________________________________________

5. ¿Qué otros servicios ofreces? (marca todos los que apliquen)
   ☐ NIE
   ☐ TIE
   ☐ Arraigo Social
   ☐ Arraigo Laboral
   ☐ Arraigo Familiar
   ☐ Reagrupación Familiar
   ☐ Nacionalidad Española
   ☐ Homologación de Títulos
   ☐ Visados
   ☐ Otro: ________________________________________________________________________

---

### 3.3 SERVICIOS QUE QUIERES EVITAR

6. ¿Hay algún tipo de caso o cliente que NO quieras aceptar?
   Respuesta: ________________________________________________________________________
   ________________________________________________________________________

---

### 3.4 PRECIOS Y ESTRUCTURA

7. ¿Cuánto cobras por CONSULTA INICIAL? (en euros)
   Precio: € ________  |  Duración: _____ minutos

8. ¿Este precio se descuenta si el cliente contrata el proceso completo?
   ☐ Sí    ☐ No

9. TABLA DE PRECIOS - Complétala:

   SERVICIO                      PRECIO (€)
   Consulta Inicial              € _______
   NIE                           € _______
   TIE                           € _______
   Arraigo Social                € _______
   Arraigo Laboral               € _______
   Arraigo Familiar              € _______
   Reagrupación Familiar         € _______
   Nacionalidad Española         € _______
   Homologación de Títulos       € _______
   Otro servicio:                € _______

---

### 3.5 FLUJO DE CONVERSACIÓN

10. ¿Cuántos mensajes máximo antes de ofrecer la consulta?
    Respuesta: _____ mensajes

11. ¿Hay alguna pregunta OBLIGATORIA que hagas a todos los clientes?
    Respuesta: ________________________________________________________________________

12. ¿Qué tipo de clientes son tu OBJETIVO PRINCIPAL?
    Respuesta: ________________________________________________________________________

---

### 3.6 CALENDLY Y DISPONIBILIDAD

13. ¿Ya tienes una URL de Calendly?
    ☐ Sí: https://calendly.com/__________________________________
    ☐ No, la crearé el: _________________________________________

14. ¿Cuál es tu horario de disponibilidad?
    Lunes a Viernes: De _____ a _____ horas
    Sábado: De _____ a _____ horas  |  ☐ No trabajo sábado
    Domingo: De _____ a _____ horas  |  ☐ No trabajo domingo

---

### 3.7 TONO Y PERSONALIDAD

15. ¿Cómo quieres que el bot se comunique?
    ☐ Formal y profesional (sin emojis)
    ☐ Amigable con emojis
    ☐ Directo y conciso

16. ¿Incluir tu nombre/foto en la primera respuesta?
    ☐ Sí  /  ☐ No    |  Nombre: _________________________

---

### 3.8 MÉTRICAS Y SEGUIMIENTO

17. ¿A qué email quieres recibir notificaciones?
    Respuesta: ________________________________________________________________________

18. ¿Quieres reportes de conversaciones para mejorar el bot?
    ☐ Sí, reportes semanales
    ☐ Sí, reportes mensuales
    ☐ No, no necesito reportes

---

## ⚠️ IMPORTANTE - SEGURIDAD

TU API KEY ACTUAL ESTÁ COMPROMETIDA

ACCIÓN INMEDIATA REQUERIDA:
1. Ve a: https://platform.claude.com/settings
2. Busca "API Keys"
3. Elimina la key actual
4. Crea una NUEVA key
5. Reemplaza en tu .env
6. Reinicia el bot

---

Documento: 14 de Mayo de 2026
Completado por: _______________________________

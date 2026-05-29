# 📋 HANDOFF DOCUMENT - Fácil Extranjería WhatsApp Bot

**Date:** May 29, 2026  
**Project:** WhatsApp Bot for Fácil Extranjería  
**Status:** Phase 1-3 Complete | Phase 4-5 Pending  
**Owner:** Cesar & Asmaa

---

## 🎯 PROJECT OVERVIEW

**Objective:** Automate client intake and qualification for Fácil Extranjería (immigration law consultation service) via WhatsApp using Claude AI + Twilio integration.

**Current Implementation:** 3-message conversational flow that:
- Collects client information systematically
- Filters clients by economic capacity and legal status
- Schedules consultations or flags for internal review
- Provides personalized pricing and service details

**Tech Stack:**
- Backend: Node.js + Express.js
- AI Engine: Claude Sonnet 4.6 (Anthropic API)
- Messaging: Twilio WhatsApp
- Configuration: Environment variables (.env)

---

## ✅ COMPLETED (PHASES 1-3)

### Phase 1: Business Configuration ✅
- **Completed by:** Asmaa (via checklist)
- **What:** Full business configuration captured
  - Company name: Fácil Extranjería
  - Location: Barcelona + Online
  - Phone: 654909792
  - Specialties: Student visas, NIE/TIE, Arraigo, Reagrupación, Nacionalidad
  - Availability: Mon-Fri 16:00-21:00, weekends flexible
  - Tone: Formal, professional, amigable, sin emojis

### Phase 2: Server Code Generation ✅
- **Completed:** Updated server.js with personalized configuration
- **SYSTEM_PROMPT:** Extended to ~250+ lines with:
  - Complete company information
  - Pricing table for 12 services (50€-850€)
  - 3-message structured conversation flow
  - 10 mandatory questions across 3 stages
  - Automatic client filtering logic
  - Business rules and decision trees

### Phase 3: Documentation ✅
- **4 Comprehensive Guides Created:**
  1. **FLUJO_CONVERSACION_EXACTO.md** - Exact conversation flow with examples
  2. **PLAN_IMPLEMENTACION_V2.md** - Full implementation plan + technical details
  3. **QUICK_START_GUIA.md** - 10-minute quick start guide
  4. **COMPARACION_CAMBIOS.md** - Before/after technical comparison

---

## 📊 CONVERSATION FLOW (3 MESSAGE STRUCTURE)

### MESSAGE 1: Bienvenida y Datos Iniciales
**When:** First client contact  
**Bot asks:**
1. **Datos:** Nombre completo, fecha de nacimiento, nacionalidad
2. **Ubicación:** ¿Estás en España o fuera? ¿Desde cuándo? ¿Situación actual?
3. **Antecedentes:** ¿Tuviste residencia anterior en España?
4. **Objetivo:** ¿Qué trámite exacto deseas realizar?

**Expected:** Client responds with all 4 answers

---

### MESSAGE 2: Preguntas de Refinamiento
**When:** After client responds to Message 1  
**Bot asks:**
1. **Familia:** ¿Tienes cónyuge/pareja/hijos españoles o comunitarios?
2. **Economía:** ¿Oferta de empleo/autónomo/estudiante/ahorros demostrables?
3. **Filtro Legal:** ¿Antecedentes penales últimos 5 años? ¿Prohibición de entrada?

**Expected:** Client responds with all 3 answers

---

### MESSAGE 3: Cierre con 2 Opciones
**When:** After client responds to Message 2  
**Bot evaluates client profile and chooses:**

#### OPCIÓN A: Cliente Válido (Agendar Consulta) ✅
**Criteria Met:**
- Capacidad económica clara (oferta, ahorros, apoyo familiar)
- Situación legal regular
- Sin antecedentes penales recientes
- Perfil típico para Fácil Extranjería

**Bot Response:**
```
Perfecto [NOMBRE], puedo ayudarte con [TIPO DE TRÁMITE].

El proceso incluye:
- Asesoría legal completa
- Gestión de documentación
- Seguimiento hasta resolución
- Inversión aproximada: [PRECIO SEGÚN TABLA]

CONSULTA INICIAL: 50-75€ (60 minutos)
La consulta se descuenta si contratas el proceso.

Disponemos de horarios:
- Lunes a Viernes: 16:00 a 21:00
- Fines de semana: flexible

Agendemos aquí:
https://calendly.com/facilextranjeria-info/30min
```

#### OPCIÓN B: Cliente Requiere Validación 📋
**Criteria Met:**
- Dudas sobre viabilidad
- Capacidad económica incierta
- Antecedentes penales recientes (últimos 5 años)
- Perfil no típico o muy irregular

**Bot Response:**
```
Gracias por la información [NOMBRE]. Tu caso requiere 
revisión más detallada por parte de nuestros abogados.

Te contactaremos en las próximas 24 horas para validar 
la viabilidad de tu tramitación y ofrecerte un plan 
personalizado.

¿Tu número está actualizado? 654909792
```

---

## 💰 PRICING TABLE (Embedded in Bot)

| Service | Price |
|---------|-------|
| Consulta Inicial | 50-75€ |
| NIE / TIE | 150-200€ |
| Arraigo Social / Laboral / Familiar | 600-800€ |
| Reagrupación Familiar | 700€ |
| Nacionalidad Española | 850€ |
| Modificación Visa Estudiante → Trabajo | 650-700€ |
| Visados | 600-850€ |
| Renovación de Visados | 150€ |
| Regulación Extraordinaria | 300€ |
| Homologación de Títulos | Bajo consulta |

---

## ⏳ REMAINING TASKS (PHASES 4-5)

### 🔴 CRITICAL - IMMEDIATE ACTION

**Task 1: API Key Regeneration (SECURITY ISSUE)**
- **Why:** Previous API key was shared in conversation and is COMPROMISED
- **Action Required:**
  1. Go to: https://console.anthropic.com/account/keys
  2. Delete old key
  3. Create new key (appears once only - COPY IT)
  4. Update .env file: `ANTHROPIC_API_KEY=sk-ant-v4-xxxxx`
  5. Save .env file
  6. Restart server: `node server.js`

- **Timeframe:** URGENT (within 24 hours)
- **Owner:** Cesar

---

**Task 2: Server Implementation & Testing**
- **Action Required:**
  1. Verify server.js is in `/Users/cesarbiojo/Documents/proyectos/Bot-extranjeria/`
  2. Ensure .env has new API key
  3. Run: `cd /Users/cesarbiojo/Documents/proyectos/Bot-extranjeria && node server.js`
  4. Test WhatsApp message: Send "Hola, necesito un NIE"
  5. Verify 3-message flow completes successfully

- **Success Criteria:**
  - ✅ Server logs show "Servidor corriendo en puerto 3001"
  - ✅ Receives Message 1 with 4 questions
  - ✅ Receives Message 2 with 3 questions
  - ✅ Receives Message 3 with pricing and Calendly link
  - ✅ Response time < 5 seconds
  - ✅ All text displays correctly in WhatsApp

- **Timeframe:** 1-2 hours after API key regeneration
- **Owner:** Cesar
- **Evidence:** Screenshots of full 3-message conversation in WhatsApp

---

### Phase 4: Google Drive Automation (PENDING)
- **Objective:** Automatically create client folders when consultation is scheduled
- **Implementation:**
  - Create "Clientes Fácil Extranjería" folder in Google Drive
  - Structure: `/Nombre_Cliente/Documentación/`
  - Trigger: When client books consultation via Calendly
  - Action: Generate folder + send email with upload link to client

- **Scope:**
  - Google Drive API integration
  - Calendly webhook connection
  - Automated email notification
  - File organization system

- **Timeframe:** After Phase 3 validation
- **Estimated Effort:** 4-6 hours
- **Owner:** TBD

---

### Phase 5: Email Automation (PENDING)
- **Objective:** Automate client communication throughout the process
- **Components:**
  1. Automated responses to inquiry emails
  2. Document request emails (with checklist)
  3. Status update emails
  4. Monthly reporting to Asmaa/Marta

- **Scope:**
  - Email template system
  - Automatic routing based on client type
  - Document tracking
  - Report generation

- **Timeframe:** After Phase 4 completion
- **Estimated Effort:** 6-8 hours
- **Owner:** TBD

---

## 📁 FILE STRUCTURE

```
/Users/cesarbiojo/Documents/proyectos/Bot-extranjeria/
├── server.js                          ✅ UPDATED (Main bot server)
├── .env                               ⚠️ NEEDS NEW API KEY
├── package.json                       ✅ No changes needed
├── node_modules/                      ✅ Already installed
│
└── DOCUMENTATION/ (All in outputs folder, move to project)
    ├── HANDOFF.md                     ✅ This document
    ├── FLUJO_CONVERSACION_EXACTO.md   ✅ Conversation examples
    ├── PLAN_IMPLEMENTACION_V2.md      ✅ Full implementation plan
    ├── QUICK_START_GUIA.md            ✅ 10-minute quick start
    ├── COMPARACION_CAMBIOS.md         ✅ Before/after comparison
    └── server_updated.js              ✅ Updated server code
```

---

## 📝 CHECKLIST FOR NEXT PERSON

### Pre-Implementation
- [ ] Review this HANDOFF.md document completely
- [ ] Review QUICK_START_GUIA.md for step-by-step instructions
- [ ] Understand 3-message conversation flow (see FLUJO_CONVERSACION_EXACTO.md)
- [ ] Have Anthropic console access

### Implementation Phase (URGENT)
- [ ] Regenerate API key at console.anthropic.com
- [ ] Copy new key
- [ ] Update .env with new key
- [ ] Verify server.js is current version
- [ ] Restart Node.js server
- [ ] Test with WhatsApp message
- [ ] Verify 3-message flow works
- [ ] Document successful test (screenshots)

### Testing Phase
- [ ] Test OPCIÓN A path (valid client)
  - [ ] Send complete client data
  - [ ] Verify pricing appears correctly
  - [ ] Verify Calendly link is clickable
  - [ ] Confirm booking works
  
- [ ] Test OPCIÓN B path (requires review)
  - [ ] Send client with antecedents
  - [ ] Verify "revisión interna" message appears
  - [ ] Confirm phone number displays correctly
  
- [ ] Test edge cases
  - [ ] Very incomplete responses
  - [ ] Multiple conversations simultaneously
  - [ ] Response times under load

### Validation Checklist
- [ ] Bot responds in < 5 seconds
- [ ] Messages format correctly in WhatsApp
- [ ] No emoji display issues
- [ ] Calendly link is clickable and shows correct hours
- [ ] Pricing matches table
- [ ] All questions appear correctly
- [ ] State tracking works (correct message sequence)
- [ ] Console logs show proper flow

---

## 🔧 TROUBLESHOOTING QUICK REFERENCE

| Issue | Solution |
|-------|----------|
| "API key not found" error | Check .env has `ANTHROPIC_API_KEY=sk-ant-v4-xxxxx` |
| "Connection refused port 3001" | Kill existing process: `lsof -i :3001` then `kill -9 [PID]` |
| Bot not responding in WhatsApp | Verify Twilio webhook, check server logs, restart server |
| Messages arriving late (>10 sec) | Normal on localhost (2-3 sec); will improve on cloud deployment |
| Emoji display issues | Ensure .env encoding is UTF-8, check TwiML response formatting |
| Calendly link not clickable | Verify exact URL in SYSTEM_PROMPT, check WhatsApp link handling |

---

## 📞 KEY CONTACTS & INFO

**Company Details:**
- Name: Fácil Extranjería
- Phone: 654909792
- Location: Barcelona (presencial) + Online
- Contact Person: Asmaa & Marta (for internal review cases)

**Calendly Link:** https://calendly.com/facilextranjeria-info/30min

**Anthropic API Console:** https://console.anthropic.com/account/keys

---

## 📈 SUCCESS METRICS (Phase 1-3)

**What Good Looks Like:**
- ✅ Bot reaches clients automatically via WhatsApp
- ✅ Clients complete all 3 messages within 5-10 minutes
- ✅ Valid clients (OPCIÓN A) receive Calendly link and book consultations
- ✅ Questionable clients (OPCIÓN B) are flagged for Asmaa/Marta review
- ✅ 60-70% conversion to consultation booking
- ✅ Zero manual data entry for qualified leads

**Measurement:**
- Track conversation completions per day
- Track OPCIÓN A vs OPCIÓN B split
- Track Calendly booking rate
- Monitor response times
- Collect client feedback on bot experience

---

## 🚀 NEXT PHASE SEQUENCE

```
1. IMMEDIATE (Today)
   └─ Regenerate API key + Restart server
   └─ Test with WhatsApp
   
2. VALIDATION (Tomorrow)
   └─ Run full test suite
   └─ Document success
   └─ Get Asmaa/Marta sign-off
   
3. PHASE 4 (Week 2)
   └─ Implement Google Drive automation
   └─ Test folder creation
   └─ Verify email notifications
   
4. PHASE 5 (Week 3)
   └─ Implement email automation
   └─ Set up templates
   └─ Configure monthly reports
   
5. PRODUCTION (Week 4)
   └─ Deploy to cloud (AWS/Heroku)
   └─ Migrate from localhost
   └─ Full production testing
```

---

## 📎 ADDITIONAL RESOURCES

**Documentation Files (All in outputs folder):**
1. **FLUJO_CONVERSACION_EXACTO.md** - Exact message text with 3 complete examples
2. **PLAN_IMPLEMENTACION_V2.md** - Detailed technical implementation plan
3. **QUICK_START_GUIA.md** - Step-by-step 10-minute guide
4. **COMPARACION_CAMBIOS.md** - Technical before/after comparison

**Code Files:**
- `server_updated.js` - The updated bot server code
- `.env` - Environment configuration (needs new API key)

---

## ✍️ NOTES FOR NEXT PERSON

**Key Points to Remember:**
1. **This bot is personalized** - Every response reflects Fácil Extranjería's business rules, pricing, and workflow
2. **3-message structure is critical** - The bot must progress through exactly 3 structured messages before offering consultation
3. **Client filtering is automatic** - The AI evaluates capacity + legal status and routes to OPCIÓN A or B appropriately
4. **API key is security-sensitive** - Never commit to Git, never share, regenerate if suspected compromise
5. **Asmaa/Marta handle OPCIÓN B** - All questionable cases are flagged for internal review within 24 hours
6. **Calendly integration is key** - The booking link must work perfectly for conversions

---

**Document Status:** ✅ READY FOR HANDOFF  
**Last Updated:** May 29, 2026  
**Ready for Implementation:** YES  

---

*For questions or clarifications, refer to the documentation files or the Anthropic API documentation at https://docs.claude.com*


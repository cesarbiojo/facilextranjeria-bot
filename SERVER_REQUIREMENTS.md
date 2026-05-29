# 🖥️ SERVER REQUIREMENTS - Fácil Extranjería WhatsApp Bot

**Project:** Fácil Extranjería WhatsApp Bot  
**Date:** May 29, 2026  
**Purpose:** Technical specifications for cloud deployment (AWS or similar)

---

## 📋 QUICK SUMMARY

| Category | Requirement |
|----------|------------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js |
| **Memory (RAM)** | 512MB - 1GB minimum |
| **CPU** | 1 vCPU (t3.micro/t3.small) sufficient for MVP |
| **Storage** | 5-10GB (OS + dependencies + logs) |
| **Database** | Required for production (conversation persistence) |
| **Concurrent Users** | 10-100 simultaneous conversations |
| **HTTPS** | REQUIRED (Twilio webhooks need SSL) |
| **Uptime SLA** | 99.5%+ recommended |
| **Scalability** | Can start small, auto-scale as needed |

---

## 🔧 TECHNICAL SPECIFICATIONS DETAILED

### 1️⃣ COMPUTE (CPU & MEMORY)

**Minimum Viable Product (MVP) Phase:**
```
CPU:    1 vCPU (burstable OK)
RAM:    512MB - 1GB
Type:   t3.micro or t3.small (AWS)
```

**Why This Is Sufficient:**
- Current usage: ~20-50MB per active conversation
- Express.js is lightweight
- AI calls are handled by Anthropic (external)
- Twilio webhooks are simple request/response
- Expected traffic: < 50 concurrent conversations initially

**Upgrade Path:**
- t3.small → t3.medium (if concurrent users exceed 100)
- t3.medium → t3.large (if concurrent users exceed 500)

**Alternative:** Auto-scaling group with 2-3 t3.micro instances

---

### 2️⃣ STORAGE

**Root Volume:**
```
Type:     SSD (gp3 recommended)
Size:     20-30GB
```

**Breakdown:**
- OS (Ubuntu/Amazon Linux): 5-8GB
- Node.js + dependencies: 500MB
- Application code: 50MB
- Logs (rotated): 2-5GB
- Buffer/headroom: 5-10GB

**Log Management:**
- CloudWatch Logs (AWS native)
- Log rotation policy: 30 days
- Don't store on disk long-term

---

### 3️⃣ DATABASE (CRITICAL FOR PRODUCTION)

**Current Issue:**
- Bot stores conversations in memory (`conversaciones = {}`)
- Data lost on server restart
- NO persistence between deployments
- NOT suitable for production

**Production Requirement - Choose One:**

#### Option A: PostgreSQL (RECOMMENDED)
```
Type:     AWS RDS PostgreSQL
Size:     db.t3.micro (1GB RAM)
Storage:  20GB (SSD)
Backup:   Automated daily
Cost:     ~$15-30/month

What to store:
- Conversation history (messages, timestamps)
- Client profiles (phone, name, stage)
- Conversation state (message 1/2/3 progress)
- Booking status & Calendly link
```

#### Option B: MongoDB (if JSON preferred)
```
Type:     AWS DocumentDB or MongoDB Atlas
Size:     Shared tier starter
Storage:  20GB
Backup:   Automatic
Cost:     ~$10-25/month
```

#### Option C: DynamoDB (Serverless)
```
Type:     AWS DynamoDB
Storage:  On-demand pricing
Cost:     Pay per request (~$0.25/1M reads)
Best for: Variable/unpredictable traffic
```

**My Recommendation:** PostgreSQL RDS (best balance of cost, reliability, simplicity)

---

### 4️⃣ RUNTIME & DEPENDENCIES

**Node.js Version:**
```
Minimum: Node 18 LTS
Recommended: Node 20 LTS
```

**Package Dependencies (from package.json):**
```json
{
  "dependencies": {
    "express": "^4.x",           // Web framework
    "body-parser": "^1.x",       // Request parsing
    "@anthropic-ai/sdk": "^0.x", // Claude API client
    "dotenv": "^16.x"            // Environment config
  }
}
```

**Installation:**
```bash
npm install  # ~150MB with node_modules
```

---

### 5️⃣ NETWORKING & SECURITY

**HTTPS/SSL (MANDATORY):**
```
Requirement:  TLS 1.2+
Provider:     AWS Certificate Manager (free)
Auto-renew:   Yes
Needed for:   Twilio webhooks require HTTPS
```

**Firewall Rules (Security Groups):**
```
Inbound:
  - Port 443 (HTTPS) from 0.0.0.0/0
  - Port 80 (HTTP, redirect to HTTPS) from 0.0.0.0/0
  
Outbound:
  - Port 443 to 0.0.0.0/0 (for Anthropic API calls)
  - Port 443 to 0.0.0.0/0 (for Twilio calls)
  - Port 5432 to RDS instance (if using DB)

Closed:
  - SSH (port 22) - use Systems Manager Session Manager instead
```

**Environment Security:**
```
.env file MUST contain:
  - ANTHROPIC_API_KEY (keep safe, rotate regularly)
  - Any future credentials (Twilio, Google Drive, email)

Method:
  - Use AWS Secrets Manager or Parameter Store
  - Never commit .env to GitHub
  - Rotate API keys quarterly
```

---

### 6️⃣ PERFORMANCE SPECIFICATIONS

**Response Time Target:**
```
Twilio webhook call → Bot response: < 5 seconds
Ideal:                              < 2 seconds
Current (localhost):                2-3 seconds
Cloud:                              2-4 seconds (acceptable)
```

**Concurrent Connection Capacity:**
```
MVP Phase:       10-20 simultaneous
Growth Phase:    50-100 simultaneous
Scale Phase:     200+ simultaneous (requires upgrade)
```

**Request Volume Estimate:**
```
Initial:  ~50 conversations/day
Growth:   ~500 conversations/day (1 month)
Scale:    ~5,000 conversations/day (6 months)

Requests/month: 50 users × 3 messages = 150 API calls
In practice:    ~150-300 requests/day
```

---

### 7️⃣ EXTERNAL API INTEGRATIONS

**1. Anthropic Claude API**
```
Calls: 1 per client message
Latency: 1-3 seconds (external)
Quota: Check Anthropic limits
Cost: Based on token usage (~$0.001-0.01 per call)
```

**2. Twilio WhatsApp**
```
Inbound: Webhook delivers client messages
Outbound: Bot sends responses
Protocol: HTTPS POST
Endpoint: /whatsapp on your server
Cost: ~$0.0075 per message (SMS-like rates)
```

**3. Google Drive API (Phase 4)**
```
Not yet implemented
When added: Will need OAuth2 credentials
Storage quota: Google account limits
```

**4. Email Service (Phase 5)**
```
Not yet implemented
When added: SendGrid, AWS SES, or similar
Cost: ~$10-50/month depending on volume
```

---

### 8️⃣ MONITORING & LOGGING

**Essential Metrics to Track:**
```
Application:
  - Response times (p50, p95, p99)
  - Error rate %
  - Conversation completion rate
  - Message/day throughput

Infrastructure:
  - CPU usage %
  - Memory usage %
  - Disk space %
  - Network in/out

Business:
  - Conversations started/completed
  - OPCIÓN A vs OPCIÓN B split (%)
  - Calendly booking rate
```

**Logging Tools:**
```
Development:  Console.log (current)
Production:   AWS CloudWatch Logs
             - Structured JSON logging recommended
             - Log rotation: 30 days
             - Cost: ~$0.50/GB
```

**Monitoring Tools:**
```
CloudWatch Alarms for:
  - CPU > 80%
  - Memory > 90%
  - Disk > 90%
  - Error rate > 5%
  - Response time > 5 seconds
```

---

## 💰 ESTIMATED MONTHLY COSTS (AWS)

### Minimal Setup (MVP)
```
Compute (EC2 t3.micro):        ~$8
Storage (20GB):                ~$2
Database (RDS t3.micro):       ~$20
Data transfer (Twilio/API):    ~$5
CloudWatch Logs:               ~$2
SSL Certificate:               Free

TOTAL:                         ~$37/month
```

### Growth Setup (50+ concurrent users)
```
Compute (EC2 t3.small):        ~$20
Storage (30GB):                ~$3
Database (RDS t3.small):       ~$35
Data transfer:                 ~$10
CloudWatch:                    ~$5
CloudFront (optional):         ~$0-20

TOTAL:                         ~$73/month
```

### Scale Setup (200+ concurrent users)
```
Compute (Auto-scale 2x t3.small): ~$40
Storage (50GB):                   ~$5
Database (RDS t3.medium):         ~$65
Data transfer:                    ~$30
Monitoring/Logging:               ~$20

TOTAL:                            ~$160/month
```

---

## 🏗️ RECOMMENDED AWS ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│                    Internet (HTTPS)                      │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                   AWS Route 53 (DNS)                     │
├─────────────────────────────────────────────────────────┤
│              AWS Application Load Balancer               │
│                   (Port 443 SSL/TLS)                     │
├─────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────┐  │
│  │  EC2 Instance (t3.small)                          │  │
│  │  - Node.js 20                                     │  │
│  │  - Express.js server                             │  │
│  │  - Running on port 3001                          │  │
│  │  - Security Group allows 443 inbound             │  │
│  └───────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────┐  │
│  │  RDS PostgreSQL (db.t3.micro)                    │  │
│  │  - Conversation history                          │  │
│  │  - Client profiles                               │  │
│  │  - Booking data                                  │  │
│  │  - Automated backups                             │  │
│  └───────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────┐  │
│  │  CloudWatch Logs & Alarms                        │  │
│  │  - Real-time monitoring                          │  │
│  │  - Error tracking                                │  │
│  │  - Performance metrics                           │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
         ↓                                  ↓
    Anthropic API                    Twilio (Webhooks)
    (Claude calls)                   (Messages in/out)
```

---

## ✅ DEPLOYMENT CHECKLIST

**Pre-Deployment:**
- [ ] .env file with new API key
- [ ] Database schema created (conversation tables)
- [ ] Environment variables set in AWS
- [ ] SSL certificate installed
- [ ] Twilio webhook URL updated to new domain
- [ ] Calendly integration verified
- [ ] Logging configured

**Post-Deployment:**
- [ ] Health check endpoint working
- [ ] Test WhatsApp message sent/received
- [ ] 3-message flow completes
- [ ] Database saving conversations
- [ ] CloudWatch logging enabled
- [ ] Alerts configured
- [ ] DNS propagated (may take 24h)

---

## 🔄 UPGRADE PATH

```
Month 1-2: MVP
  └─ EC2 t3.micro
  └─ RDS t3.micro
  └─ ~50 conversations/day
  
Month 3-4: Early Growth
  └─ EC2 t3.small
  └─ RDS t3.small
  └─ ~500 conversations/day
  
Month 5-6: Growth Phase
  └─ Auto-scaling (2-3 instances)
  └─ RDS multi-AZ
  └─ ~5000 conversations/day
  
Month 6+: Scale
  └─ Load balancer + multiple EC2
  └─ RDS with read replicas
  └─ CDN for static assets
  └─ Separated microservices
```

---

## 📊 KEY SPECS AT A GLANCE

```
┌──────────────────────────────────────────────────────┐
│ FÁCIL EXTRANJERÍA WHATSAPP BOT - REQUIREMENTS        │
├──────────────────────────────────────────────────────┤
│ Runtime:              Node.js 18+ LTS                │
│ Framework:            Express.js                     │
│ Memory (RAM):         512MB - 2GB                    │
│ CPU:                  1-2 vCPU                       │
│ Storage:              20-30GB SSD                    │
│ Database:             PostgreSQL RDS                │
│ Concurrent Users:     10-100 (MVP), scale to 1000+  │
│ HTTPS/SSL:            Required                      │
│ Uptime:               99.5%+                        │
│ Latency Target:       < 5 seconds                   │
│ Starting Cost:        ~$37/month                    │
│ Estimated Traffic:    150-300 requests/day (MVP)   │
│ Growth Projection:    5000+ requests/day (6mo)      │
└──────────────────────────────────────────────────────┘
```

---

## 🎯 RECOMMENDATION FOR AWS

**For this specific project, I recommend:**

```
TIER 1: MVP Phase (First 2 months)
├─ Compute:    EC2 t3.micro (or t3.small for safety)
├─ Memory:     1GB RAM
├─ Storage:    20GB gp3 SSD
├─ Database:   RDS PostgreSQL t3.micro
├─ Network:    AWS Certificate Manager (SSL)
├─ Load Bal:   None (single instance OK)
└─ Cost:       ~$37-50/month

TIER 2: Growth Phase (Month 3-6)
├─ Compute:    EC2 t3.small
├─ Database:   RDS t3.small with multi-AZ
├─ Add:        Auto-scaling policy (scale to 2x if CPU > 70%)
├─ Add:        CloudFront CDN (optional)
└─ Cost:       ~$75-100/month

TIER 3: Scale Phase (Month 6+)
├─ Compute:    2-4 EC2 t3.small/medium (auto-scaling)
├─ Database:   RDS t3.medium with read replicas
├─ Add:        Application Load Balancer
├─ Add:        Separate microservices (if needed)
└─ Cost:       ~$150-250/month
```

---

## 🔗 NEXT STEPS

1. **Collect specs from other projects** using this template
2. **Compare cumulative requirements** across all projects
3. **Ask Claude:** "Given these requirements from X projects, what's the best AWS setup to run all of them together?"
4. **Evaluate consolidation options:**
   - Single larger instance with multiple apps
   - Containerized setup (Docker + ECS)
   - Serverless architecture (Lambda + API Gateway)
   - Kubernetes cluster (EKS)

---

**Document Status:** ✅ READY FOR ANALYSIS  
**Last Updated:** May 29, 2026


# 🧠 SynapseMind
### AI-Powered Unified Messaging & Intelligence Platform  
**Assignment Submission – Dailyfix Challenge**

SynapseMind is a production-grade, AI-driven messaging intelligence system built on **Matrix Synapse**, designed to unify social media conversations (LinkedIn, Instagram, WhatsApp) and extract actionable insights using modern NLP and LLM techniques.

This project demonstrates full-stack expertise across **cloud infrastructure, real-time messaging, reverse proxying, frontend systems, and applied AI**.

---

## 🚀 Key Features

### 🔗 Unified Messaging Infrastructure
- Matrix Synapse homeserver deployed on **AWS EC2 (Free Tier)**
- Social media bridging via **Mautrix (LinkedIn / Instagram / WhatsApp)**
- Secure domain routing using **DuckDNS + NGINX**
- Real-time message sync into Matrix rooms

### 🖥️ Web Dashboard (Next.js)
- Secure Matrix authentication
- Live room & message visualization
- Real-time updates via Matrix timelines
- Clean, production-ready UI

### 🧠 AI Intelligence Layer
- **Conversation Summarization** (Hugging Face Transformers)
- **Daily Conversation Reports**
- **Conversation Prioritization**
- **Intent Parsing & NLP Analysis**
- **Knowledge Base Generation**
- **Vector Storage & Retrieval (FAISS / Pinecone ready)**
- Modular architecture for future **LLM fine-tuning**

---

### Infrastructure
- AWS EC2 (Free Tier)
- Ubuntu 22.04
- Docker + systemd
- NGINX Reverse Proxy
- DuckDNS Domain
- TLS via Let’s Encrypt

### Messaging
- Matrix Synapse
- Element Client
- Mautrix Bridges (LinkedIn / Instagram / WhatsApp)

### Frontend
- Next.js (React)
- TypeScript
- Tailwind CSS
- matrix-js-sdk

### AI / NLP
- FastAPI
- Hugging Face Transformers
- spaCy / BERT (intent parsing)
- FAISS / Pinecone (vector storage)
- LLM-ready architecture

---

## 🛠️ Task Breakdown & Implementation

### 1️⃣ Infrastructure Setup
- Deployed EC2 Free Tier instance
- Configured Docker & systemd services
- Installed and configured Matrix Synapse
- Secured server using domain + HTTPS

### 2️⃣ Bridge Configuration
- Integrated Mautrix social media bridge
- Linked real social media accounts
- Verified real-time chat sync into Matrix

### 3️⃣ Reverse Proxy & Domain
- Configured NGINX for:
  - Matrix APIs
  - AI Backend
  - Frontend
- DuckDNS for public access
- Enforced HTTPS routing

### 4️⃣ Frontend Development
- Built Next.js dashboard
- Matrix login via credentials
- Real-time room/message display
- AI insights rendered per room

### 5️⃣ AI Feature Implementation
- **Daily Reports**: Per-day conversation summaries
- **Summarization**: Hugging Face summarization models
- **Prioritization**: Context-based message ranking
- **Knowledge Base**: Structured extraction from chats
- **Vector Search**: Embedding storage & retrieval
- **Intent Parsing**: NLP-based intent classification
- **LLM-Ready**: Fine-tuning architecture included

### 6️⃣ Testing & Validation
- Tested using Element client
- Verified bridge message sync
- Validated AI outputs
- Load-tested summarization & vector search
- UI functional & responsive

---

## ✅ Evaluation Criteria Mapping

| Requirement | Status |
|------------|-------|
Matrix Synapse Deployment | ✅ Completed |
Bridge Integration | ✅ Functional |
AI Summarization | ✅ Implemented |
Conversation Prioritization | ✅ Implemented |
Knowledge Base Generation | ✅ Implemented |
Vector Storage & Retrieval | ✅ Ready |
Intent Parsing | ✅ Implemented |
LLM Fine-tuning Support | ✅ Architecture Ready |
Frontend UI | ✅ Completed |
Testing & Validation | ✅ Verified |

---

## 📎 Submission Deliverables

- 🔗 **Deployed Matrix Homeserver**  
  `https://<joeldc.duckdns.org>`

- 🎥 **Demo / Loom Video**
  - Infrastructure walkthrough
  - Bridge sync demo
  - AI features demo
  - Frontend walkthrough

- 📄 **Timeline & Understanding Document**
  - Design decisions
  - AI pipeline explanation
  - Scaling considerations

---

## 🔮 Future Enhancements
- Multi-tenant support
- Chat-level LLM assistants
- Graph-based conversation analytics
- Enterprise SSO
- Kubernetes deployment
- Real-time alerting & dashboards

---

## 👨‍💻 Author
**Joel Chandanshiv**  
DevOps | AI Systems | Cloud Infrastructure  

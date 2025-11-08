# Chatbot de IA com RAG e Evolução API (WhatsApp)

Este projeto entrega um sistema completo de assistente de IA conversacional, conforme os requisitos. Foi uma jornada intensa de depuração, mas o resultado é uma arquitetura robusta e moderna.

## Resumo das Funcionalidades Entregues

| Item | Status | O que Faz |
| :--- | :--- | :--- |
| **1.** | Concluído | **Painel de Configurações:** Permite o controle total (API Key Open Router, Modelo LLM, System Prompt) com persistência no Supabase. |
| **2.** | Concluído | **RAG - Sistema de Documentos:** Backend para ingestão (upload de PDF/TXT), processamento (chunking com LangChain), geração de embeddings e armazenamento seguro no Supabase (`pgvector`). |
| **3.** | Concluído | **Integração WhatsApp:** Webhook (`/api/webhook/whatsapp`) pronto para receber mensagens da Evolution API, disparar a IA/RAG e responder ao usuário. |
| **4.** | Concluído | **Interface de Teste:** Componente de chat (`/components/TestChat.tsx`) funcional para validar a lógica da IA/RAG e o histórico de conversas. |
| **5/6.** | Concluído | **Arquitetura e Deploy:** Stack React/TypeScript/Vercel API Routes implementada e funcionando na nuvem. |

## Arquitetura (O Coração do Projeto)

* **Frontend (React/TS):** Usa o padrão moderno `@tanstack/react-query` para gerenciar o estado assíncrono (carregamento e salvamento de dados), garantindo uma experiência de usuário fluida.
* **Backend (Node/Vercel):** Centraliza a inteligência no `/api/chat.ts`, que executa a **busca vetorial** no Supabase e constrói o prompt para o Open Router.

## Uma Nota Sincera sobre a Jornada

O desenvolvimento encontrou desafios significativos (conflitos de biblioteca do React Query e problemas de cache do Vercel CLI), que consumiram um tempo precioso na depuração.

No entanto, esses obstáculos garantiram que o código final seja **extremamente robusto e limpo**. Cada erro superado resultou em um sistema mais sólido.

---
*Para uma visão completa de todos os desafios técnicos superados, consulte o arquivo **PROCESSO.md**.*
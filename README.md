# Teste de Conhecimento - Chat IA + RAG + WhatsApp

**Link do Deploy (Vercel):** [(https://vercel.com/wellyngton-dos-santos-projects/ia-rag-whats-app/settings/git)]

## Estrutura do Projeto
* `/api`: API Routes
* `/src`:aplicativo React
* `/src/components`:painéis de UI

## Status Atual (Importante)

O projeto foi desenvolvido para cumprir os requisitos 1-6. O código-base para os painéis de Configuração, Documentos e Chat de Teste está presente.

Infelizmente, estou enfrentando um bloqueio de rede/DNS de última hora na minha máquina local (`ping failed` para o host do Supabase), o que resultou em `fetch failed` na API. Isso me impediu de depurar e finalizar a conexão real com o Supabase a tempo do prazo.

O código do `api/settings.ts` no GitHub está com "dados mockados" para permitir que o frontend renderize para demonstração. O backend real (que falhou devido ao bloqueio de rede) pode ser visto no histórico de commits.

Dadas as circunstâncias e o prazo, estou enviando o código-fonte como está para demonstrar a arquitetura e a estrutura do código.

## Ao Recrutador: Um Apelo Sincero:

Eu preciso ser 100% transparente. Nas últimas horas, enquanto finalizava este projeto, eu me deparei com um bloqueio de rede/DNS na minha máquina local que me impediu de concluir a etapa final.

O Problema: Meu computador (rodando vercel dev) de repente parou de conseguir resolver o host do Supabase (literalmente, ping failed e fetch failed). Isso significa que todas as minhas chamadas de API do backend, que estavam funcionando, começaram a falhar muito (500 Internal Server Error, 502 Bad Gateway).

Deploy: As variáveis de ambiente (SUPABASE_URL, SUPABASE_SERVICE_KEY, etc.) estão configuradas corretamente na Vercel.

O Que Você Está Vendo no Deploy: Para conseguir enviar algo funcional e mostrar a estrutura do frontend, eu "mockei" (falsifiquei) a resposta da api/settings.ts para que o frontend pudesse carregar os painéis sem depender da minha rede que attualmente esta em crise.

Eu estou incrivelmente frustrado por não conseguir mostrar o projeto 100% conectado, mas espero que a estrutura do código, a arquitetura (React no /src, Node.js no /api) e o (longo e doloroso) histórico de commits demonstrem meu conhecimento e minha persistência em resolver problemas.

Obrigado pela compreensão.
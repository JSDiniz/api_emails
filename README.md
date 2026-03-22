# API de Agendamentos

API REST desenvolvida em Node.js com TypeScript para gerenciar agendamentos de consultas médicas, integrando com Google Calendar e serviço de envio de emails.

## 📋 Funcionalidades

- ✅ Criar agendamentos de consultas
- 🗑️ Cancelar/deletar agendamentos
- 📅 Integração com Google Calendar para criar e deletar eventos automaticamente
- 📧 Envio de emails de confirmação para paciente e médico
- 📧 Envio de email de cancelamento para o médico
- 📍 Parse automático de endereços (rua, cidade, estado, CEP)
- 📊 Listagem de agendamentos futuros do calendário

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset JavaScript com tipagem estática
- **Express.js** - Framework web para Node.js
- **Google APIs (googleapis)** - Integração com Google Calendar
- **Resend** - Serviço de envio de emails transacionais
- **dotenv** - Gerenciamento de variáveis de ambiente
- **CORS** - Middleware para permitir requisições cross-origin

## 📁 Estrutura do Projeto

```
api_emails/
├── src/
│   ├── @types/           # Definições de tipos TypeScript customizados
│   ├── controllers/      # Controladores das rotas
│   │   ├── appointment/
│   │   │   ├── createAppointmentController.ts
│   │   │   ├── getAppointmentsController.ts
│   │   │   └── deleteAppointmentsController.ts
│   ├── routes/           # Definição das rotas da API
│   │   └── appointments.routes.ts
│   ├── services/         # Serviços de integração externa
│   │   ├── email/
│   │   │   └── emailService.ts      # Serviço de envio de emails (Resend)
│   │   └── appointment/
│   │       ├── createAppointmentService.ts
│   │       ├── getAppointmentsService.ts
│   │       └── deleteAppointmentsServices.ts
│   ├── utils/            # Funções utilitárias
│   │   ├── parseAddress.ts      # Parser de endereços
│   │   └── parseGoogleEvent.ts  # Parser de eventos do Google Calendar
│   └── server.ts         # Configuração do servidor Express
├── .env.example          # Exemplo de variáveis de ambiente
├── .gitignore           # Arquivos ignorados pelo Git
├── package.json         # Dependências e scripts do projeto
└── tsconfig.json        # Configuração do TypeScript
```

## 🚀 Como Funciona

### 1. Criação de Agendamento (POST /appointments)

Quando um novo agendamento é criado:

1. **Parse do Endereço**: A função `parseAddress` separa o endereço completo em componentes (rua, cidade, estado, CEP)
2. **Criação no Google Calendar**: O evento é criado automaticamente no calendário configurado
   - Duração padrão: 30 minutos
   - Timezone: America/Manaus
   - Descrição inclui todos os dados do paciente
3. **Envio de Emails**:
   - Email para o médico com os dados do agendamento
   - Email de confirmação para o paciente

### 2. Listagem de Agendamentos (GET /appointments)

Retorna os próximos 20 eventos agendados do Google Calendar, ordenados por data/hora.

### 3. Cancelamento de Agendamento (DELETE /appointments/:calendarId/:eventId)

Quando um agendamento é cancelado:

1. **Busca do Evento**: O sistema busca o evento no Google Calendar usando o `calendarId` e `eventId`
2. **Parse dos Dados**: Os dados do evento são parseados para o formato padrão
3. **Exclusão no Google Calendar**: O evento é removido do calendário
4. **Envio de Email**: Um email de cancelamento é enviado automaticamente para o médico com todas as informações do agendamento cancelado

## ⚙️ Configuração

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Conta no Google Cloud Platform (para Google Calendar API)
- Conta no Resend (para envio de emails)

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd api_emails
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas credenciais:

```env
# Resend API Key
RESEND_API_KEY=sua_chave_resend_aqui

# Email do médico
DOCTOR_EMAIL=contato@example.com

# Google Calendar API
GOOGLE_CLIENT_EMAIL=seu-service-account@projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSua chave privada aqui\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=seu-calendario-id@group.calendar.google.com
```

### Configuração do Google Calendar API

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API do Google Calendar
4. Crie uma Service Account
5. Baixe o arquivo JSON de credenciais
6. Extraia o `client_email` e `private_key` do JSON
7. Compartilhe o calendário desejado com o email da Service Account

### Configuração do Resend

1. Crie uma conta em [Resend](https://resend.com/)
2. Gere uma API Key
3. Configure o domínio de envio (ex: digimig.com.br)
4. Adicione a API Key no arquivo `.env`

## 🏃 Executando a Aplicação

### Modo Desenvolvimento

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

### Modo Produção

```bash
# Compilar TypeScript
npx tsc

# Executar
node dist/server.js
```

## 📡 Endpoints da API

### POST /appointments

Cria um novo agendamento.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "92 99999-9999",
  "service": "Consulta",
  "date": "2024-12-25",
  "time": "10:30",
  "message": "Mensagem opcional do paciente",
  "clinic": {
    "id": 2,
    "street": "Rua Exemplo",
    "number": "2615",
    "neighborhood": "Centro",
    "city": "Itacoatiara",
    "state": "AM",
    "zip": "69100-000"
  }
}
```

**Response (201):**
```json
{
  "message": "Agendamento realizado com sucesso para João Silva no endereço Rua Exemplo, 946, Centro, Manaus - AM, 69050-010.\nServiço: Consulta\nData: 25-12-2024 às 14:30.\nVocê receberá um e-mail com todas as informações do agendamento."
}
```

### GET /appointments

Lista os próximos agendamentos.

**Query Parameters (opcional):**
- `calendarId`: ID do calendário (padrão: "primary")

**Response (200):**
```json
[
  {
    "id": "event-id-123",
    "title": "Consulta - João Silva",
    "description": "Paciente: João Silva\nServiço: Consulta\n...",
    "start": "2024-12-25T14:30:00",
    "end": "2024-12-25T15:00:00"
  }
]
```

### DELETE /appointments/:calendarId/:eventId

Cancela/deleta um agendamento existente.

**Path Parameters:**
- `calendarId`: ID do calendário do Google Calendar (obrigatório)
- `eventId`: ID do evento a ser cancelado (obrigatório)

**Response (200):**
```json
{
  "message": "Evento event-id-123 deletado com sucesso"
}
```

**Response (400):**
```json
{
  "message": "calendarId e eventId são obrigatórios"
}
```

**Nota:** Ao cancelar um agendamento, o sistema:
- Remove o evento do Google Calendar
- Envia automaticamente um email de cancelamento para o médico com os detalhes do agendamento cancelado

## 🔧 Desenvolvimento

### Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento com hot-reload
- `npm test` - Executa os testes (a configurar)

### Estrutura de Código

- **Controllers**: Lógica de negócio e tratamento de requisições
- **Services**: Integrações com serviços externos (Google Calendar, Resend)
- **Routes**: Definição das rotas e middlewares
- **Utils**: Funções auxiliares reutilizáveis

## 📝 Notas de Implementação

- O parse de endereços espera o formato: `"Rua, Número - Bairro, Cidade - Estado - CEP"`
- Os eventos no Google Calendar têm duração fixa de 30 minutos
- O timezone está configurado para `America/Manaus`
- Os emails são enviados de forma assíncrona, não bloqueando a resposta da API
- Ao cancelar um agendamento, o evento é removido do Google Calendar e um email de notificação é enviado ao médico
- A rota de exclusão requer tanto o `calendarId` quanto o `eventId` como parâmetros da URL

## 🔒 Segurança

- ⚠️ **NUNCA** commite o arquivo `.env` no repositório
- Mantenha as credenciais do Google Calendar seguras
- Use variáveis de ambiente para todas as configurações sensíveis
- O arquivo `.gitignore` já está configurado para ignorar arquivos sensíveis

## 📄 Licença

ISC

## 👤 Autor

Junielson S. Diniz

Desenvolvedor responsável por toda a API de agendamentos, incluindo integração com Google Calendar, envio de emails e implementação das funcionalidades principais.

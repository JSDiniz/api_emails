# API de Agendamentos

API REST desenvolvida em Node.js com TypeScript para gerenciar agendamentos de consultas médicas, integrando com Google Calendar e serviço de envio de emails.

## 📋 Funcionalidades

- ✅ Criar agendamentos de consultas
- 📅 Integração com Google Calendar para criar eventos automaticamente
- 📧 Envio de emails de confirmação para paciente e médico
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
│   │   ├── createAppointmentController.ts
│   │   └── getAppointmentsController.ts
│   ├── routes/           # Definição das rotas da API
│   │   └── appointments.routes.ts
│   ├── services/         # Serviços de integração externa
│   │   ├── emailService.ts      # Serviço de envio de emails (Resend)
│   │   └── googleCalendar.ts    # Configuração do Google Calendar API
│   ├── utils/            # Funções utilitárias
│   │   └── parseAddress.ts      # Parser de endereços
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
  "phone": "(92) 99999-9999",
  "city": "Av. Djalma Batista, 946 - Nossa Sra. das Graças, Manaus - AM - 69050-010",
  "service": "Consulta",
  "date": "2024-12-25",
  "time": "14:30",
  "message": "Mensagem opcional do paciente"
}
```

**Response (201):**
```json
{
  "message": "Agendamento realizado com sucesso para João Silva no endereço Av. Djalma Batista, 946 - Nossa Sra. das Graças, Manaus - AM - 69050-010.\nServiço: Consulta\nData: 2024-12-25 às 14:30.\nVocê receberá um e-mail com todas as informações do agendamento."
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

## 🔒 Segurança

- ⚠️ **NUNCA** commite o arquivo `.env` no repositório
- Mantenha as credenciais do Google Calendar seguras
- Use variáveis de ambiente para todas as configurações sensíveis
- O arquivo `.gitignore` já está configurado para ignorar arquivos sensíveis

## 📄 Licença

ISC

## 👤 Autor

Desenvolvido para gerenciamento de agendamentos médicos.


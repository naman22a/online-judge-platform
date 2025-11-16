# Leetcode Microservices

> Coding practice platform

A full-featured competitive programming platform built with microservices architecture, featuring real-time code execution, contests, discussions, and comprehensive problem management.

## 🏗️ Architecture

This project uses a microservices architecture with 7 independent services communicating through an API Gateway.

![Architecture](./assets/architecture.png)

| Service Name            | Port | Description                             |
| ----------------------- | ---- | --------------------------------------- |
| **API Gateway**         | 5000 | Entry point, routing, WebSocket support |
| **Users Service**       | 5001 | User profiles and account management    |
| **Auth Service**        | 5002 | Authentication, JWT tokens, sessions    |
| **Problems Service**    | 5003 | Problem CRUD, metadata, difficulty      |
| **Tags Service**        | 5004 | Problem categorization and filtering    |
| **Companies Service**   | 5005 | Company tags and frequency tracking     |
| **Submissions Service** | 5006 | Code submission tracking and history    |
| **Execution Service**   | 5007 | Async code execution via BullMQ workers |

## ⚙️ Tech Stack

### Frontend

- Full-featured Next.js client
- Beautiful UI with shadcn/ui
- Problem-solving interface with Monaco Editor
- Live submission updates using Socket.IO
- Global state management with Zustand
- Fully typed with TypeScript
- Form handling with React Hook Form
- API interactions using Axios
- Tailwind CSS styling
- Day.js for handling timestamps and dates

### Backend

- NestJS (across all microservices)
- BullMQ queues
- Redis (queue broker)
- PostgreSQL (shared DB via Prisma)
- Socket.IO server (via API Gateway)
- JWT authentication
- Docker (execution container)

## ⚙️ Execution Pipeline

- User clicks "Submit" → Frontend sends code via WebSocket to API Gateway
- API Gateway → TCP request to Submission Service
- Submission Service → Publishes job to execution-queue (BullMQ)
- Execution Service → Consumes job from queue
- Execution Service → Runs code in sandboxed Docker container
- Workers → Return execution result
- Execution Service → Publishes result to results-queue
- Submission Service → Consumes result from queue
- Submission Service → Updates database with status/results
- Submission Service → Publishes notification to notifications-queue
- API Gateway → Consumes notification event
- API Gateway → Pushes real-time update through WebSocket to user's browser

## 🤝 Contributions

Contributions, issues, and suggestions are welcome! Feel free to fork the repository and submit pull requests.

## 📫 Stay in touch

- Author - [Naman Arora](https://namanarora.xyz)
- Twitter - [@naman_22a](https://x.com/naman_22a)

## 🗒️ License

Leetcode is [GPL V3](./LICENSE)

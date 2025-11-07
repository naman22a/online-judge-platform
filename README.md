# Leetcode Microservices

> Coding practice platform

A full-featured competitive programming platform built with microservices architecture, featuring real-time code execution, contests, discussions, and comprehensive problem management.

## 🏗️ Architecture

This project uses a microservices architecture with 12 independent services communicating through an API Gateway.

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
| **Test Cases Service**  | 5007 | Test case management (sample & hidden)  |
| **Editorials Service**  | 5008 | Official solutions and explanations     |
| **Contests Service**    | 5009 | Contest management and leaderboards     |
| **Discussion Service**  | 5010 | Comments, solutions, voting system      |
| **Bookmarks Service**   | 5011 | User's saved problems with notes        |
| **Code Execution**      | 5012 | Async code execution via BullMQ workers |

## ⚙️ Tech Stack

- Backend Framework: NestJS (TypeScript)
- Database: PostgreSQL (single database for simplicity)
- Cache and Queue: Redis (caching + BullMQ for job processing)
- Communication: HTTP/REST + TCP between services
- Code Execution: Sandboxed Docker containers

## 🚀 Features

### Core Features

- Problem solving with multiple programming languages
- Real-time code execution with test cases
- Difficulty levels (Easy, Medium, Hard)
- Problem tagging and categorization
- Company-specific problem tracking
- Submission history and statistics

### Community Features

- Discussion forum with nested comments
- Upvote/downvote system
- Solution sharing with code snippets
- Official editorials with complexity analysis

### User Features

- User authentication and profiles
- Problem bookmarking with personal notes
- Progress tracking (Solved/Attempted/Todo)
- User statistics and achievements

### Contest Features

- Timed programming contests
- Real-time leaderboards
- Contest participation tracking
- Ranking and scoring system

## 🤝 Contributions

Contributions, issues, and suggestions are welcome! Feel free to fork the repository and submit pull requests.

## 📫 Stay in touch

- Author - [Naman Arora](https://namanarora.xyz)
- Twitter - [@naman_22a](https://x.com/naman_22a)

## 🗒️ License

Leetcode is [GPL V3](./LICENSE)

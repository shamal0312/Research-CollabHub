# 🚀 Research CollabHub - Full Stack MERN Application (Dockerized)

Research CollabHub is a full-stack MERN platform for university students to create profiles, collaborate on projects, chat, manage tasks, and track contributions.  
This setup uses **Docker** to containerize backend and frontend for easy setup and deployment.

---

## 🛠️ Prerequisites

- Docker Desktop (includes Docker Compose)  
- Git  

> No need to install Node.js or MongoDB locally if using Docker.

---

## 🏃 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/shamal0312/Research-CollabHub.git
cd Research-CollabHub


2. Configure Environment Variables (.env)

Create .env files for backend and frontend (they are not pushed to GitHub for security).

Backend (backend/.env):

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000

Frontend (frontend/.env):

VITE_API_URL=http://localhost:5000/api
3. Run the Application with Docker
docker-compose up --build

Once built:

Backend API: http://localhost:5000

Frontend: http://localhost:5173

Docker automatically installs dependencies and runs backend + frontend in separate containers.

📁 Project Structure
Research-CollabHub/
│
├── backend/       # Node.js + Express API
├── frontend/      # React (Vite) Frontend
├── docker-compose.yml  # Docker orchestration
└── README.md      # This file
🤝 Contribution Workflow

Pull latest changes:

git pull origin main

Make your changes and commit with descriptive messages:

git add .
git commit -m "feat: added user registration API"

Push your changes:

git push origin main

If you add new npm packages, rebuild Docker containers:

docker-compose up --build
💡 Quick Start for Team Members

Clone Repo:

git clone https://github.com/shamal0312/Research-CollabHub.git

Create Environment Files: .env in backend/ and frontend/.

Run Docker:

docker-compose up --build

Access Frontend at: http://localhost:5173
Access Backend API at: http://localhost:5000

⚠️ Technical Notes

Database Access: Ensure team members’ IPs are allowed in MongoDB Atlas or set to 0.0.0.0/0.

Port Conflicts: Make sure ports 5000 (backend) and 5173 (frontend) are free.

🌟 Features

Student registration & login (university ID required)

Profile creation & management (skills, interests, cover photo, etc.)

Project creation & team management

Private collaborative workspace

Internal chat system

Meeting scheduling (Google Meet / Microsoft Teams)

Task board for projects

Contribution tracking & portfolio display

Admin functionality for managing users/projects

👥 Contributors

Shamal
Mishelle
Nadun
Dulmi 
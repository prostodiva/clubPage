# ClubPage - Modern Club Management Platform

## Overview
ClubPage is a full-stack web application designed to facilitate club management, member communication, and event organization. The platform features a real-time chat system, event management, and user authentication.

## Features
- **Real-time Chat System**
  - Group and private messaging
  - Message history and persistence
  - Read receipts and message status
  - User presence indicators

- **User Management**
  - Secure authentication with JWT
  - User profiles and roles
  - Member management and permissions

- **Event Management**
  - Event creation and scheduling
  - RSVP system
  - Event notifications
  - Calendar integration

- **Club Management**
  - Club profiles and settings
  - Member directory
  - Activity tracking
  - Announcement system

## Tech Stack
### Frontend
- React.js with functional components
- Tailwind CSS for styling
- Axios for API communication
- Context API for state management

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- Socket.IO for real-time features

### Infrastructure
- Docker for containerization
- Nginx for reverse proxy
- MongoDB for data persistence
- DigitalOcean Spaces for file storage

### Prerequisites
- Node.js (v14 or higher)
- Docker and Docker Compose
- MongoDB
- npm or yarn

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/clubPage.git
cd clubPage
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables
```bash
# Backend .env
cp backend/.env.example backend/.env
# Edit the .env file with your configuration

# Frontend .env
cp frontend/.env.example frontend/.env
# Edit the .env file with your configuration
```

4. Start the development environment
```bash
# Using Docker Compose
docker-compose up

# Or run services separately
# Start MongoDB
docker run -d -p 27017:27017 --name mongodb mongo

# Start backend
cd backend
npm run dev

# Start frontend
cd frontend
npm start
```

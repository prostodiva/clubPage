# clubPage

## Project Plan

### Phase 1: Project Structure Setup
1. Create project directory structure
clone repository - main folder
2. Subfolders: frontend, backend, docker

frontend/
├── public/
│   ├── index.html
│   ├── static/         <- Static assets
│   │   ├── fonts/
│   │   ├── images/
│   │   └── data/
│   └── assets/
│       ├── avatar/
│       └── img/
└── src/
├── components/
│   ├── forms/
│   ├── header/
│   ├── footer/
│   └── ui/
├── pages/
├── dynamic/        <- Dynamic content
│   ├── uploads/
│   └── generated/
├── styles/
├── App.js
└── index.js

backend/
├── api/
│   ├── errors/
│   ├── middleware/ - Middleware in web development (especially in Express.js) is software that acts as an intermediary between request and response during the application's request-response cycle.
│   ├── route/
│   └── service/
├── database/
│   ├── model/
│   ├── data.js
│   └── migrate.js
├── config/
├── util/
├── app.js
└── server.js

docker/
├── compose/
│   ├── docker-compose.dev.yml
│   └── docker-compose.prod.yml
├── config/
│   ├── nginx/
│   │   └── nginx.conf
│   └── mongo/
│       └── mongod.conf
├── frontend/
│   └── Dockerfile
├── backend/
│   └── Dockerfile
├── scripts/
│   ├── backup.sh
│   └── init.sh
└── .dockerignore


3. Initialize Git repository with appropriate .gitignore

consider including:
Node/npm related:
node_modules/
npm-debug.log
yarn-error.log
package-lock.json (optional)
Environment files:
.env
.env.local
.env.development
.env.production
Build/production outputs:
/frontend/build/
/frontend/dist/
/backend/dist/
IDE/Editor files:
.vscode/
.idea/
.swp
OS specific files:
.DS_Store
Thumbs.db
Logs:
logs/
.log
Docker related:
.docker/data/
docker-volumes/
Database:
/data/db/

4. .dockerignore file
consider including:
# Version control
.git
.gitignore

# Node.js
node_modules
npm-debug.log
yarn-debug.log
yarn-error.log

# Environment files
.env
.env.*
*.env

# Build artifacts
*/build
*/dist
*/coverage

# Development files
README.md
CHANGELOG.md
docker-compose*.yml
Dockerfile*
.dockerignore

# Editor files
.vscode
.idea
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Test files
*/test
*/tests
*/__tests__

# Documentation
docs



### Phase 2: Backend Setup
1. Initialize Node.js project
    npm init  //navigate to backend. this will create the package.json
give a name. ex "name": "clubpage-api" and answer all the questions. you can skip some of them.
  - Install dependencies: express, mongoose, cors, dotenv, jsonwebtoken, bcrypt
    npm install express mongoose cors dotenv jsonwebtoken bcrypt
that will install node_modules library and will add dependencies to the package.json that was created.
- Set up environment configuration (.env)
cd backend
touch .env
  Purpose: Stores environment-specific configuration variables that your application needs to run
  Security: Keeps sensitive data (API keys, database passwords) outside your code
  Environment separation: Makes it easy to have different settings for development/production
  Configuration management: Single place to manage all environment variables
  Prevents accidental commits: When added to .gitignore, secrets stay private

include:
# Server configuration
PORT=8080
BASE_URL=http://localhost:8080

# Database connection
MONGO_URL=mongodb://username:password@localhost:27017/dbname

# Authentication
JWT_SECRET=your_super_secret_random_string_here

# API Keys
OPENAI_API_KEY=your_openai_api_key_here

# Cloud Storage (DigitalOcean Spaces / S3)
DO_SPACES_ACCESS_KEY=your_do_spaces_access_key
DO_SPACES_SECRET_KEY=your_do_spaces_secret_key
DO_SPACES_BUCKET=your-bucket-name
DO_SPACES_ENDPOINT=https://region.digitaloceanspaces.com


### 2. Server Setup
   Create the main server.js file (Entry point)
               Import dependencies:
               Import the Express app from app.js
               Import required Node.js modules (http, https)
               Environment configuration:
               Load environment variables
               Set NODE_ENV (development/production)
               Define port number with fallback
               Server creation:
               Create HTTP/HTTPS server with the app
               Handle server-level errors
               Implement graceful shutdown
               Database connection:
               Connect to MongoDB before starting server
               Handle connection errors
               Start listening:
               Start server on configured port
               Log server status
   Set up basic express app in app.js
               Express setup:
               Initialize Express app
               Configure middleware stack
               Middleware setup:
               Security middleware
               CORS configuration
               Request parsing (JSON, URL-encoded)
               Static file serving
               Logging
               Routes configuration:
               Import and attach API routes
               Configure route prefixes
               Error handling:
               Global error handlers
               404 handler for unmatched routes
               Error response formatting
               Export configuration:
               Export the configured Express app
   This separation of concerns makes your application more maintainable and easier to test.

to test the backend before working on frontend:
- add  script to package.json
  "scripts": {
  "dev": "nodemon server.js",
  "start": "node server.js"
  }
- run
  npm run dev

- install Nodemon. is a utility that monitors your Node.js application for any changes in your source code and automatically restarts the server when changes are detected.
  Key benefits:
  Saves time by eliminating manual server restarts during development
  Increases productivity when coding
  Watches all files in your project directory
  When you run npm run dev with the script we added, nodemon starts your server and then watches your files. When you make changes to any file, it automatically restarts the server with the new code.
  npm install --save-dev nodemon


   Configure environment variables
   Set up middleware (cors, body parser, etc.)
   Connect to MongoDB database
   Define basic error handling


### 3. Database Design
   Design MongoDB schemas in database/model/
   Create User model with password hashing
   Create other required models (Clubs, Events, etc.)
   Set up database connection utilities
   Create seed data for development (data.js)
   Create database migration scripts (migrate.js)
### 4. API Structure
   Create API routes in api/route/
   Set up service layer for business logic in api/service/
   Implement error handling middleware in api/errors/
   Create authentication middleware in api/middleware/
### 5. Authentication System
   Implement user registration endpoint
   Create login functionality with JWT token generation
   Set up password hashing with bcrypt
   Create middleware for protected routes
   Implement password reset functionality (optional)

### 6. Core Features
   Implement CRUD operations for clubs
   Create endpoints for user management
   Develop event management functionality
   Implement any other core features
### 7. Testing
   Create basic test scripts
   Test all endpoints manually with Postman
   Set up automated tests if time permits
### 8. Optimization
   Add caching where appropriate
   Optimize database queries
   Add rate limiting for security
### 9. Documentation
   Document all API endpoints
   Create usage examples
   Document environment requirements
### 10. Deployment Preparation
    Set up production configurations
    Prepare for CI/CD pipeline integration



### Phase 3: Frontend Setup
- Initialize React app with Create React App
  cd frontend
  npx create-react-app .
  npm start
- Install dependencies: axios, react-router-dom
  npm install axios react-router-dom
- Set up project structure
  - Components folder
  - Services folder for API calls
  - Routing configuration
  - State management
- Configure environment variables

### Phase 4: Docker Configuration
- Create backend Dockerfile
- Create frontend Dockerfile
- Create Docker Compose file
  - Services: frontend, backend, database
  - Environment variables
  - Networking
  - Volumes
- Create dev and prod configurations

### Phase 5: Development Workflow
- Start local development environment
- Implement CI/CD pipeline

### Phase 6: Testing and Deployment
- Implement testing strategy
- Prepare production deployment

## Key Best Practices
- **Authentication and Security**
  - Hash passwords
  - Use environment variables
  - Implement auth middleware
  - Use HTTPS in production
- **Error Handling**
- **API Design**
- **Docker Best Practices**
- **Development Workflow**
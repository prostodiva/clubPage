FROM node:20.11-alpine

WORKDIR /app

# Only copy necessary files for npm install
COPY package*.json ./

# Clean and install in one layer to reduce size
RUN npm cache clean --force && \
    npm install --legacy-peer-deps --no-audit --production=false && \
    npm cache clean --force

# Copy only necessary files
COPY . .

# Expose port
EXPOSE 5173

# Start app
CMD ["npm", "run", "dev"]
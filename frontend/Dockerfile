FROM node:20.11-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with verbose logging and verification
RUN npm install --legacy-peer-deps --verbose && \
    npm list @radix-ui/react-label && \
    npm list @radix-ui/react-dialog && \
    npm list @radix-ui/react-slot && \
    npm list @radix-ui/react-toast && \
    ls -la node_modules/@radix-ui

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 5173

# Start app with host flag
CMD ["npm", "run", "dev", "--", "--host"]
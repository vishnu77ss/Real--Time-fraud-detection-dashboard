# Use Node.js version 18
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the server code
COPY . .

# Open port 5000 for the API
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]
# Use Node.js for building the React app
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Open port 3000 for the Dashboard
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]
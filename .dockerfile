# Use a lightweight Node.js image
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of your code
COPY . .

# Build your project (if needed)
RUN npm run build --if-present

# The command to start your app (change 'start' to your actual start script)
CMD ["npm", "start"]
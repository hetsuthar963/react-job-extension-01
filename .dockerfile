# 1. Use an official Node.js runtime as a parent image
FROM node:20

# 2. Set the working directory in the container
WORKDIR /usr/src/app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Bundle app source
COPY . .

# 6. Build the project (important for React/Node projects)
RUN npm run build --if-present

# 7. Start the application
CMD [ "npm", "start" ]

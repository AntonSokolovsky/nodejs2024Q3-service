# Use Node.js LTS version as base image
FROM node:22-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Build the application
RUN npm run build

# Expose the port for the application
EXPOSE 4000

# Start the application
CMD ["npm", "run", "start:dev"]

# Use official Node.js base image
FROM mcr.microsoft.com/playwright:v1.43.1-jammy

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app
COPY . .

# Expose the port your server uses
EXPOSE 5000

# Start your app
CMD ["node", "server.js"]

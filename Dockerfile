# Step 1: Use a Node.js base image
FROM node:18

# Step 2: Set working directory to your backend folder
WORKDIR /app

# Step 3: Copy package files and install dependencies
COPY backend/package*.json ./
RUN npm install

# Step 4: Copy all backend files
COPY backend/ .

# Step 5: Expose the port your app uses
EXPOSE 5000

# Step 6: Define the command to run your app
CMD ["node", "server.js"]

# Base Image
FROM node:22-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Generating Prisma Client
RUN npx prisma generate

# Expose application port
EXPOSE 5000

# Start application
CMD ["npm", "start"]
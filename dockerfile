# Use an official Node runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install @astrojs/node

# Copy the rest of the application code
COPY . .

# Build the project
RUN npm run build

# Initialize the database and run the scraper
RUN npm run setup-db && npm run scrape

# Expose the port the app runs on
EXPOSE 3500

# Command to run the application
CMD ["npm", "run", "start"]

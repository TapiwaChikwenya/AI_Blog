# Use an official Node runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install @astrojs/node

# Create content directory with proper permissions
RUN mkdir -p src/content/blog && chmod 777 src/content/blog

# Create log file with proper permissions
RUN touch cron.log && chmod 666 cron.log

# Copy the rest of the application code
COPY . .

# Build the project and ensure it completes
RUN npm run build

# Initialize the database and run the scraper
RUN npm run setup-db

RUN npm run scrape
# Expose the port the app runs on
EXPOSE 3500

# Add a check to verify the build files exist
RUN ls -la dist/server/entry.mjs || exit 1

# Command to run the application
CMD ["node", "src/index.js"]

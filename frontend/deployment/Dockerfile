# Stage 1: Compile and Build Angular codebase

# Use official Node image as the base image
FROM node:14 as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
# COPY package*.json ./

# Install all the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Generate the build of the application
RUN npm run build

# Create a file and add it to /app
RUN echo "This is a test file" > /app/testfile.txt

# List the contents of /app to verify the file creation
RUN ls -al /app

# Stage 2: Serve app with Nginx server

# Use official Nginx image as the base image
FROM nginx:1.21-alpine

# Copy the build output to replace the default Nginx contents
COPY --from=build /app/dist/sample-angular-app /usr/share/nginx/html

# Copy the test file to the nginx html directory for verification
COPY --from=build /app/testfile.txt /usr/share/nginx/html/testfile.txt

# List the contents of /usr/share/nginx/html to verify the copy
RUN ls -al /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Optional: copy custom Nginx configuration file if you have one
# COPY nginx.conf /etc/nginx/nginx.conf

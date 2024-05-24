# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:18.17.0 as build

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

# Install all the dependencies
RUN npm install

# Create a file and add it to /app
RUN echo "This is a test file" > /app/testfile.txt

# List the contents of /app to verify the file creation
RUN ls -al /app

# Generate the build of the application
RUN npm run build --configuration=production


# Stage 2: Based on Nginx, to have only the compiled app, ready for production with Nginx

# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist/aibse-ui /usr/share/nginx/html
# Copying custom-nginx config
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 8080

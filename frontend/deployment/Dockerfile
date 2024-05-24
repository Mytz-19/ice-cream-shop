# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:18.17.0 as build

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

# Set JFrog registry _auth token to install dependencies
# ARG NPM_ARTIFACTORY_TOKEN
# RUN npm config set //registry.npmjs.org/:_auth ${NPM_ARTIFACTORY_TOKEN}
# RUN npm config set //artifactory.boschdevcloud.com/:_auth ${NPM_ARTIFACTORY_TOKEN}

# Install all the dependencies
RUN npm install

# Generate the build of the application
RUN npm run build --configuration=production

# Ref: https://docs.npmjs.com/docker-and-private-modules#create-and-check-in-a-project-specific-npmrc-file
RUN rm -f .npmrc


# Stage 2: Based on Nginx, to have only the compiled app, ready for production with Nginx

# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist/frontend/browser /usr/share/nginx/html
# Copying custom-nginx config
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 8080

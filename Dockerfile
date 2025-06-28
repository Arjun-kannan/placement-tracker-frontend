# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.10.0

################################################################################
# ⬇️ Base Stage – Use Node to build the app
FROM node:${NODE_VERSION}-alpine as build

# Set working directory
WORKDIR /usr/src/app

# Copy dependencies files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the app (output goes to /usr/src/app/dist)
RUN npm run build

################################################################################
# ⬇️ Final Stage – Serve with Nginx
FROM nginx:alpine as production

# Copy built Vite app to Nginx’s html directory
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose port (use 80 because Nginx serves on 80)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

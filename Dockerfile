FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install
ENV NODE_OPTIONS=--openssl-legacy-provider  
RUN npm run build --prod
FROM nginx:alpine
COPY --from=node /app/dist/attendance-register-front /usr/share/nginx/html
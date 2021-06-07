FROM node:14
WORKDIR /app
COPY . .
COPY .docker.env .env
COPY ./lib/auth/docker-config.json ./lib/auth/config.json
RUN yarn install
RUN yarn build
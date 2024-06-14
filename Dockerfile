FROM node:18-alpine
LABEL authors="batyr"

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3020

CMD ["yarn", "start:prod"]

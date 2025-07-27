FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @nestjs/cli

COPY . .
COPY ./.env ./.env
EXPOSE 3000
RUN npm run build
CMD ["npm", "run", "start"]

FROM node:22-alpine

WORKDIR /app

COPY app/package.json ./
COPY app/server.js ./

USER node

EXPOSE 3000

CMD ["npm", "start"]
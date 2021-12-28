FROM node

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

WORKDIR ./dist

ENTRYPOINT [ "node", "index.js" ]
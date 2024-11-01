FROM node:latest

WORKDIR /usr/app

COPY package.json ./
RUN npm install
RUN npm install -g @nrwl/schematics @angular/cli

EXPOSE 8080

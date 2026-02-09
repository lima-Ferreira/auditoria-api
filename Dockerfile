FROM ghcr.io/puppeteer/puppeteer:latest

USER root

# Instala o Chrome de forma manual para garantir o caminho /usr/bin/google-chrome-stable
RUN apt-get update && apt-get install -y google-chrome-stable --no-install-recommends

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN chown -R pptruser:pptruser /app
USER pptruser

EXPOSE 10000

CMD ["node", "server.js"]

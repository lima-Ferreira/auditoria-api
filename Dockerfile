FROM ghcr.io/puppeteer/puppeteer:latest

# Mudar para o usuário root para ter permissão de instalar e configurar pastas
USER root

WORKDIR /app

# Copia os arquivos de configuração
COPY package*.json ./

# Garante que o usuário pptruser seja o dono da pasta
RUN chown -R pptruser:pptruser /app

# Instala as dependências (usando o usuário root para evitar erro de EACCES)
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Ajusta permissão final
RUN chown -R pptruser:pptruser /app

# Volta para o usuário seguro do Puppeteer
USER pptruser

EXPOSE 10000

CMD ["node", "server.js"]

# Usa l'immagine ufficiale di Node.js
FROM node:18

# Imposta la cartella di lavoro
WORKDIR /app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN  npm install --legacy-peer-deps

# Copia il resto del codice
COPY . .

# Esporta la porta dell'app
EXPOSE 3000

# Comando per avviare l'app
CMD ["node", "server.js"]
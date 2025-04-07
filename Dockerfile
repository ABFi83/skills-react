FROM node:18 AS build

# Imposta la working directory
WORKDIR /app

# Copia i file necessari e installa le dipendenze
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

npm install --save-dev @babel/plugin-proposal-private-property-in-object --legacy-peer-deps

# Copia il codice sorgente e builda l'app
COPY . .
RUN npm run build

# Usa un'immagine leggera per servire l'app
FROM nginx:alpine

# Copia il build output nella directory di Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copia la configurazione personalizzata di Nginx (opzionale)
# COPY nginx.conf /etc/nginx/nginx.conf

# Espone la porta 80
EXPOSE 80

# Avvia Nginx
CMD ["nginx", "-g", "daemon off;"]
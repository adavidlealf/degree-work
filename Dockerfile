# Dockerfile para la aplicación NestJS en desarrollo
FROM node:18

# Crear y establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar solo los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto en el que la aplicación se ejecutará
EXPOSE 3000

# Comando para iniciar la aplicación en modo desarrollo
CMD ["npm", "run", "start:dev"]
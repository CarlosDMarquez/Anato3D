# Imagen del servidor de Anato3D para Fly.io (u otro alojamiento con contenedores). Plantilla SIN PROBAR: en el equipo
# donde se preparó no hay Docker ni flyctl. Se construye desde la carpeta del paquete (build/paquete), que ya lo lleva
# todo: no instala dependencias (servidor.mjs lleva el SDK dentro) ni compila nada.
FROM node:26-slim
WORKDIR /app
COPY . .
ENV NODE_ENV=production
EXPOSE 8080
# Sin USER: Fly monta el volumen /datos como root. Con SIGTERM termina lo que está en marcha y se cierra.
CMD ["node", "servidor.mjs"]

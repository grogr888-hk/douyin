FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm i --only=production || npm i
COPY . .
ENV PORT=3001
EXPOSE 3001
CMD ["node","src/app.js"]
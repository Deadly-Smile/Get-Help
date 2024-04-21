FROM node:18-alpine

WORKDIR /app
COPY public/ /app/public
COPY src/ /app/src
COPY package.json /app/

RUN npm install

RUN npm install -D tailwindcss postcss autoprefixer
RUN npx tailwindcss init -p
RUN npm install react-router-dom -S

CMD ["npm", "run", "dev"]
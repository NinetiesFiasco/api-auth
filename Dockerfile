FROM node:18-alpine
WORKDIR /app/api-auth
COPY package.json .
RUN npm i
COPY . .
EXPOSE 3501
CMD ["npm", "dev"]
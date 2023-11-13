FROM node:18-alpine
WORKDIR /app/api-auth
COPY package.json .

ARG NODE_ENV

RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only=production; \
        fi

COPY . .

ARG EXPOSED_PORT
EXPOSE $EXPOSED_PORT

CMD ["npm", "run", "dev"]
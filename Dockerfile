FROM node:20.17.0-alpine

WORKDIR /tabbik-backend

COPY package*.json /

RUN npm install 

COPY . .

RUN chmod +x ./run-migrations.sh

EXPOSE 3000

ENTRYPOINT ["sh", "./run-migrations.sh" ]

CMD [ "npm", "run", "dev" ]

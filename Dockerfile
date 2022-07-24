FROM node:16-alpine3.15

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npm install pm2@latest -g
RUN npm run build

EXPOSE 3000
CMD [ "pm2", "start", "dist/main.js", "--name", "bankApp" ]

FROM node:19.1.0-alpine3.16

# Arguments
ARG APP_HOME=/home/node/app

# Create app directory
WORKDIR ${APP_HOME}

# Install app dependencies
COPY package*.json ./
RUN \
  echo "*** Install npm packages ***" && \
  npm install

# Bundle app source
COPY . ./

# Cleanup unnecessary files
RUN \
  echo "*** Cleanup ***" && \
  rm -rf "./.git"

EXPOSE 8000

CMD ["node", "/home/node/app/server.js"]

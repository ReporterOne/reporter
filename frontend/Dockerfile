FROM tiangolo/node-frontend:10 as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
CMD npx webpack-dev-server --config webpack.config.prod.js 

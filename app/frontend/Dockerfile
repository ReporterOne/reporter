FROM tiangolo/node-frontend:10 as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY webpack.*.js .babelrc /app/
COPY ./app/frontend ./app/frontend
RUN npm run build


FROM nginx:alpine
# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY ./configs/nginx/conf.d/app.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/app/frontend/dist/ /www/app/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

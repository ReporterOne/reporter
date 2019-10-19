FROM tiangolo/node-frontend:10 as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY webpack.*.js .babelrc /app/
COPY ./app/frontend ./app/frontend
RUN npm run build



FROM python:3.7-alpine

WORKDIR /app

RUN apk --update add openssl ca-certificates py-openssl wget
RUN apk --update add --virtual build-dependencies libffi-dev openssl-dev build-base libxslt-dev
RUN apk --update add postgresql-dev

RUN pip install pipenv
COPY Pipfile* /app/
RUN pipenv install --system

ADD ./app/backend ./app/backend/
COPY --from=build-stage /app/app/frontend/dist/ /app/app/backend/server/static/

WORKDIR /app/app/backend/

CMD uvicorn server.main:app --host 0.0.0.0 --port 8443
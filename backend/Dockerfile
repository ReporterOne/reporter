FROM python:3.7-alpine

WORKDIR /app

RUN apk --update add openssl ca-certificates py-openssl wget
RUN apk --update add --virtual build-dependencies libffi-dev openssl-dev build-base libxslt-dev

RUN pip install pipenv
COPY Pipfile* /app/
RUN pipenv install --system

ADD . .

WORKDIR /app/backend/server

CMD uvicorn main:app --host 0.0.0.0 --port 8443

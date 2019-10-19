FROM python:3.7-alpine

WORKDIR /app

RUN apk --update add openssl ca-certificates py-openssl wget
RUN apk --update add --virtual build-dependencies libffi-dev openssl-dev build-base libxslt-dev
RUN apk --update add postgresql-dev

RUN pip install pipenv
COPY Pipfile* /app/
RUN pipenv install --system

ADD ./app/backend ./app/backend/

WORKDIR /app/app/backend/

CMD uvicorn server.main:app --host 0.0.0.0 --port 8443

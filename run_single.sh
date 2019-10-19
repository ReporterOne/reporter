#!/bin/bash

docker build . --file app/Dockerfile -t one_report_single
docker run -p 80:8443 one_report_single

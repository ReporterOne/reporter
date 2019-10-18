#!/bin/bash
# installs system requirements
cat requirements.system | xargs sudo apt install
# configure postgresql
sudo -u postgres createuser --interactive --pwprompt

npm run install

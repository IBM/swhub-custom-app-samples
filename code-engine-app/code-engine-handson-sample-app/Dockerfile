FROM node:17.4

RUN  apt-get -y update &&  apt-get -y upgrade

RUN  apt-get remove -y --purge 'mysql-.*'

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN echo "now building..."
RUN npm install
CMD [ "npm", "start"]

FROM alpine:3.6

#ENV HTTP_PROXY=http://172.17.0.1:3128
#ENV HTTPS_PROXY=http://172.17.0.1:3128


RUN set -ex \
  && apk --no-cache add \
    nodejs-current \
    nodejs-current-npm \
    mongodb

ADD ./application/frontend/package.json /application/frontend/package.json
RUN set -ex \
  && cd /application/frontend/ \
  && npm install

ADD ./application/api/package.json /application/api/package.json
RUN set -ex \
  && cd /application/api/ \
  && npm install bluebird --save\
  && npm install

COPY /application /application

RUN set -ex \
  && cd /application/frontend \
  && npm run build


ENV HTTP_PROXY=""
ENV HTTPS_PROXY=""
WORKDIR /application/api
CMD ["npm", "start"]


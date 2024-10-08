ARG IMAGE_VERSION=latest
FROM wpscanteam/wpscan:${IMAGE_VERSION}
USER root
RUN apk add --no-cache openssl

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

COPY wp_scan_entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
USER wpscan

ENTRYPOINT ["/entrypoint.sh"]
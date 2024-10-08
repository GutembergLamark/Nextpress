#!/usr/bin/env bash

echo $DB_HOST:$DB_PORT;

cd /var/code;

yarn

cd /var/www/html;

CONTAINER_ALREADY_STARTED="CONTAINER_ALREADY_RAN_ONCE"

dockerize -wait tcp://$DB_HOST:$DB_PORT -timeout 4000s

if [ ! -e $CONTAINER_ALREADY_STARTED ]; then
    touch $CONTAINER_ALREADY_STARTED

    echo "-- Container running for its first time"

    openssl req -x509 -nodes -days 365 -subj "/C=BR/ST=SP/O=OKN./CN=localhost" -addext "subjectAltName=DNS:localhost" -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/private/nginx-selfsigned.crt
    sed -i "s|#include snippets/https-server.conf;|include snippets/https-server-self-signed.conf;|g" /etc/nginx/sites-available/app;
    if [ -e /etc/nginx/snippets/proxy_cache.conf ]; then
        echo "file exists";
        printf "\ninclude snippets/proxy_cache.conf;" >> /etc/nginx/sites-available/app;
    fi
    chmod a+rw -R /var/www/;

	  cp wp-config.docker.php wp-config.php;
      cp /var/code/.env.docker /var/code/.env;
    if [ "$WEB_PORT" != "80" ]; then
	   sed -i "s/localhost/localhost:${WEB_PORT}/g" wp-config.php
	   sed -i "s/localhost/localhost:${WEB_PORT}/g" /var/code/.env
    fi


    chmod a+rw -R /var/www/;

    touch /var/log/wp-errors.log;
    touch /var/log/nginx/access.log;
    touch /var/log/nginx/error.log;
    touch /var/log/php8.1-fpm;
    touch /var/code/log/yarn.log;


else
    echo "-- Container already run. No need to be reconfigured"
fi

echo "-- Running services";

cd /var/code;

service nginx start && service php8.1-fpm start &&
if [ "$DEVELOPMENT_MODE" = true ]; then
    echo "-- Running Next in development mode";
    yarn dev &
elif [ "$DEVELOPMENT_MODE" = false ]; then
    echo "-- Running Next in production mode";
    yarn build
    nohup yarn start &> /var/code/log/yarn.log &
elif [ "$DEVELOPMENT_MODE" = 'analyzer' ]; then
    echo "-- Running Next in bundle analyzer";
    ANALYZE=true yarn build &
fi
tail -f /var/code/log/yarn.log /var/log/nginx/access.log /var/log/nginx/error.log /var/log/wp-errors.log /var/log/php8.1-fpm.log

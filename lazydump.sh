#!/usr/bin/env bash

DB_ROOT_PASSWORD=""
COMPOSE_PROJECT_NAME=""
if [ -f .env ]; then
	export $(cat .env | sed 's/#.*//g' | xargs)
fi
	date_format=$(date +%Y-%m-%d)
docker-compose exec database mysqldump -h 127.0.0.1 -u root --password=${DB_ROOT_PASSWORD} wp_${COMPOSE_PROJECT_NAME} > db/dump-${COMPOSE_PROJECT_NAME}-${date_format}.sql

sed -i 's|mysqldump: \[Warning\] Using a password on the command line interface can be insecure\.||g' db/dump-${COMPOSE_PROJECT_NAME}-${date_format}.sql
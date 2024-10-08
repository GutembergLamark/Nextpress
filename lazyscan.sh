#!/usr/bin/env bash

docker-compose down --volumes

docker volume prune --filter label=okn.project.name=wp-ks -f

sudo chmod a+rw -R .

rm www/CONTAINER_ALREADY_RAN_ONCE || echo "no need to reset container"

if type lazydocker >/dev/null 2>&1; then
	docker-compose --profile scan up --build -d
	lazydocker
else
	docker-compose --profile scan up --build
fi

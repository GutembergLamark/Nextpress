#!/usr/bin/env bash

source "$(dirname "$0")"/commands/functions.sh

if [ -f .env ]; then
	export $(cat .env | sed 's/#.*//g' | xargs)
fi

CURRENT_FOLDER="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
RUNNING_ON=remote
function MenuRun() {
	{
		if ! dpkg-query -W -f='${Status}' dialog | grep "ok installed"; then
			AptUpdate
			$SUDO apt-get install -y dialog
		fi

		# variables to hold command and common options.
		HEIGHT=30
		WIDTH=400
		CHOICE_HEIGHT=2
		BACKTITLE="OKN MYSQL DOCKER"
		TITLE="MySQL version"
		MENU="Choose one of the following options:"

		OPTIONS=(1 "Rodando no novo repositório"
			2 "Rodando no repositório wordpress-kick-start")

		COMPOSE_PROJECT_NAME=$(
			dialog --title "Project Name" \
				--inputbox "Digite o nome do Projeto:" 8 40 $COMPOSE_PROJECT_NAME \
				3>&1 1>&2 2>&3 3>&-
		)
		COMPOSE_PROJECT_NAME=$(echo ${COMPOSE_PROJECT_NAME} |  tr '[:upper:]' '[:lower:]')


		#		CHOICE=$(dialog --clear \
		#			--backtitle "$BACKTITLE" \
		#			--title "$TITLE" \
		#			--menu "$MENU" \
		#			$HEIGHT $WIDTH $CHOICE_HEIGHT \
		#			"${OPTIONS[@]}" \
		#			2>&1 >/dev/tty)
		#		clear
		#
		#		case $CHOICE in
		#		1)
		#			echo "Rodando no novo repositório"
		#			RUNNING_ON=local
		#			;;
		#		2)
		#			echo "Rodando no repositório wordpress-kick-start"
		#			RUNNING_ON=remote
		#			;;
		#		esac

		clear
		FOLDER_PARENT=$(echo ${CURRENT_FOLDER} | sed 's/\/wordpress-kick-start//g')
		if [ $RUNNING_ON == "remote" ]; then
			directory=$(dialog --clear --title "Escolha pasta do repositório" --stdout --title "Escolha a pasta onde ficara o novo repositório" --dselect "${FOLDER_PARENT}" 14 48)
			if [[ ${directory} == *\. ]]; then
				directory=${directory//./}
			fi
			if [[ ${directory} != */ ]]; then
				directory+="/"
			fi
		fi
		if [ ! -d ${directory} ]; then
			mkdir ${directory}
		fi

		USE_COMPOSER=0
		OPTIONS_REDIRECT=(1 "Redirecionar imagens para produção"
			2 "Sem Redirecionamento")

		CHOICE_REDIRECT=$(dialog --clear \
			--backtitle "$BACKTITLE" \
			--title "Modo de instalação de Plugins:" \
			--menu "Escolha o modo de instalação de plugins no projeto:" \
			$HEIGHT $WIDTH $CHOICE_HEIGHT \
			"${OPTIONS_REDIRECT[@]}" \
			2>&1 >/dev/tty)
		clear

		case $CHOICE_REDIRECT in
		1)
			echo "Projeto com redirect"
			USE_REDIRECT=1
			;;
		2)
			echo "Projeto sem redirect"
			USE_REDIRECT=0
			;;
		esac
		PROD_URL=""
		if [ $USE_REDIRECT == 1 ]; then
			PROD_URL=$(
				dialog --title "URL de produção" \
					--inputbox "Digite o caminho de url completo para a pasta de uploads do wordpress em produção:" 8 40 $COMPOSE_PROJECT_NAME \
					3>&1 1>&2 2>&3 3>&-
			)
			if [[ ${PROD_URL} == */ ]]; then
				PROD_URL=${PROD_URL::-1}
			fi
		fi
			TYPE_WORDPRESS=wordpress_next
	} ||
		{
			Count $1 'MenuRun'
		}
}

function ConfigureWP() {
	{
		Separator "Modificando configurações" ${GREEN}
		SANTITIZED_PROJECT_NAME=${COMPOSE_PROJECT_NAME//-/_}
		SPACED_PROJECT_NAME=${SANTITIZED_PROJECT_NAME//_/ }
		COMMIT_AUTHOR_NAME=$(git config user.name)
		COMMIT_AUTHOR_EMAIL=$(git config user.email)
		cd ${FOLDER} || exit
		sed -i "s/DB_ROOT_PASSWORD=.*/DB_ROOT_PASSWORD=$ROOT_PASSWORD/g" .env
		sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$USER_PASSWORD/g" .env
		sed -i "s/COMPOSE_PROJECT_NAME=.*/COMPOSE_PROJECT_NAME=$SANTITIZED_PROJECT_NAME/g" .env
		cp www/wp-config-sample.php www/wp-config.php || exit
		sed -i "s/define( 'DB_PASSWORD', '.*' );/define( 'DB_PASSWORD', '$USER_PASSWORD' );/g" www/wp-config.php
		sed -i "s/define( 'DB_NAME', '.*' );/define( 'DB_NAME', 'wp_$SANTITIZED_PROJECT_NAME' );/g" www/wp-config.php
		sed -i "s/NP Kick Start/${COMPOSE_PROJECT_NAME}/g" README.md
		sed -i "s/np-ks/${COMPOSE_PROJECT_NAME}/g" README.md
		SALT=$(curl -L https://api.wordpress.org/secret-key/1.1/salt/)
		STRING='put your unique phrase here'
		printf '%s\n' "g/$STRING/d" a "$SALT" . w | ed -s www/wp-config.php
		sed -i "s/\$table_prefix = '.*';/\$table_prefix = 'wp_';/g" www/wp-config.php
		sed -i "s/'current_theme','NP Kickstart'/'current_theme','${SPACED_PROJECT_NAME}'/g" db/dump-np-ks-2024-01-24.sql
		sed -i "s/'np-ks'/'${SANTITIZED_PROJECT_NAME}'/g" db/dump-np-ks-2024-01-24.sql
		cat >www/make_password.php <<EOF
		<?php
			function wp_hash_password(\$password)
			{
				global \$wp_hasher;
				if (empty(\$wp_hasher)) {
					require_once '/wordpress/wp-includes/class-phpass.php';
					\$wp_hasher = new PasswordHash(8, true);
				}
				return \$wp_hasher->HashPassword(trim(\$password));
			}

			echo wp_hash_password('okn123');
EOF
		sed -i "s|okn123|${WP_PASSWORD}|g" www/make_password.php
		WP_PASSWORD_HASH=$(docker run -v "$(pwd)/www:/wordpress" php:7.4-alpine php /wordpress/make_password.php)
		rm www/make_password.php
		WP_PASSWORD_HASH_NO_WHITESPACE="$(echo -e "${WP_PASSWORD_HASH}" | tr -d '[:space:]')"
		if [ ! -z $WP_PASSWORD_HASH_NO_WHITESPACE ]; then
			sed -i "s|'\$P\$Bhl6nFbqM6EDWdaaBtJhQ5xRd6brw9.'|'${WP_PASSWORD_HASH_NO_WHITESPACE}'|g" db/dump-np-ks-2024-01-24.sql
		else
			WP_PASSWORD='okn123'
		fi
		sed -i "s|'okngroup'|'${SANTITIZED_PROJECT_NAME}'|g" db/dump-np-ks-2024-01-24.sql
		sed -i "s|'devs.okngroup@gmail.com'|'projetosdevops@gmail.com'|g" db/dump-np-ks-2024-01-24.sql

		sed -i "s|NP Kickstart|${SPACED_PROJECT_NAME}|g" db/dump-np-ks-2024-01-24.sql
		sed -i "s|NP KS|${SPACED_PROJECT_NAME}|g" db/dump-np-ks-2024-01-24.sql

		sed -i "s/np_ks/${SANTITIZED_PROJECT_NAME}/g" azure-pipelines.yml
		sed -i "s/wordpress/${TYPE_WORDPRESS}/g" azure-pipelines.yml
		date_format=$(date +%Y-%m-%d)
		mv db/dump-np-ks-2024-01-24.sql db/dump-${SANTITIZED_PROJECT_NAME}-${date_format}.sql
		sed -i "s/dbdata/db_${SANTITIZED_PROJECT_NAME}_data/g" docker-compose.yml
		Separator "Criando arquivo de configurações para docker" ${GREEN}
		cp www/wp-config.php www/wp-config.docker.php || exit
		cp -R www/wp-content/themes/np_ks www/wp-content/themes/${SANTITIZED_PROJECT_NAME}
		sed -i "s///g" www/wp-content/themes/${SANTITIZED_PROJECT_NAME}/package.json
		sed -i "s|\"name\": \"cliente/tema\"|\"name\": \"${SANTITIZED_PROJECT_NAME}/tema\"|g" www/wp-content/themes/${SANTITIZED_PROJECT_NAME}/composer.json
		sed -i "s|\"name\": \"cliente/site\"|\"name\": \"${SANTITIZED_PROJECT_NAME}/site\"|g" www/composer.json
		sed -i "s|\"name\": \"np-ks\"|\"name\": \"${SANTITIZED_PROJECT_NAME}\"|g" www/wp-content/themes/${SANTITIZED_PROJECT_NAME}/package.json
		sed -i "s|Theme Name: NP Kickstart|Theme Name: ${SPACED_PROJECT_NAME}|g" www/wp-content/themes/${SANTITIZED_PROJECT_NAME}/style.css
		sed -i "s|Nome do Programador|${COMMIT_AUTHOR_NAME}|g" www/wp-content/themes/${SANTITIZED_PROJECT_NAME}/style.css
		sed -i "s|contato@okngroup.com.br|${COMMIT_AUTHOR_EMAIL}|g" www/wp-content/themes/${SANTITIZED_PROJECT_NAME}/style.css
		sed -i "s|Text Domain: np-ks|Text Domain: np-ks|g" www/wp-content/themes/${SANTITIZED_PROJECT_NAME}/style.css
		sed -i "s|This theme has been developed exclusively for Cliente.|This theme has been developed exclusively for ${SPACED_PROJECT_NAME}.|g" www/wp-content/themes/${SANTITIZED_PROJECT_NAME}/style.css
		echo 'node_modules/' >www/wp-content/themes/${SANTITIZED_PROJECT_NAME}/.gitignore
		echo 'vendor/' >>www/wp-content/themes/${SANTITIZED_PROJECT_NAME}/.gitignore
		echo 'vendor/' >>www/wp-content/themes/${SANTITIZED_PROJECT_NAME}/.gitignore
		sed -i "s/np_ks/${SANTITIZED_PROJECT_NAME}/g" .gitignore
		sed -i "s/np-ks/${SANTITIZED_PROJECT_NAME}/g" docker/.wp-cli/config.yml
		rm -R www/wp-content/themes/np_ks
		echo "" >>README.md
		echo "" >>README.md
		echo "## WP-ADMIN" >>README.md
		echo "user: ${SANTITIZED_PROJECT_NAME}" >>README.md
		echo "password: ${WP_PASSWORD}" >>README.md

	} ||
		{
			Count $1 'ConfigureWP'
		}
}
function ConfigureNginx() {
	{
		Separator "Preparando Projeto para utilizar redirecionamento de imagens" ${GREEN}
		cd ${FOLDER} || exit
		mkdir nginx
		sed -i "s|PROD_URL|${PROD_URL}|g" docker/nginx/snippets/magic_redirect.conf
		sed -i "s|PROJECT_NAME|${SANTITIZED_PROJECT_NAME}|g" docker/nginx/snippets/homolog_redirect.conf
		sed -i "s|PROJECT_NAME|${SANTITIZED_PROJECT_NAME}|g" docker/nginx/snippets/magic_redirect.conf
		sed -i "s|PROD_URL|${PROD_URL}|g" nginx/redirects/enabled/redirect_wp-ks.conf
		sed -i "s|np-ks |${SANTITIZED_PROJECT_NAME}|g" nginx/redirects/enabled/redirect_wp-ks.conf
		mv nginx/redirects/enabled/redirect_wp-ks.conf nginx/redirects/enabled/redirect_${SANTITIZED_PROJECT_NAME}.conf

	} ||
		{
			Count $1 'ConfigureNginx'
		}
}
function SetFolder() {
	{
		if [ $RUNNING_ON == "local" ]; then
			FOLDER="${CURRENT_FOLDER}"
		fi
		if [ $RUNNING_ON == "remote" ]; then
			if [[ ${directory} != */${COMPOSE_PROJECT_NAME} ]]; then
				FOLDER="${directory}${COMPOSE_PROJECT_NAME}/"
				Separator "Criando novo diretorio cp -R ${CURRENT_FOLDER} ${FOLDER}" ${YELLOW}
				cp -R ${CURRENT_FOLDER} ${FOLDER}
			else
				FOLDER="${directory}"
				Separator "Copiando para diretorio de projeto cp -Rp ${CURRENT_FOLDER}/. ${FOLDER}" ${YELLOW}
				cp -Rp ${CURRENT_FOLDER}/. ${FOLDER}
			fi
			cd ${FOLDER}
			ls -la
			Separator "Removendo git existente" ${RED}
			chmod a+rw -R .git
			rm -R .git
			rm -R .wpscan/.wpscan/db || echo "no old wpscan database files found"
			rm .wpscan/output* || echo "no old wpscan output file found"
			Separator "Iniciando GIT" ${GREEN}
			git init
			git checkout -b develop
			mkdir "html"
			echo "node_modules/" >html/.gitignore
			echo "vendor/" >>html/.gitignore
			#			echo "commands/" >>.gitignore
			#			echo "kick-start-fork.sh" >>.gitignore
			echo "www/CONTAINER_ALREADY_RAN_ONCE" >>.gitignore
			sed -i "s/np-ks/${SANTITIZED_PROJECT_NAME}/g" lazystart.sh
			sed -i "s/np-ks/${SANTITIZED_PROJECT_NAME}/g" lazyscan.sh
			RemoveUneededFilesAndFolders 1
			git add .
			git commit -m "initial commit"
		fi
	} ||
		{
			Count $1 'SetFolder'
		}
}

function RunDocker() {
	{
		Separator "Iniciando Docker Compose" ${GREEN}
		docker-compose build
		docker-compose up -d
		docker-compose logs
	} ||
		{
			Count $1 'RunDocker'
		}
}

function RunVsCode() {
	{
		Separator "Iniciando VSCode" ${GREEN}
		code .
	} ||
		{
			Count $1 'RunDocker'
		}
}

function RemoveComposer() {
	{
		Separator "Preparando Projeto para não utilizara composer" ${GREEN}
		cd ${FOLDER} && pwd
		rm www/composer.json
		rm www/composer.lock
		rm www/wp-content/themes/np_ks/composer.json
		rm www/wp-content/themes/np_ks/composer.lock
		cd ${FOLDER}
		sed -i "s|www/wp-content/plugins/\*||g" .gitignore
		sed -i "s|!www/wp-content/plugins/index.php||g" .gitignore
		sed -i '18,24d' README.md
	} ||
		{
			Count $1 'RemoveComposer'
		}
}
function RemoveUneededFilesAndFolders() {
	{
		Separator "Removendo Arquivos e pastas não utilizados" ${GREEN}
		cd ${FOLDER}
		rm kick-start-fork.sh
		rm composer_update.sh
		rm -R commands
		rm -R .idea || echo "idea directory not found"
	} ||
		{
			Count $1 'RemoveComposer'
		}
}

function AddToGit() {
	{
		Separator "Preparando GIT" ${GREEN}
		git checkout -b feature/docker
		git add .
		git commit -m "Adicionando arquivos de configurações docker"
		git checkout develop
		Separator "GIT Commit dos arquivos modificados" ${GREEN}
		git merge feature/docker
		Separator "Criando branch master" ${GREEN}
		git checkout -b master
		Separator "Checkout da branch Develop" ${GREEN}
		git checkout develop
	} ||
		{
			Count $1 'AddToGit'
		}
}
function ConfigureNext() {
	{
		Separator "Preparando Node" ${GREEN}
		sed -i "s|\"name\": \"np-ks\"|\"name\": \"${COMPOSE_PROJECT_NAME}\"|g" code/package.json
		if ! command -v uuidgen &>/dev/null; then
  echo "uuid-runtime package is not installed. Installing..."
  sudo apt-get update
  sudo apt-get install -y uuid-runtime
  echo "uuid-runtime package has been installed."
else
  echo "uuid-runtime package is already installed."
fi
		uuid=$(uuidgen -r)
		sed -i "s|define('WP_NEXTKEY', '.*');|define('WP_NEXTKEY', '${uuid}');|g" www/wp-config.php
		sed -i "s|define('NEXTKEY', '.*');|define('NEXTKEY', '${uuid}');|g" code/.env.docker
		cp code/.env.docker code/.env || exit


	} ||
		{
			Count $1 'AddToGit'
		}
}
USER_PASSWORD=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 10 | head -n 1)
WP_PASSWORD=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 10 | head -n 1)
ROOT_PASSWORD=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 10 | head -n 1)

MenuRun 1
if [ -z "$(git config --global --list | grep -e user.name -e user.email)" ]; then
	Separator "GIT NÃO CONFIGURADO!!!" ${RED}
	exit 1
fi
SetFolder 1
ConfigureNext 1
ConfigureWP 1
if [ $USE_REDIRECT == 1 ] && [ $PROD_URL != "" ] && [ $PROD_URL != $COMPOSE_PROJECT_NAME ]; then
	ConfigureNginx 1
fi

AddToGit 1
if type docker-compose >/dev/null 2>&1; then
	RunDocker 1
fi
RunVsCode 1

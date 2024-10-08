# NP Kick Start

## instrução de instalação/execução do projeto em ambiente de desenvolvimento

Execute o comando abaixo para rodar os containers do projeto.

`docker-compose up;`

Para acessar o container de qualquer pasta:

`docker exec -it wp-ks-app /bin/bash`

Para acessar o container usando docker-compose:

`docker-compose exec web /bin/bash`

Na **raiz do projeto (/var/www/html)** execute:

`composer install;`

No ambiente de desenvolvimento, na raiz do tema 'wp-ks' execute:

`composer install;`

Criação de templates:

Modulo: `yarn create-template --module <ModuleName>`

Layout: `yarn create-template --layout <LayoutName>`

Componente: `yarn create-template --component --<general | form | field | modal> <ComponentName>`

Interna: `yarn create-template --internal <slug> --post <PostType>`

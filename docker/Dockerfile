ARG IMAGE_VERSION=4.0.0
FROM okngroup/nginx-sites-web-server:${IMAGE_VERSION}

COPY nginx /etc/nginx

RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar && chmod +x wp-cli.phar  && mv wp-cli.phar /usr/local/bin/wp && wp --info

RUN apt-get update && apt-get upgrade -y && apt-get install -y mysql-client

RUN sudo apt-get update
RUN sudo apt-get install -y ca-certificates curl gnupg
RUN sudo mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
RUN sudo apt-get update
RUN sudo apt-get install nodejs -y
RUN apt-get install -y nodejs
RUN npm install yarn -g

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
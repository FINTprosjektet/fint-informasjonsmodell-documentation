FROM httpd:latest
ENV CONTAINER_PATH /usr/local/apache2/htdocs/
COPY ./dist/ $CONTAINER_PATH

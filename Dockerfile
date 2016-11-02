FROM httpd:latest
ENV CONTAINER_PATH /usr/local/apache2/htdocs/

EXPOSE 80

COPY ./dist/ $CONTAINER_PATH

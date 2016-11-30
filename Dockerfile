FROM node

MAINTAINER Øystein Amundsen <oystein@fintprosjektet.no>

# Create app user
RUN useradd --user-group --create-home --shell /bin/false app

# Create app directory
ENV HOME=/usr/src/app
RUN mkdir -p $HOME
WORKDIR $HOME

# Bundle app source & Install app dependencies
ADD . $HOME
RUN chown -R app:app $HOME/*
RUN npm install --production

USER app

EXPOSE 4200
CMD npm start

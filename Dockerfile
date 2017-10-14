######################
### STAGE 1: Build ###
# We label our stage as 'builder'
FROM node:8-alpine as builder

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy ALL-THE-THINGS to our build container
COPY . /usr/src/app

# Make sure we are installing platform specific modules anew, and not building on top of copies of our local modules
RUN rm -rf ./node_modules
#RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
#RUN npm install -s
RUN yarn install

## Build the angular app in production mode and store the artifacts in dist folder
#RUN npm run build
RUN yarn build


######################
### STAGE 2: Setup ###
FROM node

# Create app user
RUN useradd --user-group --create-home --shell /bin/false app

# Create app directory
ENV HOME=/usr/src/app
RUN mkdir -p $HOME
WORKDIR $HOME

# Install app dependencies
COPY package.json $HOME
#RUN npm install --production -s
RUN yarn install --production

# Bundle pre-built app from builder layer
COPY --from=builder /usr/src/app/dist $HOME/dist
RUN chown -R app:app $HOME/*

# Set
USER app

ENTRYPOINT npm start

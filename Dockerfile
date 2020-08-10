FROM registry.access.redhat.com/ubi8/nodejs-12
#FROM node:12

# Add a working directory and set the permissions,
# so that the container runs without root access
USER 0
WORKDIR /usr/src/app
RUN chown -R 1001:0 /usr/src/app
USER 1001


# Install app dependencies;
# A wildcard is used to ensure both package.json AND package-lock.json are copied;
# where available (npm@5+);
COPY package*.json ./

RUN npm install

# If you are building your code for production;
#RUN npm ci --only=production 

# Bundle app source
COPY . .

EXPOSE 9000
CMD [ "node", "server.js" ]
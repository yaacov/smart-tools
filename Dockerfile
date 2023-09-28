# Use Red Hat's UBI Node.js image as the base
FROM registry.access.redhat.com/ubi9/nodejs-18

# Set working directory
WORKDIR /usr/src/app

# Add application sources to a directory that the assemble script expects them
# and set permissions so that the container runs without root access
USER 0

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Link binaries
RUN npm link

# When the container is run, start an interactive bash shell
CMD [ "bash" ]

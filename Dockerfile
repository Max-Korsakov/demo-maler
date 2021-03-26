FROM node:10


ARG APP_DIR=demo_maker
RUN mkdir -p ${APP_DIR}


# Copy project files
COPY . /${APP_DIR}


# Install dependencies
RUN cd /${APP_DIR}/server && npm i

RUN cd /${APP_DIR}/front && npm i @angular/cli > /dev/null
RUN cd /${APP_DIR}/front && npm i


WORKDIR /${APP_DIR}/front

# Expose port
EXPOSE 8000

# Start the app: 
CMD ["npm", "run", "start-docker-env"]

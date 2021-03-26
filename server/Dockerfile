FROM node:10


ARG APP_DIR=demo-maker-backend
RUN mkdir -p ${APP_DIR}


# Copy project files
COPY . /${APP_DIR}

WORKDIR /${APP_DIR}

# Install dependencies
RUN npm i


# Expose port
EXPOSE 8000

# Start the app: 
CMD ["npm", "start"]
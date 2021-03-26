FROM node:10-alpine as builder


ARG APP_DIR=demo-maker-frontend
RUN mkdir -p ${APP_DIR}


# Copy project files
COPY . /${APP_DIR}

WORKDIR /${APP_DIR}

# Install dependencies
RUN npm -v
#RUN npm i @angular/cli > /dev/null
RUN npm i

RUN npm run build --prod --output-path=dist

### STAGE 2: Setup ###

FROM nginx

## Copy our default nginx config
COPY /nginx/nginx.conf /etc/nginx

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /demo-maker-frontend/dist/shaka-front /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

# EPAM Demo Maker.

Tool for visualization and debug media Computer Vision pipelines. See https://kb.epam.com/display/EPMCMLCV/EPAM+Demo+Maker

## Git

```
git init
git remote add origin git@git.epam.com:epmc-mlcv/demo_maker.git
git pull origin
git checkout constructor
```


## Installation

Install node.js for using Node package manager from https://nodejs.org/en/ 

Run in 'front' folder `npm install` to install dependencies

Run in 'server' folder `npm install` to install dependencies

(For local run) Run `npm run start` in 'front' folder for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

(For server run) Run `npm run start-awsdev-env` in 'front' folder for a dev server. Navigate to `http://{server_ip}:5000/`.


## Build for Prod

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.


## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Docker
### https://mherman.org/blog/dockerizing-an-angular-app/
### https://stackoverflow.com/questions/46778868/ng-serve-not-working-in-docker-container

`cd /code/demo_maker`

### Build:
`docker build -t demo_maker .`

### Push to the ECR repo:
```
aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 363712795748.dkr.ecr.eu-central-1.amazonaws.com/demo_maker
docker tag demo_maker:latest 363712795748.dkr.ecr.eu-central-1.amazonaws.com/demo_maker:latest
docker push 363712795748.dkr.ecr.eu-central-1.amazonaws.com/demo_maker:latest
```

### Pull from the ECR repo:
`docker pull 363712795748.dkr.ecr.eu-central-1.amazonaws.com/demo_maker:latest`

### Run
`docker run -p 80:5000 -p 8000:8000 -d demo_maker`
Navigate to `http://{host_ip}:80/`.

## Docker - Troubleshooting
### All running containers
`docker ps`

### All containers
`docker ps -a`

### Container Logs
`docker logs <container_id>`

### Go to running container bash
`docker exec -it <container_id> bash`


## Docker - 2 separate containers:

### Backend

```
cd demo_maker/server

docker build -t demo-maker-backend .
docker run -p 8000:8000 -d demo-maker-backend
```

Navigate to `http://{host_ip}:8000/video`.

### Frontend

```
cd demo_maker/front

docker build -t demo-maker-frontend .
docker run -p 80:5000 -d demo-maker-frontend
```

Navigate to `http://{host_ip}:80/`.

### Push to the ECR repo:
```
aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 363712795748.dkr.ecr.eu-central-1.amazonaws.com/demo_maker

docker tag demo-maker-backend:latest 363712795748.dkr.ecr.eu-central-1.amazonaws.com/demo_maker/demo-maker-backend:latest
docker push 363712795748.dkr.ecr.eu-central-1.amazonaws.com/demo_maker/demo-maker-backend:latest

docker tag demo-maker-frontend:latest 363712795748.dkr.ecr.eu-central-1.amazonaws.com/demo_maker/demo-maker-frontend:latest
docker push 363712795748.dkr.ecr.eu-central-1.amazonaws.com/demo_maker/demo-maker-frontend:latest
```

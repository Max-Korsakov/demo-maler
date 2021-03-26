# ShakaFront

Run `npm run start` af front folder to start angular at `http://localhost:4200` and server at `http://localhost:8000`.

# build

```
docker build -t demo_maker_front .
```

# run 

```
docker run -p 80:80 -p 5000:5000 -d demo_maker_front
```

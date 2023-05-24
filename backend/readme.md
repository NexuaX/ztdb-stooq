### How to run

First setup docker.

`docker compose build`

`docker compose up`

Next, run init scripts for databases.

`docker exec CONTAINERNAME bash /root/data/init.sh`

To start backend:

`npm install`

`npm run dev`
or
`npm run watch`

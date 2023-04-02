### How to run

`npm install`

`npm run dev`
or
`npm run watch`

start docker

`docker compose up`

to populate cassandra with data:

use endpoint /cassandra/setup once

check if tables were created with /cassandra

go to docker terminal:

write `cqlsh`

then `use ztbd`

then `copy ztbd.index_company_data (index_name, day, opening, highest, lowest, closing, volume) from '/root/data/FILENAME`

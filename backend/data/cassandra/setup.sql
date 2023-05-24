create keyspace if not exists ztbd 
with replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

CREATE TABLE if not exists ztbd.indexes (
    index_name text PRIMARY KEY,
    full_name text
);

CREATE TABLE if not exists ztbd.index_company_data (
    index_name text,
    day date,
    closing decimal,
    highest decimal,
    lowest decimal,
    opening decimal,
    volume decimal,
    garbage blob,
    PRIMARY KEY (index_name, day)
) WITH CLUSTERING ORDER BY (day DESC);

CREATE TABLE if not exists ztbd.index_data (
    index_name text,
    day date,
    closing decimal,
    highest decimal,
    lowest decimal,
    opening decimal,
    volume decimal,
    garbage blob,
    PRIMARY KEY (index_name, day)
) WITH CLUSTERING ORDER BY (day DESC);

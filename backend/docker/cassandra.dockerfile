FROM cassandra

# copy data to docker
COPY data/cassandra /root/data
COPY data/*.csv /root/data
COPY data/xgarbage.bytes /root/data

# set as executable
RUN chmod +x /root/data/init.sh

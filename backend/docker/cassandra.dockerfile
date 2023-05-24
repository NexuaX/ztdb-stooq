FROM cassandra

# copy data to docker
COPY data/cassandra /root/data

# set as executable
RUN chmod +x /root/data/init.sh

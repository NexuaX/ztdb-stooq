FROM postgres

# copy data to docker
COPY data/postgres /root/data

# set as executable
RUN chmod +x /root/data/init.sh
FROM mongo

# copy data to docker
COPY data/mongo /root/data

# set as executable
RUN chmod +x /root/data/init.sh

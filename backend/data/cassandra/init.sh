
echo "Init dabase script - Albert"

echo "Waiting for cassandra to start ..."
while ! cqlsh -e "desc keyspaces;"; do
    echo "Retry in 10"
    sleep 10
done

echo "cassandra online"
echo "loading data ..."

cqlsh -f /root/data/setup.sql
cqlsh -f /root/data/load.sql

echo "Probably loaded :P"

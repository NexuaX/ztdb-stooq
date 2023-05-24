
echo "Init dabase script - Albert"

echo "Waiting for mongo to start ..."
while ! mongosh --quiet --eval 'db' ztbd; do
    echo "Retry in 10"
    sleep 10
done

echo "mongo online"
echo "loading data ..."

mongosh --quiet -u root -p example --authenticationDatabase admin -f /root/data/load.js ztbd

mongoimport --collection='nvda_us_data' --db='ztbd' \
 --columnsHaveTypes --fieldFile=/root/data/fields --file=/root/data/mg_nvda_us_d.csv --type=csv \
 -u root -p example --authenticationDatabase=admin
mongoimport --collection='intc_us_data' --db='ztbd' \
 --columnsHaveTypes --fieldFile=/root/data/fields --file=/root/data/mg_intc_us_d.csv --type=csv \
 -u root -p example --authenticationDatabase=admin
mongoimport --collection='amd_us_data' --db='ztbd' \
 --columnsHaveTypes --fieldFile=/root/data/fields --file=/root/data/mg_amd_us_d.csv --type=csv \
 -u root -p example --authenticationDatabase=admin

echo "Probably loaded :P"

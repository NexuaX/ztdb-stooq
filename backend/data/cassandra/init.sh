
echo "Init dabase script - Albert"

echo "Waiting for cassandra to start ..."
while ! cqlsh -e "desc keyspaces;"; do
    echo "Retry in 10"
    sleep 10
done

echo "cassandra online"

echo "preparing data ..."
indexes=("nvda_us" "aapl_us" "akam_us" "amd_us" "amzn_us" "ibm_us" "intc_us")
for index in ${indexes[@]}; do
    awk -F "\r" "NR==FNR { line=\$1; next } { print \"$index,\" \$1 \",0x\" line }" \
     /root/data/xgarbage.bytes /root/data/$index"_d.csv" > /root/data/cass_$index"_d.csv"
done

awk -F "\r" "{ print \"spx,\" \$1 \",0xcafe\" }" \
 /root/data/spx_d.csv > /root/data/cass_spx_d.csv

echo "loading data ..."

cqlsh -f /root/data/setup.sql
cqlsh -f /root/data/load.sql

echo "Probably loaded :P"

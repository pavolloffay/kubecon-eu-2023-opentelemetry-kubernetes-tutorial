#!/bin/sh
while true;
do
MAX=$(($(($RANDOM%30))+10))
for i in `seq 1 ${MAX}`
do
curl -s "${URL}" & 
done

wait

echo 
sleep 0.5
done

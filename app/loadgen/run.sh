#!/bin/sh


while true;
do
MAX=$(($(($RANDOM%30))+10))

for i in `seq 1 ${MAX}`
do
PLAYERS=(`echo "Pavol\nBenedikt\nYuri\nKristina\nSeverin" | shuf`)
echo -s "${URL}?player1=${PLAYERS[1]}&player2=${PLAYERS[2]}" & 
done

wait

echo 
sleep 0.5
done

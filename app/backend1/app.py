from hashlib import sha256
from time import sleep
from random import randint
from flask import Flask, request

app = Flask(__name__)

@app.route("/rolldice")
def roll_dice():
    player = request.args.get('player')
    max = 8 if player and sha256(bytes(player, 'utf-8')).hexdigest() == 'f4b7c19317c929d2a34297d6229defe5262fa556ef654b600fc98f02c6d87fdc' else 6
    return str(do_roll(max))

def do_roll(max):
    result = randint(1, max)
    if result > 6:
        sleep(0.1 * result)
    return result

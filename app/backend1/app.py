from hashlib import sha256
from time import sleep
from random import randint
from flask import Flask, request
from logging.config import dictConfig

app = Flask(__name__)

@app.route("/rolldice")
def roll_dice():
    player = request.args.get('player', default="Anonymous player")
    max = 8 if sha256(bytes(player, 'utf-8')).hexdigest() == 'f4b7c19317c929d2a34297d6229defe5262fa556ef654b600fc98f02c6d87fdc' else 6
    result = str(do_roll(max))
    app.logger.info("%s is rolling the dice: %s", player, result);
    return result

def do_roll(max):
    result = randint(1, max)
    if result > 6:
        sleep(0.1 * result)
    return result

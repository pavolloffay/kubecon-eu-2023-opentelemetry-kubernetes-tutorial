from random import randint
from flask import Flask, request

app = Flask(__name__)

@app.route("/rolldice")
def roll_dice():
    return str(do_roll())

def do_roll():
    return randint(1, 6)

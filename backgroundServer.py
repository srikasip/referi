from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify
import json
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def index():
  return render_template("index2.html")

if __name__ == '__main__':
  app.run()
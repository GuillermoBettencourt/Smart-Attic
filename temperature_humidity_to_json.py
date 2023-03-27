import json
from datetime import datetime

filename = 'static/data.json'
filepath = f'/home/rodrigo/Desktop/Smart-Attic/{filename}'

def add_metric(temperature, humidity):
    try:
        with open(filepath, 'r') as file:
            data = json.load(file)
    except FileNotFoundError:
        data = []

    new_temperature = {
        'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'metric': 'Temperature',
        'value': temperature
    }

    new_humidity = {
        'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'metric': 'Humidity',
        'value': humidity
    }

    data.append(new_temperature)
    data.append(new_humidity)
    
    with open(filepath, 'w') as file:
        json.dump(data, file, indent=2)
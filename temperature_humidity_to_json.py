import json
from datetime import datetime

# set the filename and path of the JSON file
filename = 'dashboard/data.json'
filepath = f'/mnt/c/Users/guill/OneDrive/Escritorio/E.I/MEIC/S4/AI/Project/Smart-Attic/{filename}'

# function to add new metric to the JSON file
def add_metric(temperature, humidity):
    # read the existing JSON data from the file
    try:
        with open(filepath, 'r') as file:
            data = json.load(file)
    except FileNotFoundError:
        data = []

    # create a new metric object with the provided data
    new_temperature = {
        'date': datetime.now().strftime('%d-%m-%Y %H:%M:%S'),
        'metric': 'Temperature',
        'value': temperature
    }

    new_humidity = {
        'date': datetime.now().strftime('%d-%m-%Y %H:%M:%S'),
        'metric': 'Humidity',
        'value': humidity
    }

    # append the new metric to the existing data
    data.append(new_temperature)
    data.append(new_humidity)

    # write the updated data back to the JSON file
    with open(filepath, 'w') as file:
        json.dump(data, file, indent=2)
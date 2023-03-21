import time
import board
import adafruit_dht
import requests

th_sensor = adafruit_dht.DHT11(board.D17)
address = "http://localhost:5000/"
errorMessage = ""

def postError(errorMessage):
    print(errorMessage)
    response = requests.post("address" + "error", json = {"error": errorMessage})
    print(response.json())

while True:
    try:
        temperature = th_sensor.temperature
        humidity = th_sensor.humidity

        if temperature is not None and humidity is not None:
            print("Temp: {}*C    Humidity: {}% ".format(temperature, humidity))
            th_data = {"temperature": temperature, "humidity": humidity}
            response = requests.post(address + "th_data", json = th_data)
            print(response.json())

        else:
            errorMessage = "Error: Not able to get readings from sensor"
            postError(errorMessage)
    
    except RuntimeError as error:
        errorMessage = error.args[0]
        postError(errorMessage)
        time.sleep(2.0)
        continue

    except Exception as error:
        errorMessage = error.args[0]
        postError(errorMessage)
        th_sensor.exit()
        raise error
    
    time.sleep(2.0)
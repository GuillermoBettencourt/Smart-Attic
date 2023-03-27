import time
import board
import adafruit_dht
import requests
import sys

address = "http://192.168.139.248:5000/"
errorMessage = ""
th_sensor = adafruit_dht.DHT11(board.D17)

def postError(errorMessage):
    print(errorMessage)
    #response = requests.post(address + "error", json = {"error": errorMessage})
    #print(response.json())

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

    except (Exception, RuntimeError) as error:
        errorMessage = error.args[0]
        postError(errorMessage)
        python = sys.executable
        time.sleep(2.0)
        #os.execl(python, python, *sys.argv)
        continue
    
    time.sleep(10.0)
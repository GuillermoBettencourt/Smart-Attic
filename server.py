from flask import Flask, request, jsonify, render_template
from email_sender import send_email_temperature_alert, send_email_humidity_alert, send_email_intruder_alert
from temperature_humidity_to_json import add_metric
from datetime import datetime

import os
import base64
app = Flask(__name__)

MAX_TEMPERATURE = 30
MIN_TEMPERATURE = 10
MAX_HUMIDITY = 60
MIN_HUMIDITY = 30 

imageDirectory = '/mnt/c/Users/guill/OneDrive/Escritorio/image/'
temperature = ""
humidity = ""
image = None
notification_off = True

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/get_th_data')
def get_th_data():
    global temperature
    global humidity
    return jsonify({'temperature': temperature, 'humidity': humidity})

@app.route('/get_images')
def get_images():
    images = []
    directoryImages = os.listdir(imageDirectory)
    directoryImages.reverse()
    for filename in directoryImages:
        if filename.endswith('.jpg') or filename.endswith('.png'):
            with open(os.path.join(imageDirectory, filename), 'rb') as f:
                data = f.read()
                encoded_image = base64.b64encode(data).decode('utf-8')
                images.append({'name': filename, 'data': encoded_image})
    return jsonify({'images': images})

@app.route('/th_data', methods=['POST'])
def submit_th_data():
    global temperature
    global humidity
    data = request.get_json()
    temperature = data['temperature']
    humidity = data['humidity']
    add_metric(temperature, humidity)

    if(temperature > MAX_TEMPERATURE or temperature < MIN_TEMPERATURE):
        send_email_temperature_alert(temperature)

    if(humidity > MAX_HUMIDITY or humidity < MIN_HUMIDITY):
        send_email_temperature_alert(humidity)

    print(f'Temperature: {temperature} | Humidity: {humidity}')
    return jsonify({'message': 'Temperature and Humidity data received successfully'})

@app.route('/intruder_detected', methods=['POST'])
def intruder_detected():
    global image
    image = request.files['image']
    imagePath = imageDirectory + datetime.now().strftime('%Y-%m-%d %H:%M:%S') + '.jpg'
    image.save(imagePath)
    send_email_intruder_alert(imagePath)
    print(f'Image with name {image.filename}, was saved successfully in the image folder')
    return jsonify({'message': 'Intrusion received successfully'})

@app.route('/error', methods=['POST'])
def submit_error():
    error = request.get_json()["error"]
    print(error)
    return jsonify({'message': 'Error received successfully'})

@app.route('/switch_notification', methods=['POST'])
def switch_notification():
    global notification_off
    notification_off = not notification_off
    message = "Notifications are now off" if notification_off else "Notifications are now on" 
    print(message)
    return jsonify({'message': message})

if __name__ == '__main__':
    app.run(debug=True)
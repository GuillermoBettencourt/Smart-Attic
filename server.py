from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

imageDirectory = '/mnt/c/Users/guill/OneDrive/Escritorio/image/'
temperature = ""
humidity = ""
image = None

@app.route('/')
def home():
    global temperature
    global humidity
    global image
    return render_template('index.html', temperature= temperature, humidity= humidity, image = image)

@app.route('/th_data', methods=['POST'])
def submit_th_data():
    global temperature
    global humidity
    data = request.get_json()
    temperature = data['temperature']
    humidity = data['humidity']
    print(f'Temperature: {temperature} | Humidity: {humidity}')
    return jsonify({'message': 'Temperature and Humidity data received successfully'})

@app.route('/intruder_detected', methods=['POST'])
def intruder_detected():
    global image
    image = request.files['image']
    imagePath = imageDirectory + image.filename
    image.save(imagePath)
    print(f'Image with name {image.filename}, was saved successfully in the image folder')
    return jsonify({'message': 'Intrusion received successfully'})

@app.route('/error', methods=['POST'])
def submit_error():
    error = request.get_json()["error"]
    print(error)
    return jsonify({'message': 'Error received successfully'})

if __name__ == '__main__':
    app.run(debug=True)
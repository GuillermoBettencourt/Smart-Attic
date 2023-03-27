# Smart Attic Setup And Installation

This guide provides instructions on how to set up and install the required components to run an IoT program that its able to provide real-time information inside an smart attic environment using one DHT11 sensor (for temperature and humidity), one motion sensor (to detect possible intruders or unusual activity), a camera (to take a photo when movement is detected), two Raspberry Pi 4 devices and a machine to run the web server.

## Overview of Components

-   One machine, to run web server.
-   Two Raspberry Pi 4 (not necessarily model 4, but is the only one that was tested).
-   One Android mobile phone, to use its camera and flash.
-   One DHT11 sensor.
-   One motion sensor.

## Setup 

### Machine

Here is where the Web Server will be running, it will be used to both receive post request from the raspberry pi to submit the environment data and also the get requests from the frontend to get said data. The data is stored locally in the machine, and for the simplicity of this readme we assume  it will be running in local host and port 5000.

#### Install Python

```Linux Terminal
sudo apt-get install python3
```

#### Download Files from Git and Run Program

Download all the files from this repository, go inside the Smart-Attic folder, and inside server.py and temperature_humidity_to_json.py replace the values of the following variables.

```Python
# server.py file
imageDirectory = 'replace with your desired image directory path'
```

```Python
# temperature_humidity_to_json.py file
filepath = 'replace with the path pointing to your static/data.json directory' + f'/{filename}'
```

Run the server.py file with:

```Linux Terminal
python3 server.py
```

### First Raspberry Pi 4

This device is the one connected to the DHT11 sensor, to detect both temperature and humidity. It will be running a python file to read from the DHT11 sensor and send said measurements to the web server.

#### Install Python

```Linux Terminal
sudo apt-get install python3
```

#### Install Adafruit Python Library for DHT11

``` Linux
sudo pip3 install Adafruit_DHT
```

#### DHT11 Sensor Wiring 

Connect the Raspberry Pi device to the DHT11 sensor by following these steps:

1.  Connect a VCC pin of the DHT11 sensor to the 3.3V or 5V pin of the Raspberry Pi.
2.  Connect a GND pin of the DHT11 sensor to the GND pin of the Raspberry Pi.
3.  Connect the data pin of the DHT11 sensor to any GPIO pin of the Raspberry Pi. In our case we use the GPIO 17 which corresponds to pin 11, but feel free to change it.

#### Download Files from Git and Run Program

Download all the files from this repository, go inside the Smart-Attic folder, and run the read_temperature_humidity.py file with:

```Linux Terminal
python3 read_temperature_humidity.py
```

### Second Raspberry Pi 4

In this device is the one connected to the motion sensor, to movement and wirelessly to a mobile phone to take a photo each time movement is detected. It will be running a python file to read from the motion sensor if movement is detected it will take a photo and send a notification with the photo attached to the web server.

#### Install Python

```Linux Terminal
sudo apt-get install python3
```

#### Install Adafruit Python Library for DHT11

``` Linux
sudo pip3 install opencv-python
```

#### Install IP Webcam On Your Phone

Go to the [app store](https://play.google.com/store/apps/details?id=com.pas.webcam&hl=en_US) on your phone (it has to be an Android phone) and download the IP Webcam App.

#### Motion Sensor Wiring 

Connect the Raspberry Pi device to the motion sensor by following these steps:

1.  Connect the VCC pin of the motion sensor to the 5V pin of the Raspberry Pi.
2.  Connect the GND pin of the motion sensor to the GND pin of the Raspberry Pi.
3.  Connect the data pin of the DHT11 sensor to any GPIO pin of the Raspberry Pi. In our case we use the GPIO 12 which corresponds to pin 32, but feel free to change it.

#### Download Files from Git and Run Program

Download all the files from this repository. Open the IP Webcam app on your phone and place it somewhere with good visibility of your attic (Make sure that both devices are connected to the same Wi-Fi network). Update the IP addresses from the app on the code.

Go inside the Smart-Attic folder, and run the camera_client.py file with:

```Linux Terminal
python3 camera_client.py
```


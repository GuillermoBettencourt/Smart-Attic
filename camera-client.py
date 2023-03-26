from gpiozero import MotionSensor

import io
import picamera
import urllib.request
import requests
import cv2
import numpy as np
import time


IP_ADDRESS = "192.168.139.99"
PORT = "4747"

address = 'http://localhost:5000/intruder_detected'
#camera_url = 'http://192.168.139.99:4747/video'
camera_url = f"http://{IP_ADDRESS}:{PORT}/video"
activate_flash_url = f"http://{IP_ADDRESS}:{PORT}/cgi-bin/configManager.cgi?action=setConfig&Lighting[0].Enabled=true&Lighting[0].LightType=Flash&Lighting[0].BrightValue=50&Lighting[0].SensitiveValue=50"
deactivate_flash_url = f"http://{IP_ADDRESS}:{PORT}/cgi-bin/configManager.cgi?action=setConfig&Lighting[0].Enabled=false"

pir = MotionSensor(12)
i = 0

while True:
    pir.wait_for_motion()
    print("Motion detected.")
    filename = "/home/pi/Desktop/code/motion_captured" + str(i) + ".jpg"

    urllib.request.urlopen(activate_flash_url)
    time.sleep(1.5)

    cap = cv2.VideoCapture(camera_url)
    ret,frame = cap.read()
    if ret == False:
        print("Image capture failed.")
        cap.release()
        continue

    urllib.request.urlopen(deactivate_flash_url)
    cv2.imwrite(filename, frame)

    with open(filename, 'rb') as photo:
        response = requests.post(address, files={'image': photo})
        print(response.json())

    i = i + 1
    pir.wait_for_no_motion()
    cap.release()

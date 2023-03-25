from gpiozero import MotionSensor

import io
import picamera
import requests
import cv2
import numpy as np
import time

address = 'http://localhost:5000/intruder_detected'
camera_url = 'http://192.168.139.99:4747/video'

pir = MotionSensor(12)
i = 0

while True:
    pir.wait_for_motion()
    print("Motion detected.")

    filename = "/home/pi/Desktop/code/motion_captured" + str(i) + ".jpg"

    cap = cv2.VideoCapture(camera_url)
    ret,frame = cap.read()
    cv2.imwrite(filename, frame)

    with open(filename, 'rb') as photo:
        response = requests.post(address, files={'image': photo})
        print(response.json())
        
    i = i + 1
    pir.wait_for_no_motion()
    cap.release()
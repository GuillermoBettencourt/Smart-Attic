from gpiozero import MotionSensor

import urllib.request
import requests
import cv2
import time


IP_ADDRESS_CAMERA = "192.168.139.46"
PORT_CAMERA = "8080"

IP_ADDRESS_SERVER = "192.168.139.248"
PORT_SERVER = "5000"


intruder_detected_address = f'http://{IP_ADDRESS_SERVER}:{PORT_SERVER}/intruder_detected'
security_status_address = f'http://{IP_ADDRESS_SERVER}:{PORT_SERVER}/get_security_status'

camera_url = f"http://{IP_ADDRESS_CAMERA}:{PORT_CAMERA}/video"
activate_flash_url = f"http://{IP_ADDRESS_CAMERA}:{PORT_CAMERA}/enabletorch"
deactivate_flash_url = f"http://{IP_ADDRESS_CAMERA}:{PORT_CAMERA}/disabletorch"


pir = MotionSensor(12)
i = 0

while True:

    pir.wait_for_motion()
    print("Motion detected.")
    security_status = bool(requests.get(security_status_address).json()['isEnabled'])
    if security_status == True:
        filename = "/home/pi/Desktop/code/motion_captured" + str(i) + ".jpg"

        urllib.request.urlopen(activate_flash_url)
        time.sleep(0.5)

        cap = cv2.VideoCapture(camera_url)
        ret,frame = cap.read()
        if ret == False:
            print("Image capture failed.")
            cap.release()
            continue

        urllib.request.urlopen(deactivate_flash_url)
        cv2.imwrite(filename, frame)

        with open(filename, 'rb') as photo:
            response = requests.post(intruder_detected_address, files={'image': photo})
            print(response.json())
            
        i = i + 1
        cap.release()   
    
    pir.wait_for_no_motion()
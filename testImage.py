import requests

url = 'http://localhost:5000/intruder_detected'
filename = '/mnt/c/Users/guill/OneDrive/Escritorio/test_image.jpg'

with open(filename, 'rb') as photo:
    response = requests.post(url, files={'image': photo})
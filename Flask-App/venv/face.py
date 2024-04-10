import requests
import base64
import cv2
import json 

img = cv2.imread("D://VIT//Learning//Digital Attendance Full//received.jpg")
jpg_img = cv2.imencode(".jpeg",img)
b64_string = base64.b64encode(jpg_img[1]).decode('utf-8')

url = "https://ping.arya.ai/api/v1/liveness"
payload = { "doc_base64":b64_string, 
           "req_id":  "str"}
headers = {
  'token': '9d23aacbf2376c94a72eb7b34cd2ad1c',
  'content-type':'application/json'
}
response = requests.request("POST", url, json=payload, headers=headers)
print(response.text)

parsed_data = json.loads(response.text)

is_real_value = parsed_data['is_real']
print(is_real_value)

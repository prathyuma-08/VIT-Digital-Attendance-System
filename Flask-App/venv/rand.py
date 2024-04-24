import qrcode
import datetime
import time

for i in range(120):
    N = 10
    res = '/camera ' + str(datetime.datetime.now())
    print(res)
    img = qrcode.make(res)
    img.save("myqrcode.png")
    time.sleep(2)
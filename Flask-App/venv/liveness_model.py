import numpy as np
from keras.preprocessing import image
import os
save_path = '.'
from tensorflow.keras.models import load_model
model = load_model(os.path.join(save_path,"liveness.h5"))

# Load the image taken from camera
img_path = 'D:/VIT/Learning/Digital Attendance Full/received.jpg'
img = image.load_img(img_path, target_size=(128, 128))

# Preprocess the image
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)
img_array /= 255.0  # Normalize the image

# Make prediction
prediction = model.predict(img_array)

# Print prediction
if prediction<0.5:
    print("Real")
    print("Probability of being a real image:", 1 - prediction[0][0])
else:
    print("Spoof")
    print("Probability of being a spoofed image:", prediction[0][0])
import face_recognition
import cv2
import os
import glob
import numpy as np
import json

class SimpleFacerec:
    def __init__(self):
        self.known_face_encodings = []
        self.known_face_names = []

        # Resize frame for a faster speed
        self.frame_resizing = 0.25

    def load_encoding_images(self, images_path):
        """
        Load encoding images from path
        :param images_path:
        :return:
        """
        # Load Images
        images_path = glob.glob(os.path.join(images_path, "*.*"))

        print("{} encoding images found.".format(len(images_path)))

        # Store image encoding and names
        batch_face_encodings = []
        batch_face_names = []

        for img_path in images_path:
            img = cv2.imread(img_path)
            rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

            # Get the filename only from the initial file path.
            basename = os.path.basename(img_path)
            (filename, ext) = os.path.splitext(basename)
            # Get encoding
            img_encoding = face_recognition.face_encodings(rgb_img)[0]

            # Store file name and file encoding
            batch_face_encodings.append(img_encoding)
            batch_face_names.append(filename)

            # If the batch size reaches a certain threshold (e.g., 32), process the batch
            if len(batch_face_encodings) == 32:
                self.known_face_encodings.extend(batch_face_encodings)
                self.known_face_names.extend(batch_face_names)
                batch_face_encodings = []
                batch_face_names = []

        # Process the remaining images if any
        if batch_face_encodings:
            self.known_face_encodings.extend(batch_face_encodings)
            self.known_face_names.extend(batch_face_names)

        print("Encoding images loaded")

    # Other methods remain unchanged
    def detect_known_faces(self, frame):
        small_frame = cv2.resize(frame, (0, 0), fx=self.frame_resizing, fy=self.frame_resizing)
        # Find all the faces and face encodings in the current frame of video
        # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        face_names = []
        for face_encoding in face_encodings:
            # See if the face is a match for the known face(s)
            matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding)
            name = "Unknown"

            # Or instead, use the known face with the smallest distance to the new face
            face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)
            if matches[best_match_index]:
                name = self.known_face_names[best_match_index]
            face_names.append(name)

        # Convert to numpy array to adjust coordinates with frame resizing quickly
        face_locations = np.array(face_locations)
        face_locations = face_locations / self.frame_resizing
        return face_locations.astype(int), face_names

    def save_model(self, filename):
        with open(filename, 'w') as f:
            json.dump({
                'known_face_encodings': self.known_face_encodings,
                'known_face_names': self.known_face_names
            }, f)
            
    def load_model(self, filename):
        with open(filename, 'rb') as f:
            with open(filename, 'r') as f:
                data = json.load(f)
                self.known_face_encodings = [np.array(enc) for enc in data['known_face_encodings']]
                self.known_face_names = data['known_face_names']
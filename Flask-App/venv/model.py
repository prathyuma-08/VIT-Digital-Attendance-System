from flask import Flask,jsonify,request
import cv2
import threading
from simple_facerec.simple_facerec import SimpleFacerec
from openpyxl import load_workbook
from datetime import datetime

app = Flask(__name__)

sfr = SimpleFacerec()
sfr.load_encoding_images("D:/VIT/Learning/Digital Attendance Full/Flask-App/venv/Images/")

lock = threading.Lock()

wb = load_workbook("D:/VIT/Learning/Digital Attendance Full/attendance.xlsx")
ws = wb.active

timestamp_column_header = "Time stamp"
column_header = "Detected Names"

detected_names = ""

@app.route('/')
def hello_world():
    return 'Hello World'

@app.route('/detect_faces',methods=['POST'])
def detection():
    global detected_names
    print("Received Image")
    file = request.files['image']
    file.save('received.jpg')
    frame = cv2.imread('received.jpg')
    _, face_names = sfr.detect_known_faces(frame)
    print(face_names)
    return jsonify({'regno':face_names[0]})

@app.route('/save_to_excel', methods=['POST'])
def save_to_excel():
    data = request.json
    register_number = data.get('register_number')
    timestamp_column_index = 1
    column_index = 2
    for col in ws.iter_cols(min_col=1, max_col=ws.max_column, min_row=1, max_row=1):
        if col[0].value == timestamp_column_header:
            timestamp_column_index = col[0].column
        elif col[0].value == column_header:
            column_index = col[0].column
    if timestamp_column_index and column_index:
        next_row = ws.max_row + 1
        ws.cell(row=next_row, column=timestamp_column_index, value=datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        ws.cell(row=next_row, column=column_index, value=register_number)
        wb.save("D:/VIT/Learning/Digital Attendance Full/attendance.xlsx")
        return jsonify({'message': 'Data saved successfully'})
    else:
        return jsonify({'message': 'Column not found'})
    

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',port=80)
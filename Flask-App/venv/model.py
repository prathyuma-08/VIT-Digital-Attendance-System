from flask import Flask, render_template, url_for, request, session, redirect,jsonify
import cv2
import base64
import requests
import json
from flask_pymongo import PyMongo
from simple_facerec import SimpleFacerec
import bcrypt
from openpyxl import load_workbook
from datetime import datetime

# Load the existing Excel workbook
wb = load_workbook("C:/Users/91637/Downloads/attendance/10-04-24.xlsx")
ws = wb.active

# Assuming your existing column headers are "Time stamp" and "Detected Names"
timestamp_column_header = "Time stamp"
column_header = "Name"

app = Flask(_name_)

sfr = SimpleFacerec()
sfr.load_model('C:/Users/91637/Documents/LogIn/mongodb-user-login/trained_model.json')


app.config['MONGO_DBNAME'] = 'FaceRecog'
app.config['MONGO_URI'] = 'mongodb+srv://harikrishna050code:code@technicalcluster.w6xc2ex.mongodb.net/FaceRecog'

mongo = PyMongo(app)
# Initialize local storage

@app.route('/')
def index():
    if 'username' in session:  # Check for user in session
        return render_template('layout.html')
    else:
        return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    users = mongo.db.users  
    login_user = users.find_one({'name' : request.form['username']})

    if login_user:
        if bcrypt.checkpw(request.form['pass'].encode('utf-8'), login_user['password']):
            session['username'] = login_user['name']
            return jsonify({"login":"success"})

    return jsonify({"login":"Invalid"})

@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        users = mongo.db.users
        existing_user = users.find_one({'name' : request.form['username']})

        if existing_user is None:
            hashpass = bcrypt.hashpw(request.form['pass'].encode('utf-8'), bcrypt.gensalt())
            users.insert_one({'name' : request.form['username'], 'password' : hashpass})
            return redirect(url_for('index'))
        
        return 'That username already exists!'

    return render_template('register.html')


@app.route('/logout', methods=['POST'])
def logout():
    session.pop('username')
    return redirect(url_for('index'))


@app.route('/liveliness',methods=['POST'])
def detection():
    print("Received Image")
    file = request.files['image']
    file.save('received.jpg')
    frame = cv2.imread('received.jpg')
    jpg_img = cv2.imencode(".jpg",frame)
    b64_string = base64.b64encode(jpg_img[1]).decode('utf-8')
    url = "https://ping.arya.ai/api/v1/liveness"
    payload = { "doc_base64":b64_string, 
                "req_id":  "str"}
    headers = {
        'token': '9076ab9fa0626991a625e3e71b87ae19',
        'content-type':'application/json'
        }
    response = requests.request("POST", url, json=payload, headers=headers)
    parsed_data = json.loads(response.text)
    print(response.text)
    is_real_value = parsed_data['is_real']

    if is_real_value == True:
        return jsonify({'isreal':'true'})
    elif is_real_value == False:
        return jsonify({'isreal':"false"})
    else:
        return jsonify({'isreal': "No response"})
    
@app.route('/detect_faces',methods=['POST'])
def detect_faces():
    print("Received Image")
    file = request.files['image']
    file.save('received.jpg')
    frame = cv2.imread('received.jpg')
    _, face_names = sfr.detect_known_faces(frame)
    return jsonify({'regno':face_names[0]})
  
@app.route('/save_to_excel', methods=['POST'])
def save_to_excel():
    register_number = request.json.get('register_number')
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
        wb.save("C:/Users/91637/Downloads/attendance/10-04-24.xlsx")
        register_number=""
        return jsonify({'message':'Saved successfully'}) 
    else:
        print("Error: Column headers not found in the spreadsheet.")


if _name_ == '_main_':
    app.secret_key = 'mysecret'
    app.run(debug=True,host='0.0.0.0')
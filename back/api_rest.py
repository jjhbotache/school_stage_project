from flask import Flask,jsonify,request,send_file
import pymysql
import os
from flask_cors import CORS
app = Flask(__name__)

CORS(app)

@app.route('/')
def test():
    return '<h1>holam</h1>'


class Data_base:
    def __init__(self):
        self.connection = pymysql.connect(
            host="localhost",
            user="root",
            password="J1234567890j",
            database="school_stage_project"  
        )
        self.cursor = self.connection.cursor()
    
    def get_msgs(self):
        self.cursor.execute(f"""
                            SELECT name,png FROM designs
                            """)
        
        return self.cursor.fetchall()
    
    def insert_design(self,msg,img_dir):
        self.cursor.execute(f"""
                            INSERT INTO designs(name,png)
                            VALUES(
                                "{msg}",
                                "{img_dir}"
                                )
                            """)
        self.connection.commit()

    def delete_msg(self,id):
        self.cursor.execute(f"""
                            DELETE FROM messages
                            WHERE id = {id}
                            """)
        self.connection.commit()
        
    def update_msg(self,id,msg):
        self.cursor.execute(f"""
                            UPDATE messages
                            SET msg = "{msg}"
                            WHERE id = {id}
                            """)
        self.connection.commit()
        


# ----------------------------------------------------------------------------------------
@app.route("/msg")
def show_msng():
    os.system("cls") #clean console
    db = Data_base() #connect
    data = db.get_msgs() #getting the data
    to_send = {
        "src":f"http://localhost:1000/img/{data[0][0]}"
    }
        
    return jsonify(to_send)    #return the data

@app.route("/img/<string:name>")
def get_img(name):
    return send_file(f"imgs/Que_tu_niña_interior_viva_orgullosa_del_mujeron_que_eres.png", mimetype='image/png')

@app.route("/msg",methods=["POST"])
def send_msg():
    os.system("cls")
    msg = request.form["msg"]
    print("~"*50)
    print(msg)
    print("~"*50)
    img = request.files["img"]
    route = "imgs/"+msg
    img.save(route)
    

    db=Data_base()
    db.insert_design(msg,route)
    return f"saved in {route}"

@app.route("/msg/<int:id>",methods=["DELETE"])
def delete_msg(id):
    os.system("cls")
    db=Data_base()
    db.delete_msg(id)
    print(db.get_msgs())
    return "done"

@app.route("/msg/<int:id>",methods=["PUT"])
def update_msg(id):
    os.system("cls")
    sended_msg = request.json["msg"]
    db=Data_base()
    db.update_msg(id,sended_msg)
    print(db.get_msgs())
    return "done"

# ----------------------------------------------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True,port=1000)
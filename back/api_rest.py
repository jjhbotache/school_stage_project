from flask import Flask,jsonify,request
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
        data = self.cursor.execute(f"""
                                    SELECT * FROM messages
                                    """)
        
        return self.cursor.fetchall()
    
    def insert_msg(self,msg):
        self.cursor.execute(f"""
                            INSERT INTO messages(msg)
                            VALUES("{msg}")
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
    db = Data_base() #connect
    os.system("cls") #clean console

    print("~"*100)
    
    data = db.get_msgs() #getting the data
    print(data)     
    print("~"*100)
    return jsonify(data)    #return the data

@app.route("/msg",methods=["POST"])
def send_msg():
    os.system("cls")
    sended_msg = request.json["msg"]
    db=Data_base()
    db.insert_msg(sended_msg)
    print(db.get_msgs())
    return "done"

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
from flask import Flask,jsonify,request,send_file
import pymysql
import os
import re
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

rgx = re.compile(r'^[\w\-.]+$')

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
    
    # def get_msgs(self):
    #     self.cursor.execute(f"""
    #                         SELECT name,png FROM designs
    #                         """)
        
    #     return self.cursor.fetchall()
    
    # def insert_design(self,msg,img_dir):
    #     self.cursor.execute(f"""
    #                         INSERT INTO designs(name,png)
    #                         VALUES(
    #                             "{msg}",
    #                             "{img_dir}"
    #                             )
    #                         """)
    #     self.connection.commit()

    # def delete_msg(self,id):
    #     self.cursor.execute(f"""
    #                         DELETE FROM messages
    #                         WHERE id = {id}
    #                         """)
    #     self.connection.commit()
        
    # def update_msg(self,id,msg):
        # self.cursor.execute(f"""
        #                     UPDATE messages
        #                     SET msg = "{msg}"
        #                     WHERE id = {id}
        #                     """)
        # self.connection.commit()
        
    def save_design(self,name,img_route,ai_route):
        try:
            self.cursor.execute(f"""
                                INSERT INTO designs(name,img,ai)
                                VALUES(
                                    "{name}",
                                    "{img_route}",
                                    "{ai_route}"
                                )
                                """)
            self.connection.commit()
            return True
        except Exception as e:
          print('An exception occurred: ',e)
          return False
        
    def get_all_designs(self):
        try:
            self.cursor.execute(f"""
                                SELECT name,img,ai FROM designs
                                """)
            data = self.cursor.fetchall()
            print(data)
            formated_data = []
            for row in data:
                formated_data.append(
                    {
                        "name":row[0],
                        "img_url":row[1],
                        "ai_url":row[2]
                    }
                )
            return formated_data
        except Exception as e:
            print('An exception occurred: ',e)
            return False
        


# ----------------------------------------------------------------------------------------
@app.route("/design", methods=["POST"])
def save_img():
    name = request.form["name"]
    img = request.files["img"]
    ai = request.files["ai"]

    if not rgx.match(name):
        return f"file with name {name} is unvalid"
    
    route_img = f"img/{name}"
    route_ai = f"ai/{name}"

    if os.path.isfile(route_ai) or os.path.isfile(route_img):
        return f"file with name {name} already exist"
    else:
        try:
            img.save(route_img)
            ai.save(route_ai)
            connection = Data_base()
            connection.save_design(
                name,
                route_img,
                route_ai
            )
            return "Saved succesfully"
        except Exception as e:
            return f"Something went wrong {e}"

@app.route("/design", methods=["GET"])
def get_imgs():
    connection = Data_base()
    return jsonify(connection.get_all_designs())
# @app.route("/img/<string:name>")
# def get_img(name):
#     return send_file(f"imgs/Que_tu_niña_interior_viva_orgullosa_del_mujeron_que_eres.png", mimetype='image/png')


# ----------------------------------------------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True,port=1000)
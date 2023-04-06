from flask import Flask,jsonify,request,send_file
import pymysql
import os
import re
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
                                SELECT name,img,ai,id_designs FROM designs
                                """)
            data = self.cursor.fetchall()
            print(data)
            formated_data = []
            os.system("cls")
            for row in data:
                formated_data.append(
                    {
                        "name":row[0],
                        "img_url":row[1],
                        "ai_url":row[2],
                        "id": row[3],
                    }
                )
            return formated_data
        except Exception as e:
            print('An exception occurred: ',e)
            return False
      
    def update_design(self,id,field,new_data):
        assert field in ["name","img","ai"]
        self.cursor.execute(f"""
                            UPDATE designs
                            SET {field} = "{new_data}"
                            WHERE id_designs = {id}
                            """)
        self.connection.commit()

    def delete_design(self,id):
        self.cursor.execute(f"""
                            DELETE FROM DESIGNS
                            WHERE id_designs = {id}
                            """)
        self.connection.commit()
# ----------------------------------------------------------------------------------------
@app.route("/design", methods=["POST"])
def save_img():
    name = request.form["name"]
    files_name = request.form["filesName"]
    img = request.files["img"]
    ai = request.files["ai"]
    print("name: ",name)

    route_img = f"img/{files_name}.png"
    route_ai = f"ai/{files_name}.ai"

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
def get_designs():
    connection = Data_base()
    return jsonify(connection.get_all_designs())

@app.route("/<string:kind>/<string:name>")
def get_file(kind,name):
    route = f"{kind}/{name}"
    if kind == "img":
        return send_file(route, mimetype='image/png')
    elif kind == "ai":
        return send_file(route)

@app.route("/update_design/<int:id>/<string:field>", methods=["POST"])
def update(id,field):
    try:
        if field == "name":
            data = request.get_json()["new_data"]
            conn = Data_base()
            conn.update_design(id,field,data)
            
        if field == "img":
            print("changing img")
            conn = Data_base()
            designs = conn.get_all_designs()
            route_img = list(filter(lambda design : design["id"]==id, designs))[0]["img_url"]
            print("changing the img at ",route_img)
            
            img = request.files["img"]
            os.remove(route_img)
            img.save(route_img)
        
        if field == "ai":
            print("changing img")
            conn = Data_base()
            designs = conn.get_all_designs()
            route_ai = list(filter(lambda design : design["id"]==id, designs))[0]["ai_url"]
            ai = request.files["ai"]
            os.remove(route_ai)
            ai.save(route_ai)
        
        return jsonify({"msg":"updated succesfully"})
    
    except Exception as e:
        return jsonify({"msg":f"An exception occurred: {e}"})
    
@app.route("/delete_design/<int:id>", methods=["DELETE"])
def delete_design(id):
    try:
        print(f"DELETING design with id: {id}")
        conn = Data_base()
        designs = conn.get_all_designs()
        design = list(filter(lambda design : design["id"]==id, designs))[0]
        route_ai=design["ai_url"]
        route_img=design["img_url"]
        os.remove(route_ai)
        os.remove(route_img)
        conn.delete_design(id)
        
        return jsonify({"msg":"deleted succesfully"})
    
    except Exception as e:
        return jsonify({"msg":f"An exception occurred: {e}"})
    
      
# ----------------------------------------------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True,port=1000)
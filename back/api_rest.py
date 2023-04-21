from flask import Flask,jsonify,request,send_file,redirect
import pymysql
import os
import re
from flask_cors import CORS
import hashlib
from send_mail import *
import random

app = Flask(__name__)
CORS(app)

# database data
# Server: sql10.freemysqlhosting.net
# Name: sql10612108
# Username: sql10612108
# Password: CeU5TeAVxP
# Port number: 3306

class Data_base:
    def __init__(self):
        self.connection = pymysql.connect(
            host="localhost",
            user="root",
            password="J1234567890j",
            database="school_stage_project"  
            # host="sql10.freemysqlhosting.net",
            # user="sql10612108",
            # password="J1234567890j",
            # database="sql10612108"  
        )
        self.cursor = self.connection.cursor()
        
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
                                SELECT name,img,ai,id FROM designs
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
                            WHERE id = {id}
                            """)
        self.connection.commit()

    #CRUD
    
    def create(self, table, data):
        
        columns = data.keys()
        query = f"INSERT INTO {table} ({', '.join(columns)}) VALUES ("
        for column in columns:
            query += data[column]+", "
        
        query = query[:-2]+")"
        
        print(query)
        self.cursor.execute(query)
        self.connection.commit()

    def read(self, table, columns=[], where=None):
        columns = ', '.join(columns) if len(columns) > 0 else "*"
        query = f"SELECT {columns} FROM {table}"
        if where:   
            query += f" WHERE {where}"
        print(query)
        self.cursor.execute(query)
        result = self.cursor.fetchall()
        return result

    def update(self, table, data, where):
        columns = list(data.keys())
        assert len(columns)==1
        query = f"UPDATE {table} SET {columns[0]} = {data[columns[0]]} WHERE {where}"
        self.cursor.execute(query)
        self.connection.commit()
        return self.cursor.rowcount

    def delete(self, table, where):
        query = f"DELETE FROM {table} WHERE {where}"
        self.cursor.execute(query)
        self.connection.commit()
        return self.cursor.rowcount

# ----------------------------------------------------------------------------------------
# designs
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
def update_design(id,field):
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
        conn.delete_design(id)
        os.remove(route_ai)
        os.remove(route_img)
        
        return jsonify({"msg":"deleted succesfully"})
    
    except Exception as e:
        print(e)
        return jsonify({"msg":f"An exception occurred: {e}"})
      
# ----------------------------------------------------------------------------------------
# users & admin
@app.route("/get_admin", methods=["POST"])
def get_admin():
    try:
        print(f"getting admin ",request.get_json()["id"])
        credentials = request.get_json()
        print(credentials)
        conn = Data_base()
        result = conn.read(
                "admins",
                ["id_user_admin"],
                f"id_user_admin={credentials['id']}"
            )[0][0] 
        
        return jsonify({"admin":result,})
    
    except Exception as e:
        return jsonify({"msg":f"An exception occurred: {e}"})
      
@app.route("/get_user", methods=["POST"])
def get_user():
    try:
        print(f"getting user ",request.get_json()["id"])
        credentials = request.get_json()
        print(credentials)
        conn = Data_base()
        result = conn.read(
                "users",
                [], #all
                f"id={credentials['id']} AND phone = {credentials['phone']}"
            )[0]
        
        return jsonify(
            {
                "id":result[0],
                "first_name":result[1],
                "last_name":result[2],
                "phone":result[3],
                "email":result[4],
            }
        )
    
    except Exception as e:
        return jsonify({"msg":f"An exception occurred: {e}"})
      
@app.route("/add_user", methods=["POST"])
def add_user():
    try:
        print(f"adding user ",request.get_json()["first_name"])
        info = request.get_json()
        print(info)
        conn = Data_base()
        result = conn.create(
                "users",
                info
            )
        
        return jsonify(
            {
                "result":result,
            }
        )
    
    except Exception as e:
        return jsonify({"msg":f"An exception occurred: {e}"})
  
@app.route("/verify/<string:email>")
def sendVerificationNumber(email):
    # try:
    verification_code = generate_4_random_digits()
    with open(f'codes/verification_code_for_{email}.bin', 'wb') as f:
        f.write(str(verification_code).encode())
    
    send_mail(
        email,
        f"Your verification code is {verification_code}",
        f"Your verification code is {verification_code}"
        )
    
    return jsonify({"msg":"succesfully :D"})
    # except:
    #     return jsonify({"msg":"failed"})
    
@app.route("/test/<string:email>/<string:number>")
def testVerificationNumber(email,number):
    # try:
    verification_code = ""
    with open(f'codes/verification_code_for_{email}.bin', 'rb') as f:
        verification_code = f.read().decode()
        if verification_code == number:
            
            conn = Data_base()
            id = conn.read(
                "users",
                ["id"],
                f"email='{email}'"
            )[0][0]
            print(id)
            
            return jsonify(
                {
                    "msg":"succesfully :D",
                    "hash":""
                }
                        )
        else:
            return jsonify({"msg":"failed"})
    
    # except:
    #     return jsonify({"msg":"failed"})

# ----------------------------------------------------------------------------------------
# general managment
@app.route("/insert/<string:table>",methods=["POST"])
def insert(table):
    try:
        conn = Data_base()
        data = request.get_json()
        conn.create(table,data)
        return jsonify({"msg":f"created succesfully"})
    except Exception as e:
        return jsonify({"msg":f"An error ocurred: {e}"})
 
@app.route("/read/<string:table>")
def read(table):
    try:
        conn = Data_base()
        return jsonify(conn.read(table))
    except Exception as e:
        return jsonify({"msg":f"An error ocurred: {e}"})
 
@app.route("/update/<string:table>/<int:id>",methods=["PUT"])
def update(table,id):
    try:
        conn = Data_base()
        data = request.get_json()
        conn.update(table,data,f'id={id}')
        return jsonify({"msg":"updated successfully"})
    except Exception as e:
        return jsonify({"msg":f"An error ocurred: {e}"})
 
@app.route("/delete/<string:table>/<int:id>",methods=["DELETE"])
def delete(table,id):
    try:
        conn = Data_base()
        conn.delete(table,f'id={id}')
        return jsonify({"msg":"deleted successfully"})
    except Exception as e:
        return jsonify({"msg":f"An error ocurred: {e}"})
 
# ----------------------------------------------------------------------------------------

#This is a function that is used to create a hash for a user 
# def string_to_hash(string):
#     hash_object = hashlib.sha512(string.encode())
#     hex_dig = hash_object.hexdigest()
#     return hex_dig[:255]
def generate_4_random_digits():
        digitos = ""
        for i in range(4):
            digitos += str(random.randint(0, 9))
        return digitos

# ----------------------------------------------------------------------------------------


if __name__ == "__main__":
    app.run(debug=True,port=1000)
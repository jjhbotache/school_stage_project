from flask import Flask,jsonify,request,send_file,redirect
import pymysql
import os
import re
from flask_cors import CORS
from send_mail import *
from jwt_functions import *
from functools import wraps
import random
import csv
import sqlite3



#------------
# locker decorator
def locked_route(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if validate_tk(request.headers["auth"]):
            return func(*args, **kwargs)
        else:
            raise Exception
    return wrapper

# locker decorator for users
def locked_route_for_anyone(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        conn = Data_base()
        userList = [row[0] for row in  conn.read("users",["id"])]
        token = request.headers["auth"]
        isValid = validate_user_tk(token,userList)
        if isValid:
            return func(*args, **kwargs)
        else:
            raise Exception
    return wrapper

#------------

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
        
    def save_real_design(self,name,img_route,dxf_route):
        try:
            self.cursor.execute(f"""
                                INSERT INTO real_designs(name,img,dxf)
                                VALUES(
                                    "{name}",
                                    "{img_route}",
                                    "{dxf_route}"
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
      
    def get_all_real_designs(self):
        try:
            self.cursor.execute(f"""
                                SELECT name,img,dxf,id FROM real_designs
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
                        "dxf_url":row[2],
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
                            SET {field} = {new_data}
                            WHERE id = {id}
                            """)
        self.connection.commit()
 
    def update_real_design(self,id,field,new_data):
        assert field in ["name","img","dxf"]
        self.cursor.execute(f"""
                            UPDATE real_designs
                            SET {field} = {new_data}
                            WHERE id = {id}
                            """)
        self.connection.commit()
 
    def delete_design(self,id):
        self.cursor.execute(f"""
                            DELETE FROM designs
                            WHERE id = {id}
                            """)
        self.connection.commit()
        
    def delete_real_design(self,id):
        self.cursor.execute(f"""
                            DELETE FROM real_designs
                            WHERE id = {id}
                            """)
        self.connection.commit()

    #CRUD
    
    def create(self, table, data:dict):
        
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
@locked_route
def save_design():
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

@app.route("/real_design", methods=["POST"])
@locked_route
def save_real_design():
    name = request.form["name"]
    files_name = request.form["filesName"]
    img = request.files["img"]
    dxf = request.files["dxf"]
    print("name: ",name)
    print("files_name: ",files_name)

    route_img = f"img/{files_name}.png"
    route_dxf = f"dxf/{files_name}.dxf"

    if os.path.isfile(route_dxf) or os.path.isfile(route_img):
        return f"file with name {name} already exist"
    else:
        try:
            img.save(route_img)
            dxf.save(route_dxf)
            connection = Data_base()
            connection.save_real_design(
                name,
                route_img,
                route_dxf
            )
            return "Saved succesfully"
        except Exception as e:
            return f"Something went wrong {e}"

@app.route("/design", methods=["GET"])
def get_designs():
    connection = Data_base()
    return jsonify(connection.get_all_designs())      
        
@app.route("/update_design/<int:id>/<string:field>", methods=["POST"])
@locked_route
def update_design(id,field):
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
    # try:
    #     return jsonify({"msg":"updated succesfully"})    
    # except Exception as e:
    #     return jsonify({"msg":f"An exception occurred: {e}"})
    
@app.route("/update_real_design/<int:id>/<string:field>", methods=["POST"])
@locked_route
def update_real_design(id,field):
    if field == "name":
        data = request.get_json()["new_data"]
        conn = Data_base()
        conn.update_real_design(id,field,data)
        
    if field == "img":
        print("changing img")
        conn = Data_base()
        designs = conn.get_all_real_designs()
        route_img = list(filter(lambda design : design["id"]==id, designs))[0]["img_url"]
        print("changing the img at ",route_img)
        img = request.files["img"]
        print("REMOVING")
        os.remove(route_img)
        print("SAVING")
        img.save(route_img)
        
    if field == "dxf":
        print("changing img")
        conn = Data_base()
        designs = conn.get_all_real_designs()
        route_dxf = list(filter(lambda design : design["id"]==id, designs))[0]["dxf_url"]
        dxf = request.files["dxf"]
        print("REMOVING DXF")
        os.remove(route_dxf)
        print("SAVING DXF")
        dxf.save(route_dxf)
  
    return jsonify({"msg":"updated succesfully"})    
    
@app.route("/delete_design/<int:id>", methods=["DELETE"])
@locked_route
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
      
@app.route("/delete_real_design/<int:id>", methods=["DELETE"])
@locked_route
def delete_real_design(id):
    try:
        print(f"DELETING real design with id: {id}")
        conn = Data_base()
        designs = conn.get_all_real_designs()
        design = list(filter(lambda design : design["id"]==id, designs))[0]
        route_dxf=design["dxf_url"]
        route_img=design["img_url"]
        conn.delete_real_design(id)
        os.remove(route_dxf)
        os.remove(route_img)
        
        return jsonify({"msg":"deleted succesfully"})
    
    except Exception as e:
        print(e)
        return jsonify({"msg":f"An exception occurred: {e}"})
      
      
@app.route("/<string:kind>/<string:name>/<string:token>")
# it's locked just for Ai files
def get_file(kind,name,token):
    route = f"{kind}/{name}"
    if kind == "img":
        return send_file(route, mimetype='image/png')
    elif     kind == "ai"\
        or   kind == "dxf":  
        try:
            if validate_tk(token): return send_file(route)
        except:
            return jsonify({"msg": "Unauthorized"}), 401    

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
        print(result)
        return jsonify(
            {
                "id":result[0],
                "first_name":result[1],
                "last_name":result[2],
                "phone":result[3],
                "email":result[4],
                "password":"-" if result[5] else None,
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
  
#============== security

@app.route("/verify/<string:email>",methods=["POST"])
def createTk(email):
    conn = Data_base()
    password = request.get_json()["password"]
    if password == (conn.read("users",["password"],f"email = '{email}' ")[0][0]):
        
        token_obj = create_tk({"password":password})
        print(token_obj)
        print(type(token_obj))
        return jsonify({"tk":token_obj})
    else:
        return jsonify({"msg":"no exists"})
    
@app.route("/test")
@locked_route
def validateTk():
    return jsonify({"msg":"token veified"})
    
@app.route("/verify-user/<string:email>")
def createUserTk(email):
    # get the id from the email
    conn = Data_base()
    id = conn.read("users",["id"],f"email = '{email}'")[0][0]
    print(id)
    
    # create a random code of 4 digits
    code = random.randint(1000,9999)
    conn = sqlite3.connect('codes.db');c = conn.cursor();c.execute(f"INSERT INTO codes VALUES ('{id}','{code}')");conn.commit();conn.close()
    
    # send the code to the email
    send_mail(email,str(code),f"ur code is: {code}")




    conn = Data_base()
    id = conn.read("users",["id"],f"email = '{email}'")[0][0]
    print(id)
    

    conn = Data_base()
    id = conn.read("users",["id"],f"email = '{email}'")[0][0]
    print(id)
    # connect with a sqlite3 db
    
    return jsonify({"msg":"email sended"})
    
@app.route("/test-user/<string:code>")
def validateUser(code):
    # connect to codes  sqlite3 database
    conn = sqlite3.connect('codes.db')
    c = conn.cursor()
    # get the id of the user
    print(code)
    id = c.execute(f"SELECT id FROM codes WHERE code = '{code}'").fetchall()[0][0]
    print(id)
    # return jsonify({"msg":"email sended"})
    
    # delete the register
    c.execute(f"DELETE FROM codes WHERE id = '{id}'")
    conn.commit()
    conn.close()
    # create a token with the id
    token_obj = create_tk({"id":id})
    return jsonify({"userTk":token_obj})
    
@app.route("/user-hi/<string:msg>")
@locked_route_for_anyone
def test(msg):
    return jsonify({"msg":msg})
    
# ----------------------------------------------------------------------------------------
# general managment
@app.route("/insert/<string:table>",methods=["POST"])
@locked_route
def insert(table):
    conn = Data_base()
    data = request.get_json()
    conn.create(table,data)
    return jsonify({"msg":f"created succesfully"})

@app.route("/read/<string:table>")
@locked_route
def read(table):
    conn = Data_base()
    return jsonify(conn.read(table))
 
@app.route("/update/<string:table>/<int:id>",methods=["PUT"])
@locked_route
def update(table,id):
    conn = Data_base()
    data = request.get_json()
    conn.update(table,data,f'id={id}')
    return jsonify({"msg":"updated successfully"})
 
@app.route("/delete/<string:table>/<int:id>",methods=["DELETE"])
@locked_route
def delete(table,id):
    conn = Data_base()
    conn.delete(table,f'id={id}')
    return jsonify({"msg":"deleted successfully"})
 
# ----------------------------------------------------------------------------------------


if __name__ == "__main__":
    app.run(debug=True,port=1000)
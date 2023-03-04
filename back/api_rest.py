from flask import Flask,jsonify,request
import mysql.connector
import os

app = Flask(__name__)

@app.route('/ping')
def test():
    return 'pong!'

# ----------------------------------------------------------------------------------------
@app.route("/msg",methods=["POST"])
def send_msg():
    sended_msg = request.json["msg"]
    print(sended_msg)
    
    # Conectar a la base de datos
    conexion = mysql.connector.connect(
        host="localhost",
        user="root",
        password="J1234567890j",
        database="school_stage_project"
    )
    

    
    # Crear un cursor
    cursor = conexion.cursor()

    # Ejecutar una consulta SQL
    # cursor.execute(f"INSERT INTO messages(msg)VALUES({sended_msg})")
    cursor.execute(f"INSERT INTO messages(msg)VALUES('{sended_msg}')")
    # return jsonify({"msg":"an img*"})

    # Cerrar la conexión
    conexion.close()

    return "done"

@app.route("/msg")
def show_msng():
    os.system("cls")
    
    conexion = mysql.connector.connect(
        host="localhost",
        user="root",
        password="J1234567890j",
        database="school_stage_project"
    );
    cursor = conexion.cursor()

    data = cursor.execute("SELECT * FROM messages;")

    print("~"*100)
    print(data)
    print("~"*100)
    # print(data.fetchall())
    return "done with get"
# ----------------------------------------------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True,port=1000)
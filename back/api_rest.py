from flask import Flask,jsonify,request
import mysql.connector

app = Flask(__name__)

@app.route('/ping')
def test():
    return 'pong!'

# ----------------------------------------------------------------------------------------
@app.route("/mnsg",methods=["POST"])
def send_mnsg():
    sended_mnsg = request.json["mnsg"]

    # Conectar a la base de datos
    conexion = mysql.connector.connect(
        host="juanito.mysql.pythonanywhere-services.com",
        user="juanito",
        password="J1234567890j",
        database="pruebas"
    )
    return sended_mnsg

    # Crear un cursor
    cursor = conexion.cursor()

    # Ejecutar una consulta SQL
    return sended_mnsg
    cursor.execute(f"INSERT INTO mnsgs(mnsg)VALUES({sended_mnsg})")
    return sended_mnsg
    # return jsonify({"msg":"an img*"})

    # Cerrar la conexión
    conexion.close()

    return "done"

@app.route("/mnsg")
def show_msng():
    conexion = mysql.connector.connect(
        host="juanito.mysql.pythonanywhere-services.com",
        user="juanito",
        password="J1234567890j",
        database="pruebas"
    );cursor = conexion.cursor()

    data = cursor.execute("""
    SELECT * FROM mnsgs
    """)


    return data.fetchall()
# ----------------------------------------------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True,port=1000)
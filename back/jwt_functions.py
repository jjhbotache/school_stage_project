from jwt import encode,decode


password = "sErVeRpazzw0rd"

def create_tk(data:dict):
  return encode(
    payload={**data},
    key=password
    )
  
def validate_tk(token):
  try:
    return decode(token,password,("HS256"))
  except Exception as e:
    print(token)
    print(e)
    return False
  
def validate_user_tk(token,user_ids_list:list):
  try:
    data = decode(token,password,("HS256"))
    print("hola")
    print(user_ids_list)
    if int(data["id"]) in user_ids_list:
      return True
    else:
      return False
    # return True
  except Exception as e:
    print(token)
    print(e)
    return False
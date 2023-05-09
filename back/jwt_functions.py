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
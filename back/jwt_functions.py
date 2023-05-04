from jwt import encode,decode


password = "sErVeRpazzw0rd"

def create_tk(data:dict):
  return encode(
    payload={**data},
    key=password
    )
  
def validate_tk(token):
  try:
    decode(token,password,("HS256"))
    return True
  except Exception as e:
    print(token)
    print(e)
    return False
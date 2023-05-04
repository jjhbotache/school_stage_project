export const userInfoKeys = ["id", "first_name", "last_name", "phone", "email"];


export function checkLocalStorageItems(items) {
  // Comprobar si el localStorage está disponible en el navegador
  if (!window.localStorage) {
    console.error("El localStorage no está disponible en este navegador.");
    return false;
  }
  
  // Comprobar si los items están almacenados en el localStorage
  for (let item of items) {
    if (!localStorage.getItem(item)) {
      console.error(`El item ${item} no está almacenado en el localStorage.`);
      return false;
    }
  }
  
  // Todos los items están almacenados en el localStorage
  console.log("Todos los items están almacenados en el localStorage.");
  return true;
}

export function redirectNoAdmin() {
  // const encoder = new TextEncoder();
  // const str = localStorage.getItem("token");
  // const bytes = encoder.encode(str);
  // console.log(bytes); // Imprime un objeto Uint8Array con los bytes correspondientes a la cadena
  
  const token = localStorage.getItem("token");
  console.log(token);
  console.log(typeof token);
  fetch("http://127.0.0.1:1000/test",
  {
    method : "GET",
    headers : { 
      auth:token
    }
  })
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
    window.location.assign("login.html");
  });
}

export function setRequestConfig(methodGotten="GET",bodyGotten,jsonFalse=false) {
  // {
  //   method:"POST",
  //   body:data,
  //   headers : { 
  //     auth:localStorage.getItem("token")
  //   }
  // }
  const config = {
    method: methodGotten, // puedes modificar el método según tu necesidad
  };
  if (bodyGotten) {config.body = bodyGotten}
  
  const headers = {'auth': localStorage.getItem("token")};
  if (methodGotten!="GET" && !jsonFalse) {headers['Content-Type'] = 'application/json' }
  
  config.headers = headers;

  console.log(config);
  return config;
}
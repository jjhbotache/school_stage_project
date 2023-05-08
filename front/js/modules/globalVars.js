export const userInfoKeys = ["id", "first_name", "last_name", "phone", "email"];
export const apiRoute = "http://localhost:1000/";


export function checkLocalStorageItems(items=userInfoKeys) {
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
  // console.log("Todos los items están almacenados en el localStorage.");
  return true;
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

  // console.log(config);
  return config;
}

export function redirectNoAdmin(redirectUrl="login.html") {
  redirectUrl = checkLocalStorageItems()?"dashboard.html":redirectUrl;
  const token = localStorage.getItem("token");
  // console.log(token);
  // console.log(typeof token);
  fetch(apiRoute+"test",
  setRequestConfig()
  )
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
    window.location.assign(redirectUrl);
  });
}
import importElement from "/front/js/modules/elementImporter.js";
import {userInfoKeys} from '/front/js/modules/globalVars.js';
const form = document.getElementById("credentials-forms");

importElement("templates/navbar.html")
.then((element) => {
  element.querySelector("#log-stat a").textContent = checkLocalStorageItems(userInfoKeys)?localStorage.getItem("first_name"):"no logeado";
  document.getElementById("nav").appendChild(element);  
})

form.addEventListener('click', (e)=>{
  e.preventDefault();
  const id = form.querySelector("#id").value;
  const phone = form.querySelector("#phone").value;
  if (e.target.type == "submit" ) {
    fetch("http://127.0.0.1:1000/get_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: id,
        phone: phone
      }),
    })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        for (const key in result) {
          localStorage.setItem(key.toString(),(result[key]).toString())
        }
        alert(`bienvenido ${result["first_name"]}`)
        element.querySelector("#log-stat a").textContent = checkLocalStorageItems(userInfoKeys)?localStorage.getItem("first_name"):"no logeado";
      })
      .catch(error => console.error(error));
  }
})

// auxiliary functions
function checkLocalStorageItems(items) {
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

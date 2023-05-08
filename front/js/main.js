import importElement from "/front/js/modules/elementImporter.js";
import {userInfoKeys,checkLocalStorageItems} from '/front/js/modules/globalVars.js';

function logout() {
  localStorage.clear();
  window.location.assign("login.html")
}

importElement("templates/navbar.html")
.then((element) => {
  const logMenu = element.querySelector(".dropdown-menu");
  if (checkLocalStorageItems(userInfoKeys)) {

    logMenu.innerHTML += `
    <a class="dropdown-item" href="dashboard.html">Configuraciones</a>
    <div class="dropdown-divider"></div>
    <a class="dropdown-item text-danger " id="logout">Cerrar sesión</a>
    `;
    element.getElementById("logout").addEventListener('click', ()=>{logout();})
  }
  else{ 
    logMenu.innerHTML += `
    <a class="nav-link" href="login.html">login</a>
    `;
  }
  element.querySelector("#log-stat span").textContent = checkLocalStorageItems(userInfoKeys)?localStorage.getItem("first_name"):"logearse";
  document.getElementById("nav").appendChild(element);  
})


import importElement from "/front/js/modules/elementImporter.js";
import {userInfoKeys,checkLocalStorageItems} from '/front/js/modules/globalVars.js';
importElement("templates/navbar.html")
.then((element) => {
  element.querySelector("#log-stat span").textContent = checkLocalStorageItems(userInfoKeys)?localStorage.getItem("first_name"):"logearse";
  document.getElementById("nav").appendChild(element);  
})
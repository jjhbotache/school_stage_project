import importElement from "/front/js/modules/elementImporter.js";
import {userInfoKeys, checkLocalStorageItems, redirectNoAdmin} from '/front/js/modules/globalVars.js';



if (!checkLocalStorageItems(userInfoKeys)) {
  window.location.assign("login.html"); 
}
if (!localStorage.getItem("password")) {
  window.location.assign("dashboard.html"); 
}else{
  if (!localStorage.getItem("token")) {
    let password =  prompt("Introduzca su contraseña de admin");
    fetch(`http://localhost:1000/verify/${localStorage.getItem("email")}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        },
      body: JSON.stringify({
        "password": password
        })
    }).then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log(data.tk);
      console.log(typeof data.tk);
      localStorage.setItem("token",data.tk);
      console.log(localStorage.getItem("token"));
    })
    .catch(e=>{
      console.log(e);
      alert("couldn't reconize you: ");
      alert(e);
      localStorage.clear();
      window.location.assign("login.html");
    })
  }
}

importElement("templates/user-info.html")
.then((element) => {
  const name = element.getElementById("name");
  const id = element.getElementById("id");
  const phone = element.getElementById("phone");
  const email = element.getElementById("email");
  name.innerHTML = capitalizeFirstLetter(localStorage.getItem("first_name"))+" "+capitalizeFirstLetter(localStorage.getItem("last_name"));
  id.innerHTML = localStorage.getItem("id");
  phone.innerHTML = localStorage.getItem("phone");
  email.innerHTML = localStorage.getItem("email");

  const spanElements = element.querySelectorAll("span");

  const editUserInfo = element.getElementById("edit-user-info");
  const saveUserInfo = element.getElementById("save-user-info");

  editUserInfo.addEventListener('click', () => {
  spanElements.forEach(span => span.contentEditable = true);
  editUserInfo.classList.add("d-none");
  saveUserInfo.classList.remove("d-none");
  });

  saveUserInfo.addEventListener('click', () => {
  spanElements.forEach(span => span.contentEditable = false);
  editUserInfo.classList.remove("d-none");
  saveUserInfo.classList.add("d-none");
  });


  document.getElementById("info").appendChild(element);  
})


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
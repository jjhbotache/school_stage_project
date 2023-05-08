import {userInfoKeys,checkLocalStorageItems} from '/front/js/modules/globalVars.js';


if (localStorage.getItem("password")) {
  window.location.assign("dashboard-admin.html"); 
}
if (!checkLocalStorageItems(userInfoKeys)) {
  window.location.assign("login.html"); 
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
  document.getElementById("info").appendChild(element);  
})

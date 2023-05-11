import importElement from "./modules/elementImporter.js";
import {userInfoKeys, checkLocalStorageItems, apiRoute} from './modules/globalVars.js';
import {setRequestConfig} from './modules/globalVars.js';


if (!checkLocalStorageItems(userInfoKeys)) {
  window.location.assign("login.html"); 
}
if (!localStorage.getItem("password")) {
  window.location.assign("dashboard.html"); 
}else{
  if (!localStorage.getItem("token")) {
    debugger;
    let password =  prompt("Introduzca su contraseña de admin :D");
    fetch(`http://localhost:1000/verify/${localStorage.getItem("id")}`,
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
  const firstName = element.getElementById("first-name");
  const lastName = element.getElementById("last-name");
  const id = element.getElementById("id");
  const phone = element.getElementById("phone");
  const email = element.getElementById("email");
  firstName.innerHTML = localStorage.getItem("first_name");
  lastName.innerHTML = localStorage.getItem("last_name");
  id.innerHTML = localStorage.getItem("id");
  phone.innerHTML = localStorage.getItem("phone");
  email.innerHTML = localStorage.getItem("email");

  const spanElements = element.querySelectorAll("span:not([id='id'])");

  const editUserInfo = element.getElementById("edit-user-info");
  const saveUserInfo = element.getElementById("save-user-info");

  editUserInfo.addEventListener('click', () => {
  spanElements.forEach(span => span.contentEditable = true);
  editUserInfo.classList.add("d-none");
  saveUserInfo.classList.remove("d-none");
  });

  saveUserInfo.addEventListener('click', async() => {
  spanElements.forEach(span => span.contentEditable = false);

  if (
    (
      firstName.textContent!=localStorage.getItem("first_name")||
      firstName.textContent!=localStorage.getItem("last_name") ||
      phone.textContent!=localStorage.getItem("phone") ||
      email.textContent!=localStorage.getItem("email")
    )&&confirm("save changes?")) {
      const thingsToChange =[];

      if (firstName.textContent!=localStorage.getItem("first_name")) {
        console.log("changing name");
        thingsToChange.push({first_name: "'"+firstName.textContent+"'"})
      }
      if (lastName.textContent!=localStorage.getItem("last_name")) {
        console.log("changing last");
        thingsToChange.push({last_name: "'"+lastName.textContent+"'"})
      }
      if (phone.textContent!=localStorage.getItem("phone")) {
        const regex = /^\d{10}$/;
        const isValid = regex.test(phone.textContent);
        if (isValid) {
          console.log("changing phone");
          thingsToChange.push({phone: phone.textContent})
        }else{
          phone.textContent = localStorage.getItem("phone");
          alert("unvalid phone");
          location.reload();
        }
      }
      if (email.textContent!=localStorage.getItem("email")) {
        const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const isValid = re.test(email.textContent);
        if (isValid) {
          console.log("changing email");
          thingsToChange.push({email: "'"+email.textContent+"'"})
        }else{
          email.textContent = localStorage.getItem("email");
          alert("unvalid email");
          location.reload();

        }
      }

      console.log(thingsToChange);
      thingsToChange.forEach(obj => {
        fetch(
          apiRoute+"update/users/"+localStorage.getItem("id"),
          setRequestConfig("PUT",JSON.stringify(obj))
        )
        .then((json) => json.json())
        .then((response) => {
          localStorage.clear()
          window.location.assign("login.html")
        })
        .catch((error) =>console.log(error))
        
      });

  }else{
    firstName = localStorage.getItem("fist_name");
    lastName = localStorage.getItem("last_name");
    phone.textContent = localStorage.getItem("phone");
    email.textContent = localStorage.getItem("email");
  }



  editUserInfo.classList.remove("d-none");
  saveUserInfo.classList.add("d-none");
  });


  document.getElementById("info").appendChild(element);  
})


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
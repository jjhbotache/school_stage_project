import {userInfoKeys,checkLocalStorageItems,apiRoute,setRequestConfig} from './modules/globalVars.js';
import importElement from "./modules/elementImporter.js";
localStorage.removeItem("newEmailToken");

if (localStorage.getItem("password")) {
  window.location.assign("dashboard-admin.html"); 
}
if (!checkLocalStorageItems(userInfoKeys)) {
  window.location.assign("login.html"); 
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
        firstName.textContent!=localStorage.getItem("last_name") || //if someone is different and the changes are accepted
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
            await fetch(apiRoute + "verify-user/"+email.textContent+"/"+localStorage.getItem("id")).then((response) => response.json())
            .then(async json =>{
              console.log(json);
              const code = prompt(`enviamos un codigo a tu nuevo correo: ${email.textContent} \nPonlo aqui:`);
              await fetch(apiRoute + "test-user/"+code+"/"+localStorage.getItem("id")).then((response) => response.json())
              .then((json) => {
                localStorage.setItem("newEmailToken", json.token);
              })
            })
            .catch((error) => {
              console.log(error);
              alert("there was an error with the new email");
              location.reload();
            })
          }else{
            email.textContent = localStorage.getItem("email");
            alert("unvalid email");
            location.reload();
          }
        }

        console.log(thingsToChange);
        // ---------------------------------------------
        if (!localStorage.getItem("token")) {
          await fetch(apiRoute + "verify-user/" + localStorage.getItem("email")+"/"+localStorage.getItem("id"))
          .then(response => response.json())
          .then(async (json) => {
              console.log(json);
              const code = prompt(`Te hemos enviado un codigo al ${localStorage.getItem("email")} \nponlo aqui: `);
              await fetch(apiRoute + "test-user/" + code +"/"+localStorage.getItem("id"))
              .then(response => response.json())
                .then((json) => {
                  console.log(json);
                  const key = Object.keys(json)[0];
                  localStorage.setItem(key,json[key]);
                })
                .catch((error) => {
                  console.log(error);
                  alert("wrong code");
                  location.reload();
                });
              })
          .catch((error) => {
            console.log(error);
            alert("there was an error trying to send you the code");
            location.reload();
          })
        }
        thingsToChange.forEach(obj => {
          // access to the firs property of an object
          const key = obj[Object.keys(obj)[0]];
          // alert(`saving ${key}...`);
          // verify if a property exist in an object?
      
      
          if (obj.hasOwnProperty("email")) {
            console.log("adding to the object");
            console.log(localStorage.getItem("newEmailToken"));
            obj.newEmailToken = localStorage.getItem("newEmailToken");
          }
          console.log(obj);
          fetch(
            apiRoute + "user/update",
            setRequestConfig("PUT", JSON.stringify(obj))
          )
            .then((json) => json.json())
            .then((response) => {
              console.log(response);
              localStorage.clear();
              window.location.assign("login.html");
            })
            .catch((error) => console.log(error));
      
        });
        // ---------------------------------------------

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




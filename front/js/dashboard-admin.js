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

  // fetch("http://localhost:1000/getNumberUsers",{ 
  //   headers:{
  //     auth:localStorage.getItem("token")
  //   }
  // })
  // .then((value) => value.json())
  // .then((response) => {
  //   console.log(response);
  //   response["usernames"].forEach(name => {
  //     info.innerHTML += name+"<br>"
  //   });
  // })
  // .catch(e=>{
  //   console.log(e);
  //   alert("couldn't get users: ",e);
  // })

}

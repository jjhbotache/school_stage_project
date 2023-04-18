import {userInfoKeys,checkLocalStorageItems} from '/front/js/modules/globalVars.js';
const loginForm = document.getElementById("login");
const registerForm = document.getElementById("register");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const changeLink = document.getElementById("link-change");
const alertRegister = document.getElementById("alert-register");


if (checkLocalStorageItems(userInfoKeys)) {
  window.location.assign("dashboard.html"); 
}

loginForm.addEventListener('click', (e)=>{
  e.preventDefault();
  const id = loginForm.querySelector("#id").value;
  const phone = loginForm.querySelector("#phone").value;
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
        window.location.assign("dashboard.html"); 
      })
      .catch(error => console.error(error));
  }
})
registerForm.addEventListener('click', (e)=>{
  e.preventDefault();
  if (e.target.type == "submit") {
    const first_name = registerForm.querySelector("#first_name").value;
    const last_name = registerForm.querySelector("#last_name").value;
    const id = registerForm.querySelector("#id").value;
    const phone = registerForm.querySelector("#phone").value;
    const email = registerForm.querySelector("#email").value;
    if (id.length < 10 || phone.length < 10) {
      console.log("hola");
      return undefined;
    }
    fetch("http://127.0.0.1:1000/add_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        first_name:`'`+first_name+`'`,
        last_name:`'`+last_name+`'`,
        id: id,
        phone: phone,
        email:`'`+email+`'`,
      }),
    })
      .then(response => response.json())
      .then(result => {
        console.log(result);

        try {
          console.log(result.msg);
          if (result.msg.includes("Duplicate entry")) {
            alertRegister.classList.remove("d-none");
            alertRegister.querySelector("strong").textContent = "Esta cuenta ya existe";
          }
        } catch (error) {
          debugger
          change();
          title.textContent = `Bienvenido ${first_name}, logeate!`
        }
        // debugger;
      })
      .catch(error => console.error(error));
  }
})

changeLink.addEventListener('click', ()=>{change()})
function change(params) {
  loginForm.classList.toggle("d-none");
  registerForm.classList.toggle("d-none");

  if (registerForm.classList.contains("d-none")) {
    title.textContent = "Hola de vuelta!";
    subtitle.textContent = "¿Aun no eres parte de nuestro equipo?";
    changeLink.textContent = "unete aqui";
  }else{
    title.textContent = "Bienvenido al grupo Memorable";
    subtitle.textContent = "¿Ya tienes cuenta?";
    changeLink.textContent = "logeate aqui";
  }
}




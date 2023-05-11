import {userInfoKeys,checkLocalStorageItems} from './modules/globalVars.js';
const loginForm = document.getElementById("login");
const registerForm = document.getElementById("register");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const changeLink = document.getElementById("link-change");
const alertRegister = document.getElementById("alert-register");
const alertLogin = document.getElementById("alert-login");


if (checkLocalStorageItems(userInfoKeys)) {
  if (localStorage.getItem("token")) {
    window.location.assign("dashboard.html"); 
  }
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
        if (!result.msg) {
          if (!result.password) {delete result.password}
          for (const key in result) {
            localStorage.setItem(key.toString(),(result[key]).toString())
          }
        }
        if (checkLocalStorageItems(userInfoKeys)) {
          if (localStorage.getItem("password") == "-") {
            window.location.assign("dashboard-admin.html"); 
          }else {
            window.location.assign("dashboard.html"); 
          }
        }else {
          alertLogin.classList.remove("d-none");
          alertLogin.querySelector("strong").textContent = "Parece que esas no son tus credenciales o aun no haces parte de nuestro equipo";
          // return undefined;
        }

      })
      .catch(error => {
        alertLogin.classList.remove("d-none");
        alertLogin.querySelector("strong").textContent = "Lo sentimos, parece que hubo un error";
      });
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

    // valitdations ------------------------------------------------------------------------------------

    if (id.length < 10 || phone.length < 10) {
      alertRegister.classList.remove("d-none");
      alertRegister.querySelector("strong").textContent = "Tu numero celular o de identificacion no es valido";
      return undefined;
    }
    else if (!checkMail(email)) {
      alertRegister.classList.remove("d-none");
      alertRegister.querySelector("strong").textContent = "Tu email no esta bien";
      return undefined;
    }
    else if (!checkName(first_name)) {
      alertRegister.classList.remove("d-none");
      alertRegister.querySelector("strong").textContent = "Tu nombre luce muy extraño!";
      return undefined;
    }
    else if (!checkLastName(last_name)) {
      alertRegister.classList.remove("d-none");
      alertRegister.querySelector("strong").textContent = "Tu apellido luce muy extraño!";
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
          change();
          title.textContent = `Bienvenido ${first_name}, logeate!`
        }
      })
      .catch(error => console.error(error));

    
  }
})

// ------------------------------------------------------------------------------------------------

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

function checkMail(email){
	var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if (filter.test(email)) {
		return true;
	}
	return false;
}

function checkName(nombre) {
  const exregNombre = /^[a-zA-ZÀ-ÿ]+( [a-zA-ZÀ-ÿ]+){0,5}$/;
  // Verificar si el nombre cumple con la expresión regular
  if (exregNombre.test(nombre)) {
    return true;
  } else {
    return false;
  }
}

function checkLastName(apellido) {
  const exregApellido = /^[a-zA-ZÀ-ÿ]+ ?([a-zA-ZÀ-ÿ]+)?$/;
  // Verificar si el apellido cumple con la expresión regular
  if (exregApellido.test(apellido)) {
    return true;
  } else {
    return false;
  }
}


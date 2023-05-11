import importElement from "./modules/elementImporter.js";
import { redirectNoAdmin } from "./modules/globalVars.js";
import { setRequestConfig } from "./modules/globalVars.js";

redirectNoAdmin()

let element;
let inputWine;
let btnAdd;
let btnUpdate;
let btnDelete;

importElement("templates/manager.html")
.then((response) => {
  element = response;
  console.log("im an element:",element);
  
  element.getElementById("manager-title").textContent = "Wine manager";
  element.getElementById("read-window").querySelector("label").textContent = "Wine kinds";
  element.getElementById("read-window").querySelector("select").id="wine-kinds-viewer";
  loadWines(element.getElementById("read-window").querySelector("select"));
  inputWine = element.getElementById("input-manager");
  btnAdd = element.getElementById("btn-add");
  btnUpdate = element.getElementById("btn-update");  
  btnDelete = element.getElementById("btn-delete");  

  document.getElementById("manager").appendChild(element);  

  btnAdd.addEventListener('click', ()=>{
    if (inputWine.value != "") {
      fetch(`http://127.0.0.1:1000/insert/wine_kinds`,setRequestConfig("POST",JSON.stringify({name:`"${inputWine.value}"`})))
      .then(response => response.json())
      .then(msg => {console.log(msg);location.reload();})
      .catch(err => console.log(err));
    } else {
      alert("a wine needs a name")
    }
  });
})








function loadWines(select) {
  console.log("trying to get wines");
  fetch("http://127.0.0.1:1000/read/wine_kinds",{method:"GET",headers:{auth:localStorage.getItem("token")}})
  .then(response=>response.json())
  .then(json=>{
    console.log(json);
    json.forEach(wine => {
      select.innerHTML +=`<option value="${wine[0]}">${wine[1]}</option>`
    });
    const options = Array.from(select.getElementsByTagName("option"))
    options.forEach(option => {
      option.addEventListener("dblclick", ()=>{optionAction(option.value, option.textContent);})
    });
    select.classList.remove("d-none");
    document.querySelector("#read-window .spinner-border").remove();
  })
  .catch(e=>{
    console.log(e);
    setTimeout(() => {
      loadWines(select);
    }, 3000);
  })
}

function optionAction(id,name) {
  inputWine.value=name;
  btnAdd.classList.add("d-none");
  btnUpdate.classList.remove("d-none");
  btnDelete.classList.remove("d-none");

  btnUpdate.addEventListener('click', ()=>{
    updateWine(id,inputWine.value);
  })
  btnDelete.addEventListener('click', ()=>{
    DeleteWine(id);
  })
}



function updateWine(id,newName) {
  fetch(`http://127.0.0.1:1000/update/wine_kinds/${id}`,setRequestConfig("PUT",JSON.stringify({name:`"${newName}"`})))
  .then(response=>response.json())
  .then((value) => {console.log(value);location.reload();})
  .catch((value) => {console.log(value);})
}

function DeleteWine(id) {
  if (confirm(`Are you sure do you want to delete to ${inputWine.value} wine?`)) {
    fetch(`http://127.0.0.1:1000/delete/wine_kinds/${id}`,setRequestConfig("DELETE"))
    .then(response=>response.json())
    .then((value) => {console.log(value);location.reload();})
    .catch((value) => {console.log(value);})
  }
}

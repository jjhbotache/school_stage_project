const select = document.getElementById("wine-kinds-viewer");
const inputWine = document.getElementById("input-wine");
const btnAdd = document.getElementById("btn-add");
const btnUpdate = document.getElementById("btn-update");
const btnDelete = document.getElementById("btn-delete");
const subtitle = document.getElementById("subtitle");

subtitle.addEventListener('click', ()=>{location.reload();})

btnAdd.addEventListener('click', ()=>{
  if (inputWine.value != "") {
    fetch(`http://127.0.0.1:1000/insert/wine_kinds`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        },
      body: JSON.stringify({name:`"${inputWine.value}"`})
    })
    .then(response => response.json())
    .then(msg => {console.log(msg);location.reload();})
    .catch(err => console.log(err));
  } else {
    alert("a wine needs a name")
  }
})

function loadWines() {
  console.log("trying to get wines");
  fetch("http://127.0.0.1:1000/read/wine_kinds")
  .then(response=>response.json())
  .then(json=>{
    json.forEach(wine => {
      select.innerHTML +=`<option value="${wine[0]}">${wine[1]}</option>`
    });
    options = Array.from(select.getElementsByTagName("option"))
    options.forEach(option => {
      option.addEventListener("dblclick", ()=>{optionAction(option.value, option.textContent);})
    });
    select.classList.remove("d-none");
    document.getElementById("spinner").remove();
  })
  .catch(e=>{
    console.log(e);
    loadWines();
  })
}
loadWines();

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
    fetch(`http://127.0.0.1:1000/update/wine_kinds/${id}`,
    {
      method:"PUT",
      headers:{'Content-Type': 'application/json'},
      body:JSON.stringify({name:`"${newName}"`})
    })
    .then(response=>response.json())
    .then((value) => {console.log(value);location.reload();})
    .catch((value) => {console.log(value);})
}

function DeleteWine(id) {
    if (confirm(`Are you sure do you want to delete to ${inputWine.value} wine?`)) {
      fetch(`http://127.0.0.1:1000/delete/wine_kinds/${id}`,{method:"DELETE"})
      .then(response=>response.json())
      .then((value) => {console.log(value);location.reload();})
      .catch((value) => {console.log(value);})
    }
}


const btnSave = document.getElementById("saveBtn");
const btnGet = document.getElementById("getBtn");
const btnDelete = document.getElementById("deleteBtn");
const btnUpdate = document.getElementById("updateBtn");
const input = document.getElementById("input");
const label = document.getElementById("label");
const select = document.getElementById("delete");

let templateContent;
// import & create template
fetch("templates/msg.html")
.then(response=>response.text())
.then(text=>{
  // creamos un elemento template
  const template = document.createElement("template");
  // al que le damos un id
  template.id = "msg-template";

  //agregamos la data obtenida de un html externo al template 
  template.innerHTML = text;
  // agregamos el elemento al documento
  document.body.appendChild(template);
  // redefinimos a templatecontent como el contenido del template
});

const msgContainer = document.getElementById("msg-container");
let msgs = [
  // [0,"hola"],
  // [1,"adios"],
  // [3,"como estas?"]
];

function getMsgs() {
  msgContainer.innerHTML=""
  fetch(
    "http://localhost:1000/msg"
  )
  .then(response => response.json())
  .then(data => {
    msgs = data;
    select.innerHTML="";
    
    msgs.forEach(msg => {
      select.innerHTML+=`
      <option value="${msg[0]}">${msg[1]}</option>
      `;
    });
    renderMsgs();
  })
}

function sendMsg(message,callback) {
  obj = {msg:message}
  console.log(`sending: ${obj}`);
  fetch(
    "http://localhost:1000/msg",
    {
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(obj)
    }
  )
  .then(respuesta=>respuesta.text())
  .then(data=>{
    callback();
    alert(data);
  })
  .catch(e=>{
    alert("somethig went wrong");
  })
}
function deleteMsg(id,callback) {
  console.log(`sending msg with id: ${id}`);
  fetch(
    `http://localhost:1000/msg/${id}`,
    {
      method:"DELETE",
      headers: {
        'Content-Type': 'application/json'
      },
    }
  )
  .then(respuesta=>respuesta.text())
  .then(data=>{
      callback();
      alert(data);
    })
  .catch(e=>{
    alert("somethig went wrong");
  })
}
function updateMsg(id,message,callback) {
  console.log(`replace the msg with id: ${id} \n with the msg: `);
  obj = {msg:message};
  fetch(
    `http://localhost:1000/msg/${id}`,
    {
      method:"PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(obj)
    }
  )
  .then(respuesta=>respuesta.text())
  .then(data=>{
      callback();
      alert(data);
    })
  .catch(e=>{
    alert("somethig went wrong");
  })
  
}

// btnGet.addEventListener("click",()=>{renderMsgs();})
btnGet.addEventListener("click",()=>{    getMsgs()                           ;})
btnSave.addEventListener("click",()=>{   sendMsg(input.value,getMsgs)                ;})
btnDelete.addEventListener("click",()=>{ deleteMsg(select.value,getMsgs)             ;})
btnUpdate.addEventListener("click",()=>{ updateMsg(select.value,input.value,getMsgs) ;})




function renderMsgs() {
  msgs.forEach(msg => {
    console.log(msg);

    // creo un nuevo objeto, a partir del contenido del template
    const newMsg = document.importNode(
      document.getElementById("msg-template").content,
      true);

    // modifico el nuevo obj
    newMsg.getElementById("msg").textContent = msg[1];

    // lo anexo a un contenedor
    msgContainer.appendChild(newMsg);
  });
}


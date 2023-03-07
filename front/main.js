const btnSave = document.getElementById("save");
const btnGet = document.getElementById("get");
const input = document.getElementById("input");
const label = document.getElementById("label");

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
  fetch(
    "http://localhost:1000/msg"
  )
  .then(response => response.json())
  .then(data => {
    msgs = data;
    renderMsgs();
  })
}

function sendMsg(message) {
  obj = {msg:message}
  console.log(`sending ${message}`);
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
  .then(respuesta=>{
    respuesta.text()
  })
  .then(data=>{
    console.log(data);
  })
}

btnGet.addEventListener("click",()=>{
  msgContainer.innerHTML="";
  getMsgs();
})
// btnGet.addEventListener("click",()=>{renderMsgs();})
btnSave.addEventListener("click",()=>{sendMsg(input.value);})




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


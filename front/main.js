const btnSave = document.getElementById("btn-save");
const inputName = document.getElementById("input-name");
const inputImg = document.getElementById("input-img");
const inputAi= document.getElementById("input-ai");
const preview = document.getElementById("preview")
const realName = document.getElementById("real-name");

const select = document.getElementById('select-designs');

// import & create template
let templateContent;
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
})
.catch(error=>{
  console.log(error);
})



function sendDesign(name,img,ai) {
  const data = new FormData();
  data.append('name', name);
  data.append('img', img);
  data.append('ai', ai);

  console.log(`sending=`,data);  
  fetch(
    "http://localhost:1000/design",
    {
      method:"POST",
      body:data
    }
  )
  .then(respuesta=>respuesta.text())
  .then(data=>{
    alert(data);
  })
  .catch(e=>{
    alert("somethig went wrong:",e);
  })
}

btnSave.addEventListener("click",()=>{
  if (inputName.value==""){
    alert("Please enter a name");
  }else if (inputImg.files[0].lenght>0) {
    alert("Please enter an Img");
  }else if (inputAi.files[0].lenght>0) {
    alert("Please enter an Ai");
  }else{
    sendDesign(realName.textContent, inputImg.files[0], inputAi.files[0]);
  }
})

function updateRealName(str) {
  str = str||inputName.value;
  if (str=="") {
    alert("Please enter a name");
  }else{
    const spaces_amount = str.split(" ");
    for (let i = 0; i < spaces_amount.length; i++) {
      str = str.replace(" ", "_")
    }
    realName.textContent = addExtension( str );
  }
  
}
function addExtension(str) {
  const allowedExtensions = [".png", ".jpg", ".jpeg"];
  let hasExtension = false;

  for (var i = 0; i < allowedExtensions.length; i++) {
    if (str.indexOf(allowedExtensions[i]) !== -1) {
      hasExtension = true;
      break;
    }
  }

  if (!hasExtension) {
    str += ".png";
  }

  return str;
}
// inputName.addEventListener("blur",()=>{updateRealName();});
inputImg.addEventListener('change',()=>{
  inputName.value = inputImg.files[0].name;
  updateRealName();
});



const designViewTemplate = document.createElement("template");
fetch('templates/design-view.html')
.then(response => response.text())
.then(data => {
    designViewTemplate.id="design-view-template";
    designViewTemplate.innerHTML=data;
    document.body.appendChild(designViewTemplate);
  })
  
fetch('http://127.0.0.1:1000/design')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    data.forEach(design => {
      const option = document.createElement('option');
      option.value = design.name;
      option.textContent = design.name;
      select.appendChild(option);

      const newView = document.importNode(designViewTemplate)
      console.log("template:",designViewTemplate);
      document.body.appendChild(newView);
      console.log("newView:",newView);
      
      // newView.getElementById("img-name").textContent = data.name
      // newView.getElementById("img").src = "http://127.0.0.1:1000/back/"+data.img_url
      // newView.getElementById("download-ai").href = "http://127.0.0.1:1000/back/"+data.ai_url
      

    });
  })
  .catch(error => {
    console.error('Error:', error);
  });

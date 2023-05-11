import importElement from "./modules/elementImporter.js";
import {userInfoKeys,checkLocalStorageItems,apiRoute,setRequestConfig} from './modules/globalVars.js';
import { redirectNoAdmin } from "./modules/globalVars.js";

redirectNoAdmin();

importElement("templates/manager.html").then( async (element) => {
  element.getElementById("manager-title").textContent = "Ordenes de compra";

  element.getElementById("inputs").classList.add("col-6","m-0","px-4");
  element.getElementById("read-window").classList.add("col-6","m-0");


  element.getElementById("inputs").innerHTML = 
  `    
    <label for="user-id" class="form-label">Cliente</label>
    <select class="form-select form-select m-1" name="user-id" id="user-id">
    </select>

    <label for="wine-id" class="form-label">Vino</label>
    <select class="form-select form-select m-1" name="wine-id" id="wine-id">
    </select>

    <label for="real-design-id" class="form-label">Diseño</label>
    <div class="row">
      <div class="col-2 d-flex justify-content-center py-2">
        <input value="1" class="w-auto" style="max-width: 2em;" type="number" name="amount" id="amount">
      </div>
      <div class="col-1 d-flex justify-content-center align-items-center">
        <h6>x</h6>
      </div>
      <div class="col-9">
        <select class="form-select form-select m-1" name="real-design-id" id="real-design-id">
        </select>
      </div>
    </div>

    <label for="msg" class="form-label">Mensaje</label>
    <input type="text"class="form-control" name="msg" id="msg" placeholder="En vez de maria, escriban francy y en vez de un corazon pongan un unicornio">

    <label for="primary-color-id" class="form-label">Color primario de empaque</label>
    <select class="form-select form-select m-1" name="primary-color-id" id="primary-color-id" disabled>
      <option value="1">rojo</option>
    </select>
    <label for="secondary-color-id" class="form-label">Color secundario de empaque</label>
    <select class="form-select form-select m-1" name="secondary-color-id" id="secondary-color-id">
      <option value="1">plateado</option>
      <option value="2">blanco</option>
      <option value="3">negro</option>
    </select>

    <label for="delivery-date" class="form-label">Fecha de envio</label>
    <input class="mb-2 d-block" type="date" name="delivery-date" id="delivery-date" value="2023-05-11">

    <label for="address" class="form-label">Direccion</label>
    <input type="text"class="form-control" name="address" id="address" placeholder="Calle 13 # 8-89 casa de 2 pisos puerta negra">

    <label for="vaucher" class="form-label">Recibo</label>
    <input type="file" class="form-control" name="vaucher" id="vaucher" accept=".png">
    <input type="checkbox" class="form-check-input" name="truly-paid" id="truly-paid">
    <label for="truly-paid" class="form-label">pagado</label>

    <button id="btn-add" class="btn btn-warning rounded-circle d-block mx-auto m-2">+</button>
    <button id="btn-update" class="btn btn-success rounded-pill d-block mx-auto m-2 d-none">update</button>
    <button id="btn-delete" class="btn btn-danger rounded-pill d-block mx-auto m-2 d-none">delete</button>
  
  `;    
  element.querySelector("hr").remove();

  const userSelect = element.getElementById("user-id");
  fetch(apiRoute + "read/users", setRequestConfig("GET")).then((response) => response.json()).then((users) => {
      users.forEach((user) => {
        const optionElement = document.createElement("option");
        console.log(user);
        optionElement.value = user[0];
        optionElement.textContent = user[1];
        optionElement.textContent += " "+user[2];
        userSelect.appendChild(optionElement);
      })
  });
 
  
  const wineSelect = element.getElementById("wine-id");
  fetch(apiRoute + "read/wine_kinds", setRequestConfig("GET")).then((response) => response.json()).then((wineKinds) => {
      wineKinds.forEach((wineKind) => {
        const optionElement = document.createElement("option");
        console.log(wineKind);
        optionElement.value = wineKind[0];
        optionElement.textContent = wineKind[1];
        wineSelect.appendChild(optionElement);
      })
  });
 
  const amountInput = element.getElementById("amount");

  const realDesignSelect = element.getElementById("real-design-id");
  fetch(apiRoute + "read/real_designs", setRequestConfig("GET")).then((response) => response.json()).then((realDesigns) => {
      realDesigns.forEach((realDesign) => {
        const optionElement = document.createElement("option");
        console.log(realDesign);
        optionElement.value = realDesign[0];
        optionElement.textContent = realDesign[1];
        realDesignSelect.appendChild(optionElement);
      })
  });
  const msgInput = element.getElementById("msg");


  const primaryColorSelect = element.getElementById("primary-color-id");
  const secondaryColorSelect = element.getElementById("secondary-color-id");

  const dateInput = element.getElementById("delivery-date");
  const addressInput = element.getElementById("address");
  const vaucheInput = element.getElementById("vaucher");
  const trulyPaidCheckbox = element.getElementById("truly-paid");
  
  const btnAdd = element.getElementById("btn-add");
  const btnUpdate = element.getElementById("btn-update");
  const btnDelete = element.getElementById("btn-delete");
  
  btnAdd.addEventListener("click", () => { 
    const formData = new FormData();
    formData.append("user-id", userSelect.value);
    formData.append("wine-id", wineSelect.value);
    formData.append("real-design-id", realDesignSelect.value);
    formData.append("amount", amountInput.value);
    formData.append("msg", msgInput.value);
    formData.append("primary-color-id", primaryColorSelect.value);
    formData.append("secondary-color-id", secondaryColorSelect.value);
    formData.append("delivery-date", dateInput.value);
    formData.append("address", addressInput.value);
    formData.append("vaucher", vaucheInput.files[0]);
    formData.append("truly-paid", trulyPaidCheckbox.checked);

    for (const [key, value] of formData.entries()) {
      console.log(key + ': ' + value); // Imprime cada par clave-valor en la consola
    }
    fetch(apiRoute + "create/pucharse_orders", setRequestConfig("POST",formData,true)).then((response) => response.json()).then((data) => {
      console.log(data);

    }).catch((error) => {
      alert(error);
      console.error(error);
    })
    ;
  });
  




  // console.log(dateInput.value);

  document.getElementById("manager").appendChild(element);
})
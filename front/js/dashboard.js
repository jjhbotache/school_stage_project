import {userInfoKeys,checkLocalStorageItems} from '/front/js/modules/globalVars.js';

if (!checkLocalStorageItems(userInfoKeys)) {
  window.location.assign("login.html"); 
}
if (localStorage.getItem("admin") == "true") {
  window.location.assign("dashboard-admin.html"); 
}

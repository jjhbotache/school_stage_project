import {userInfoKeys,checkLocalStorageItems} from '/front/js/modules/globalVars.js';

if (!checkLocalStorageItems(userInfoKeys)) {
  window.location.assign("login.html"); 
}
let idToNodeMap = {}; 
let ret = []; let root = [];
 let parentNode:any; 
 resultObj.forEach(function (datum) {
 let tempModuleId = datum.module_id;
 let tempParentId = datum.parent_id;
 delete datum.module_id; 
 delete datum.parent_id; 
 datum.moduleName = datum.module_name; 
 datum.isChecked = false;  
datum.subModules = []; 
 delete datum.module_name; 
 idToNodeMap[tempModuleId] = datum; 
 if (tempParentId === 0) { 
 root.push(datum);  } else {
  parentNode = idToNodeMap[tempParentId]; 
 console.log('mm',parentNode)  
 parentNode.subModules.push(datum)}});

 bcrypt
 // "bcrypt": "^0.8.7",
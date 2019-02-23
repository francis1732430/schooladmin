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

 MULTER FILE UPLOADS TRIGGER EVENTS:

 app.use(require('multer')({
  limits: {
    fieldNameSize: 999999999,
    fieldSize: 999999999
  },
  includeEmptyFields: true,
  inMemory: true,
  onFileUploadStart: function(file) {
    console.log('Starting ' + file.fieldname);
  },
  onFileUploadData: function(file, data) {
    console.log('Got a chunk of data!');
  },
  onFileUploadComplete: function(file) {
    console.log('Completed file!');
  },
  onParseStart: function() {
    console.log('Starting to parse request!');
  },
  onParseEnd: function(req, next) {
    console.log('Done parsing!');
    next();
  },
  onError: function(e, next) {
    if (e) {
      console.log(e.stack);
    }
    next();
  }
}));
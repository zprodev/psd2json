let fs = require('fs');
let rmdirSync = require('rmdir-sync');
let path = require("path");
let psd = require("psd");

function psd2json(psdFile) {
  let psdFilePath = path.resolve(psdFile);
  let psdFileName = path.basename(psdFilePath, path.extname(psdFilePath));

  // initialize output directory.
  let outDirPath = path.resolve("output");
  rmdirSync(outDirPath);
  if(!fs.existsSync(outDirPath)){
    fs.mkdirSync(outDirPath);
  }

  // get root node.
  let psdData = psd.fromFile(psdFilePath);
  psdData.parse();
  let rootNode = psdData.tree();

  let queueNodes = [];
  let queueNodesIndex = [];
  let queueNodesName = [];
  let queueNodesStructure = [];

  queueNodes.push(rootNode._children);
  queueNodesIndex.push(0);
  queueNodesName.push(undefined);
  let psdStructure = {
    "children" : []
  };
  queueNodesStructure.push(psdStructure);

  queueLoop: while(0 < queueNodes.length){
    let queueIndex = queueNodes.length - 1;
    let nodes = queueNodes[queueIndex];
    let nodesIndex = queueNodesIndex[queueIndex];
    let nodesName = queueNodesName[queueIndex];
    let nodesStructure = queueNodesStructure[queueIndex];

    if(nodesName === undefined){
      nodesName = "";
    }else{
      nodesName += "_";
    }
  
    nodeLoop: while(nodesIndex < nodes.length){
      let node = nodes[nodesIndex];
      nodesIndex++;
      if(node.layer.visible === false) continue;
      if(node.type === "group"){
        queueNodes.push(node._children);
        queueNodesIndex[queueIndex] = nodesIndex;
        queueNodesIndex.push(0);
        queueNodesName.push(nodesName + node.name);
        let structure = {
          "name" : node.name,
          "children" : []
        };
        nodesStructure.children.push(structure);
        queueNodesStructure.push(structure);
        continue queueLoop;
      }else{
        let structure = {
          "name" : node.name,
          "x" : node.layer.left,
          "y" : node.layer.top,
          "width" : node.layer.width,
          "height" : node.layer.height
        };
        nodesStructure.children.push(structure);
      }
    }
  
    queueNodes.pop();
    queueNodesIndex.pop();
    queueNodesName.pop();
    queueNodesStructure.pop();
  }

  fs.writeFile(outDirPath + "/" + psdFileName + ".json", JSON.stringify(psdStructure.children) , function (err) {
    if(err){
      console.log(err);
    }
  });
}

module.exports = psd2json;
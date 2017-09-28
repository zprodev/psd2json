let fs = require('fs');
let rmdirSync = require('rmdir-sync');
let path = require("path");
let psd = require("psd");

function psd2json(psdFile) {
  let psdFilePath = path.resolve(psdFile);
  let psdData = psd.fromFile(psdFilePath);
  psdData.parse();

  let outDirPath = "./output";
  let outImgDirPath = "./output/img";

//  rmdirSync(outDirPath);

  if(!fs.existsSync(outDirPath)){
    fs.mkdirSync(outDirPath);
  }
  if(!fs.existsSync(outImgDirPath)){
    fs.mkdirSync(outImgDirPath);
  }

  let queueNodes = [];
  let queueNodesIndex = [];
  let queueNodesName = [];
  let queueNodesStructure = [];

  let rootNode = psdData.tree();

  queueNodes.push(rootNode._children);
  queueNodesIndex.push(0);
  queueNodesName.push(rootNode.name);
  let psdStructure = {
    "name" : rootNode.name,
    "children" : []
  };
  queueNodesStructure.push(psdStructure);
  
  queueLoop: while(0 < queueNodes.length){
    let queueIndex = queueNodes.length - 1;
    let nodes = queueNodes[queueIndex];
    let nodesIndex = queueNodesIndex[queueIndex];
    let nodesName = queueNodesName[queueIndex];
    let nodesStructure = queueNodesStructure[queueIndex];
  
    nodeLoop: while(nodesIndex < nodes.length){
      let node = nodes[nodesIndex];
      nodesIndex++;
      if(node.layer.visible === false) continue;
      if(node.type === "group"){
        queueNodes.push(node._children);
        queueNodesIndex[queueIndex] = nodesIndex;
        queueNodesIndex.push(0);
        queueNodesName.push(nodesName + "_" + node.name);
        let structure = {
          "name" : node.name,
          "children" : []
        };
        nodesStructure.children.push(structure);
        queueNodesStructure.push(structure);
        continue queueLoop;
      }else{
        let saveName = nodesName + "_" + node.name;
        let structure = {
          "name" : node.name
        };
        nodesStructure.children.push(structure);
        node.layer.image.saveAsPng( outImgDirPath + "/" + saveName.replace( "/" , "_" ) + ".png");
      }
    }
  
    queueNodes.pop();
    queueNodesIndex.pop();
    queueNodesName.pop();
    queueNodesStructure.pop();
  }

  let outFileName = psdFile.substr(0, psdFile.indexOf("."));
  fs.writeFile(outDirPath + "/" + outFileName + ".json", JSON.stringify(psdStructure) , function (err) {
    if(err){
      console.log(err);
    }else{
      console.log("success");
    }
  });
}
psd2json(process.argv[2]);
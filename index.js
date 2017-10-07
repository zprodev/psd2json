const fs = require("fs");
const path = require("path");
const psd = require("psd");

function psd2json(psdFile, outDir) {
  const psdFilePath = path.resolve(psdFile);
  const psdFileName = path.basename(psdFilePath, path.extname(psdFilePath));

  let outDirPath;
  if (outDir) {
    outDirPath = path.resolve(outDir);
  } else {
    outDirPath = path.dirname(psdFilePath);
  }

  const outJsonPath = path.join(outDirPath, psdFileName + ".json");

  // get root node.
  const psdData = psd.fromFile(psdFilePath);
  psdData.parse();
  const rootNode = psdData.tree();

  const queueNodes = [];
  const queueNodesIndex = [];
  const queueNodesName = [];
  const queueNodesStructure = [];

  queueNodes.push(rootNode._children);
  queueNodesIndex.push(0);
  queueNodesName.push(undefined);
  const psdStructure = {
    "children" : []
  };
  queueNodesStructure.push(psdStructure);

  queueLoop: while (0 < queueNodes.length) {
    const queueIndex = queueNodes.length - 1;
    const nodes = queueNodes[queueIndex];
    const nodesStructure = queueNodesStructure[queueIndex];
    let nodesIndex = queueNodesIndex[queueIndex];
    let nodesName = queueNodesName[queueIndex];
    
    if (nodesName === undefined) {
      nodesName = "";
    } else {
      nodesName += "_";
    }
  
    while (nodesIndex < nodes.length) {
      let node = nodes[nodesIndex];
      nodesIndex++;
      if (node.layer.visible === false) continue;
      if (node.type === "group") {
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
      } else {
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

  // make output directory.
  if (!fs.existsSync(outDirPath)) {
    fs.mkdirSync(outDirPath);
  }

  // make json.
  fs.writeFile(outJsonPath, JSON.stringify(psdStructure.children) , function (err) {
    if (err) console.log(err);
  });
}

module.exports = psd2json;
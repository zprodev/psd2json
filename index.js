const fs = require('fs');
const path = require('path');
const psd = require('psd');

/**
 * Output PSD layout to JSON
 * @param {string} psdFile Relative path or absolute path of PSD file
 * @param {string} [outDir] Set this when outputting to a different directory from the PSD file
 */
function psd2json(psdFile, outDir) {
  const psdFilePath = path.resolve(psdFile);
  const psdFileName = path.basename(psdFilePath, path.extname(psdFilePath));

  let outDirPath;
  if (outDir) {
    outDirPath = path.resolve(outDir);
  } else {
    outDirPath = path.dirname(psdFilePath);
  }

  const outJsonPath = path.join(outDirPath, psdFileName + '.json');

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
    'group' : []
  };
  queueNodesStructure.push(psdStructure);

  queueLoop: while (0 < queueNodes.length) {
    const queueIndex = queueNodes.length - 1;
    const nodes = queueNodes[queueIndex];
    const nodesStructure = queueNodesStructure[queueIndex];
    let nodesIndex = queueNodesIndex[queueIndex];
    let nodesName = queueNodesName[queueIndex];
    
    if (nodesName === undefined) {
      nodesName = '';
    } else {
      nodesName += '_';
    }
  
    while (nodesIndex < nodes.length) {
      const node = nodes[nodesIndex];
      nodesIndex++;
      if (node.layer.visible === false) continue;
      if (node.type === 'group') {
        queueNodes.push(node._children);
        queueNodesIndex[queueIndex] = nodesIndex;
        queueNodesIndex.push(0);
        queueNodesName.push(nodesName + node.name);
        const structure = {
          'name' : node.name,
          'group' : []
        };
        nodesStructure.group.push(structure);
        queueNodesStructure.push(structure);
        continue queueLoop;
      } else {
        const structure = {
          'name' : node.name,
          'x' : node.layer.left,
          'y' : node.layer.top,
          'width' : node.layer.width,
          'height' : node.layer.height
        };
        nodesStructure.group.push(structure);
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
  fs.writeFileSync(outJsonPath, JSON.stringify(psdStructure.group));
}

module.exports = psd2json;
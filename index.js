const fs = require('fs');
const path = require('path');
const psd = require('psd');
const mkdirp = require('mkdirp');

/**
 * Output PSD layout to JSON
 * @param {string} psdFile Relative path or absolute path of PSD file
 * @param {Object} [options] options
 * @param {string} [options.outJsonDir] Set to output files
 * @param {string} [options.outImgDir] Set to output files
 */
function psd2json(psdFile, options = {}) {
  const psdFilePath = path.resolve(psdFile);
  const psdFileName = path.basename(psdFilePath, path.extname(psdFilePath));

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
      nodesName += path.sep;
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
        if (options.outImgDir) {
          const outImgDirPath = path.resolve(options.outImgDir, psdFileName, nodesName);
          mkdirp.sync(outImgDirPath);
          node.layer.image.saveAsPng(path.join(outImgDirPath, node.name + '.png'));
        }
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

  const outJsonData = JSON.stringify(psdStructure.group);

  if (options.outJsonDir) {
    const outJsonDirPath = path.resolve(options.outJsonDir);
    const outJsonPath = path.join(outJsonDirPath, psdFileName + '.json');
    // make output directory.
    if (!fs.existsSync(outJsonDirPath)) {
      fs.mkdirSync(outJsonDirPath);
    }
    // output file.
    fs.writeFileSync(outJsonPath, outJsonData);
  }

  return outJsonData;
}

module.exports = psd2json;
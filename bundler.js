// must read 2 entries but assume they will be near same
// must make transforms that nullstack requires once
// must read once, transform commom, then transform per bundle and save two bundles
// must cache all the unchanged modules in memory
// must ping websocket when transforms are done
// must deal with the different file types but export only js/css

const fs = require('fs');
const path = require('path');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const { transformFromAst } = require('babel-core');

const map = {}
const serverEntry = './simple/server.js'
const clientEntry = './simple/client.js'

function read(filePath) {
  const dirname = path.dirname(filePath)
  const content = fs.readFileSync(filePath, 'utf-8')
  const ast = babylon.parse(content, {
    sourceType: 'module',
  });
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      const relativePath = node.source.value
      const absolutePath = path.join(dirname, relativePath);
      if (map[absolutePath] === undefined) {
        node.source.value = absolutePath
        read(absolutePath)
      }
    },
  });
  map[filePath] = { ast }
}

read(serverEntry)
read(clientEntry)

function transform(filePath) {
  const ast = map[filePath].ast
  // a bunch of nullstack transformations should happen here
  const { code } = transformFromAst(ast, null, {
    presets: ['env'],
  });
  map[filePath].code = code
}

for (const filePath in map) {
  // this could be in threads
  transform(filePath)
}

console.log(map)
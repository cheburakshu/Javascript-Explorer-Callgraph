var es = require("esprima");
var fs = require("fs");
var graphList = [];

const ast = (file, cb) => {
  try {
    fs.readFile(file, "utf-8", function(err, data) {
      try {
        const ast = es.parse(data);

        var graph = traverse(ast, "root", []);

        cb(graph);
      } catch (e) {
        cb(null, e);
      }
    });
  } catch (e) {
    cb(null, e);
  }
};

const func = (node, parent) => {
  var args = "";
  var callee = "";
  var signature = "";
  var obj = {};

  if (node.params !== undefined && node.params) {
    signature = node.params;
  }

  if (node.callee !== undefined && node.callee.name) {
    callee = node.callee.name;
    args = node.arguments;
  }
  if (
    node.callee !== undefined &&
    node.callee.object !== undefined &&
    node.callee.object.name
  ) {
    callee = node.callee.object.name + "." + node.callee.property.name;
    args = node.arguments;
  }

  obj["parent"] = parent;
  obj["node"] = node;
  obj["callee"] = callee;
  obj["args"] = args;
  obj["signature"] = signature;
  obj["type"] = node.type;
  return obj;
  //  console.log(parent,node.type, callee, args, signature);
  //console.log(codegen.generate(node));
};

const traverse = (ast, parent, gl) => {
  var graph = {};
  graph = Object.assign(graph, func(ast, parent));
  gl.push(graph);

  // See if it has a new parent.
  if (ast.id !== null && ast.id !== undefined && ast.id.name) {
    parent = ast.id.name;
  }

  for (var key in ast) {
    if (ast.hasOwnProperty(key)) {
      var child = ast[key];
      if (typeof child === "object" && child !== null) {
        if (Array.isArray(child)) {
          child.forEach(d => {
            traverse(d, parent, gl);
          });
        } else {
          traverse(child, parent, gl);
        }
      }
    }
  }
  return gl;
};

module.exports = ast;

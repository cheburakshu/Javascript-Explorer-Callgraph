var ast = require('./ast');
var codegen = require('escodegen');
var errorTree = {nodes:[{id:"Error",group:1,code:""},{id:"Processing",group:2,code:""}], links:[{source:"Error",target:"Processing"}]};

function callGraph (file,callback){
  const cb = (data, err) => {
  	  if(err){
  	  	console.log(err);
  	  	callback(errorTree);
  	  	return;
  	  } else {
	    callback(formGraph(data));
	  }
  }
  try{
    var graph = ast(file,cb);
  } catch(err){
	  callback(errorTree);
  }
}

function formGraph(data){
	var parent = {},
	children = [],
	graph = {};
	
	data.forEach(d => {
      if(d.type === 'FunctionExpression' || d.type === 'ArrowFunctionExpression' || d.type === 'CallExpression' || d.type === 'MemberExpression'){
		children = [];
		
		if(!parent[d.parent]){
			parent[d.parent] = {}
			parent[d.parent]['children']=[];
			parent[d.parent]['code']="";
		}
		
		if(parent[d.parent]['children']){
			children = parent[d.parent]['children'];
		}
		d.callee?children.push(d.callee):false;
		parent[d.parent]['children']=children
		parent[d.parent]['code'] = codegen.generate(d.node);
	  }
	});
	
	graph['nodes']=[];
	graph['links']=[];
	let i=0;
	var group = {};
	for (var p of Object.keys(parent)){
      graph['nodes'].push({id:p,group:++i,code:parent[p].code})		
	  group[p] = i;
	  parent[p].children.forEach(c => {
  	    graph['links'].push({source:p, target:c})
	  });
	}
	graph['links'].forEach(l => {
		if(!group[l.target]){
			graph['nodes'].push({id:l.target,group:group[l.source]})
			group[l.target] = group[l.source];
		}
	});
	return graph;
}

module.exports = callGraph
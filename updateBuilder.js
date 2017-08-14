/* updateBuilder.js
created by : Tim Buckley
2017/07/28
 */
 
module.exports = {
	buildUpdateFromTree : function (node, callback){
		var jsonDb = require('./jsonDb');
		var updates;
		jsonDb.getRelevantTreeNode(node.type_id, node.serial, function(err, treeNode){
			if(err){
				updates = insertNode(node);
				callback(null, updates);
			}
			else{
				updates = updateTreeNode(treeNode, node);
				callback(null, updates);
			}
		});
	}
}

function updateTreeNode(treeNode, node){
	var updateObject = createUpdateObject();
	
	if(node.children.length > 0){
		var treeChildren = treeNode[node.children[0].type_id];
		
		var childComms = [];
		
		node.children.forEach(child => {
			if(child.serial != null){
				if(treeChildren[child.serial] != null){
					updateObject.updates.push(createNodeUpdateObject(treeChildren[child.serial], child));
				}
				else{
					treeChildren[child.serial] = child;
					updates.push(child);
				}
				childComms.push(child.serial);
			}
			else{
				for(var serial in treeChildren){
					if(child.data.window_id == treeChildren[serial].data.window_id){
						updateObject.updates.push(createNodeUpdateObject(treeChildren[serial], child));
						childComms.push(parseInt(serial));
					}
				}
			}
				
		});
		if(node.children[0].type_id == 'ib651'){
			for (var serial in treeChildren){
				if(treeChildren[serial].data.communication_status){
					var exists = 0;
					childComms.forEach(childComm => {
						if(treeChildren[serial].serial == childComm)
							exists = 1;
					});
					if(!exists){
						updateObject.updates.push(commsLoss(treeChildren[serial]));
					}
				}
			}
		}
	}
	updateObject.updates.push(createNodeUpdateObject(treeNode, node));
	updateObject.jsonUpdates.push(treeNode);
	console.log("\x1b[37m","UPDATES: ");
	console.log("\x1b[37m",updateObject.updates);
	return updateObject;
}

function commsLoss(treeNode){
	var updateObject = {
		serial : treeNode.serial,
		type_id : treeNode.type_id,
		parent_serial : treeNode.parent_serial,
		data : {communication_status : 0}
	};
	treeNode.data.communication_status = 0;
	treeNode.data.window_id = 0;
	return updateObject;
}

function createNodeUpdateObject(treeNode, node){
	var updateObject = {
		serial : treeNode.serial,
		type_id : treeNode.type_id,
		parent_serial : treeNode.parent_serial,
		data : {}
	};
	for (var property in node.data){
		if(node.data[property] != treeNode.data[property]){
			updateObject.data[property] = node.data[property];
			treeNode.data[property] = node.data[property];
		}
	}
	
	if(updateObject.parent_serial == undefined)
		delete updateObject['parent_serial'];
	
	return updateObject;
}
	

function insertNode(node){
	var updateObject = createUpdateObject();
	var children = node.children;

	delete node['children'];
	updateObject.inserts.push(node);
	children.forEach(child =>{
		updateObject.inserts.push(child);
	});
	
	return updateObject;
}

function createUpdateObject(){
	var updateObject = {
		updates : [],
		jsonUpdates : [],
		inserts : []
	}
	return updateObject;
}



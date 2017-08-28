/* updateBuilder.js
created by : Tim Buckley
2017/07/28
 */
 
module.exports = {
	buildUpdateFromTree : function (node, callback){
		var jsonDb = require('./jsonDb');									//get the Json DB handler
		var updates;														//create an update variable
		jsonDb.getRelevantTreeNode(node.type_id, node.serial, function(err, treeNode){//get the relevant Exisitng DB node 
			if(err){														//if there was an error the node does not exist
				updates = insertNode(node);									//so add the nodes as inserts
				callback(null, updates);									//pass the updates to the callback
			}
			else{															//otherwise the node exists in the DB
				updates = updateTreeNode(treeNode, node);					//so add the node as an update
				callback(null, updates);									//pass the updates to the callback
			}
		});
	}
}

function updateTreeNode(treeNode, node){
	var updateObject = createUpdateObject();								//create an update object
	
	if(node.children.length > 0){											//if the node has children
		var treeChildren;													//create a temporary pointer tree Children
		if(treeNode[node.children[0].type_id] != undefined)					//if the exisiting node has any children
			treeChildren = treeNode[node.children[0].type_id];				//set it to the exisitng children
		else																//otherwise
			treeChildren = {};												//set it as an empty object
		
		var childComms = [];												//initalise a temporary array
		
		node.children.forEach(child => {									//for each child node
			if(child.serial != null){										//if the node serial is null
				if(treeChildren[child.serial] != null){						//if the node exists
					updateObject.updates.push(createNodeUpdateObject(treeChildren[child.serial], child));//create an update
				}
				else{														//otherwise
					treeChildren[child.serial] = child;						//add the child to the treeChildren
					updateObject.inserts.push(child);						//add it as an insert
				}
				childComms.push(child.serial);								//add the node to the communication status array
			}
			else{															//serial is a null value
				for(var serial in treeChildren){							//for every serial in treeChildren
					if(child.data.window_id == treeChildren[serial].data.window_id){//if the window ids match
						updateObject.updates.push(createNodeUpdateObject(treeChildren[serial], child));//update that existing node
						childComms.push(parseInt(serial));					//add this serial to the Communication status array
					}
				}
			}
				
		});
		if(node.children[0].type_id == 'ib651'){							//if the children are ib651s
			for (var serial in treeChildren){								//for each serial in the exsiting children
				if(treeChildren[serial].data.communication_status == 1){	//if the communication status is currently TRUE
					var exists = 0;											//clear the exists flag
					childComms.forEach(childComm => {						//for each unit that was in this packet
						if(treeChildren[serial].serial == childComm)		//if it already exists
							exists = 1;										//set the exists Flag
					});
					if(!exists){											//if the exists flag was never set
						updateObject.updates.push(commsLoss(treeChildren[serial]));//add this node as an update to set its communication status to FALSE
					}
				}
			}
		}
	}
	updateObject.updates.push(createNodeUpdateObject(treeNode, node));		//add the parent node to the update tree
	updateObject.jsonUpdates.push(treeNode);								//add the JSON update
	console.log("\x1b[37m","UPDATES: ");									//Log the updates
	console.log("\x1b[37m",updateObject.updates);							
	return updateObject;													//return the update Object
}

function commsLoss(treeNode){	
	var updateObject = {													//create a communication loss object
		serial : treeNode.serial,											//set the serial
		type_id : treeNode.type_id,											//set the type_id
		parent_serial : treeNode.parent_serial,								//set the parent serial
		data : {communication_status : 0}									//set the communication status to FALSE
	};
	treeNode.data.communication_status = 0;									//update the tree node communication_status
	treeNode.data.window_id = 0;											//update the window id to 0
	return updateObject;													//return the object
}

function createNodeUpdateObject(treeNode, node){						
	var updateObject = {													//create an update Object
		serial : treeNode.serial,											//set the serial
		type_id : treeNode.type_id,											//set the type id
		parent_serial : treeNode.parent_serial,								//set the parent serial number
		data : {}															//initalise the data as empty initially
	};
	for (var property in node.data){										//for each property in data
		if(node.data[property] != treeNode.data[property]){					//if the data has changed
			updateObject.data[property] = node.data[property];				//update the data
			treeNode.data[property] = node.data[property];					//update the JSON data
		}
	}
	
	if(updateObject.parent_serial == undefined)								//if there is no parent
		delete updateObject['parent_serial'];								//delete the property
	
	return updateObject;													//return the object
}
	

function insertNode(node){													
	var updateObject = createUpdateObject();								//create an insert object
	var children = node.children;											//create a pointer to the children

	delete node['children'];												//delete the children from the parent
	updateObject.inserts.push(node);										//add the parent node to the object
	children.forEach(child =>{												//for each child
		updateObject.inserts.push(child);									//add the child to the object
	});
	
	return updateObject;													//return the object
}

function createUpdateObject(){
	var updateObject = {
		updates : [],
		jsonUpdates : [],
		inserts : []
	}
	return updateObject;
}



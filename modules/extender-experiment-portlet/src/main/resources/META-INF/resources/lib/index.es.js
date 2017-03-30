// var isArray = require('isarray');
import isArray from 'isarray';

console.log("import isArray from 'isarray' in index.es.js returned", isArray);
console.log('Calling isArray([]) from index.es.js');
var t = isArray([]);
console.log('which returns', t);


/******************************************************************************/


// var isObject = require('isobject');
import isObject from 'isobject';

export function render() {
	console.log('Calling isObject({}) from index.es.js');
	var t = isObject({});
	console.log('which returns', t);
}
module.exports = {
	render: render
};

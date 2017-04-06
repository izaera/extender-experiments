import isArray from 'isarray';
import isObject from 'isobject';

export function render() {
	console.log("import isArray from 'isarray' in index.es.js returned", isArray);
	console.log('Calling isArray([]) from index.es.js');
	var t = isArray([]);
	console.log('which returns', t);

	console.log("import isObject from 'isobject' in index.es.js returned", isObject);
	console.log('Calling isObject([]) from index.es.js');
	t = isObject([]);
	console.log('which returns', t);
}

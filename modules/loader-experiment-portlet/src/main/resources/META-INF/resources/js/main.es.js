import isArray from 'isarray';
// sin este import no funciona el import de isobject porque el config.json se queda sin isarray :-(

// 
console.log("import isArray from 'isarray' in index.es.js returned", isArray);
// console.log('Calling isArray([]) from index.es.js');
// var t = isArray([]);
// console.log('which returns', t);


/******************************************************************************/
import isObject from 'isobject';

export default () => {
	console.log('Calling isObject({}) from index.es.js');
	var t = isObject({});
	console.log('which returns', t);
}

import React from 'react';
import ReactDOM from 'react-dom';

export function render() {
	ReactDOM.render(
	  <h1>Hello, world! (from React 😎)</h1>,
	  document.getElementById('react-canvas')
	);
}

module.exports = {
	render: render
};

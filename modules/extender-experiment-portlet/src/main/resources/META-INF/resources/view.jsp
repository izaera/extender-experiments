<%@ include file="/init.jsp" %>

<script>
	console.log("Calling System.import('isobject/2.1.0') from view.jsp");
	System.import ('isobject/2.1.0').then(function (isObject) {
		console.log("System.import('isobject/2.1.0') returned", isObject);

		console.log('Calling isObject({}) from view.jsp');
		var t = isObject({});
		console.log('which returns', t);
	});

	console.log("Calling System.import('extender-experiment-portlet/1.0.0') from view.jsp");
	System.import('extender-experiment-portlet/1.0.0').then(function (MyModule) {
		console.log("System.import('extender-experiment-portlet/1.0.0') returned", MyModule);

		console.log("Calling MyModule.render() from view.jsp");
		MyModule.render();
  }, function (err) {
    console.error(err);
	});
</script>

<p>
	<b><liferay-ui:message key="extender-experiment-portlet.caption"/></b>
</p>

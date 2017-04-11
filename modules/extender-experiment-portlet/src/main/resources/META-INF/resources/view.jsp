<%@ include file="/init.jsp" %>

<script>
	window.process = {
		env: {
			NODE_ENV: 'production'
		}
	};
</script>

<aui:script require="pkg:extender-experiment-portlet@1.0.0">
	pkgExtenderExperimentPortlet100.render();
</aui:script>

<p>
	<b><liferay-ui:message key="extender-experiment-portlet.caption"/></b>
</p>

<div id="react-canvas"></div>

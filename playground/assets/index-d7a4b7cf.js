function C(r,l){for(var c=0;c<l.length;c++){const a=l[c];if(typeof a!="string"&&!Array.isArray(a)){for(const t in a)if(t!=="default"&&!(t in r)){const o=Object.getOwnPropertyDescriptor(a,t);o&&Object.defineProperty(r,t,o.get?o:{enumerable:!0,get:()=>a[t]})}}}return Object.freeze(Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}))}var f={};(function(){var r=tinymce.util.Tools.resolve("tinymce.PluginManager"),l=tinymce.util.Tools.resolve("tinymce.dom.DOMUtils"),c=tinymce.util.Tools.resolve("tinymce.util.Tools"),a=function(e){return e.getParam("save_enablewhendirty",!0)},t=function(e){return!!e.getParam("save_onsavecallback")},o=function(e){return!!e.getParam("save_oncancelcallback")},i=function(e,n){e.notificationManager.open({text:n,type:"error"})},v=function(e){var n=l.DOM.getParent(e.id,"form");if(!(a(e)&&!e.isDirty())){if(e.save(),t(e)){e.execCallback("save_onsavecallback",e),e.nodeChanged();return}n?(e.setDirty(!1),(!n.onsubmit||n.onsubmit())&&(typeof n.submit=="function"?n.submit():i(e,"Error: Form submit field collision.")),e.nodeChanged()):i(e,"Error: No form element found.")}},m=function(e){var n=c.trim(e.startContent);if(o(e)){e.execCallback("save_oncancelcallback",e);return}e.resetContent(n)},g=function(e){e.addCommand("mceSave",function(){v(e)}),e.addCommand("mceCancel",function(){m(e)})},s=function(e){return function(n){var u=function(){n.setDisabled(a(e)&&!e.isDirty())};return u(),e.on("NodeChange dirty",u),function(){return e.off("NodeChange dirty",u)}}},b=function(e){e.ui.registry.addButton("save",{icon:"save",tooltip:"Save",disabled:!0,onAction:function(){return e.execCommand("mceSave")},onSetup:s(e)}),e.ui.registry.addButton("cancel",{icon:"cancel",tooltip:"Cancel",disabled:!0,onAction:function(){return e.execCommand("mceCancel")},onSetup:s(e)}),e.addShortcut("Meta+S","","mceSave")};function y(){r.add("save",function(e){b(e),g(e)})}y()})();const p=C({__proto__:null,default:f},[f]);export{p as i};

function h(i,u){for(var l=0;l<u.length;l++){const r=u[l];if(typeof r!="string"&&!Array.isArray(r)){for(const t in r)if(t!=="default"&&!(t in i)){const c=Object.getOwnPropertyDescriptor(r,t);c&&Object.defineProperty(i,t,c.get?c:{enumerable:!0,get:()=>r[t]})}}}return Object.freeze(Object.defineProperty(i,Symbol.toStringTag,{value:"Module"}))}var m={};(function(){var i=tinymce.util.Tools.resolve("tinymce.PluginManager"),u=tinymce.util.Tools.resolve("tinymce.Env"),l=function(e){return e.getParam("pagebreak_separator","<!-- pagebreak -->")},r=function(e){return e.getParam("pagebreak_split_block",!1)},t="mce-pagebreak",c=function(e){var a='<img src="'+u.transparentSrc+'" class="'+t+'" data-mce-resize="false" data-mce-placeholder />';return e?"<p>"+a+"</p>":a},v=function(e){var a=l(e),p=function(){return r(e)},P=new RegExp(a.replace(/[\?\.\*\[\]\(\)\{\}\+\^\$\:]/g,function(n){return"\\"+n}),"gi");e.on("BeforeSetContent",function(n){n.content=n.content.replace(P,c(p()))}),e.on("PreInit",function(){e.serializer.addNodeFilter("img",function(n){for(var f=n.length,o,s;f--;)if(o=n[f],s=o.attr("class"),s&&s.indexOf(t)!==-1){var g=o.parent;if(e.schema.getBlockElements()[g.name]&&p()){g.type=3,g.value=a,g.raw=!0,o.remove();continue}o.type=3,o.value=a,o.raw=!0}})})},b=function(e){e.addCommand("mcePageBreak",function(){e.insertContent(c(r(e)))})},k=function(e){e.on("ResolveName",function(a){a.target.nodeName==="IMG"&&e.dom.hasClass(a.target,t)&&(a.name="pagebreak")})},y=function(e){var a=function(){return e.execCommand("mcePageBreak")};e.ui.registry.addButton("pagebreak",{icon:"page-break",tooltip:"Page break",onAction:a}),e.ui.registry.addMenuItem("pagebreak",{text:"Page break",icon:"page-break",onAction:a})};function d(){i.add("pagebreak",function(e){b(e),y(e),v(e),k(e)})}d()})();const B=h({__proto__:null,default:m},[m]);export{B as i};

import{d as c,u as p,f as _,_ as i,o as u,g as d}from"./index-7f3c9944.js";const f=c({setup(){const{currentRoute:n,replace:a}=p(),{params:e,query:s}=_(n),{path:t,_redirect_type:o="path"}=e;Reflect.deleteProperty(e,"_redirect_type"),Reflect.deleteProperty(e,"path");const r=Array.isArray(t)?t.join("/"):t;return a(o==="name"?{name:r,query:s,params:e}:{path:r.startsWith("/")?r:"/"+r,query:s}),{}}});function l(n,a,e,s,t,o){return u(),d("div")}const h=i(f,[["render",l]]);export{h as default};

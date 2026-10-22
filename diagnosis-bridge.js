/* DASI Stage 4 integration: runs in memory only. Load after schemes.js and diagnosis-schemes.js, before diagnosis.js. */
(function(root){'use strict';
if(!root.DasiEngine || !root.DasiSchemes || !root.addEventListener)return;
if(root.DasiEngine.__dasiBridgeInstalled)return;
const original=root.DasiEngine.evaluate;
root.DasiEngine.evaluate=function(input,options){
  const result=original.call(this,input,options);
  if(result && result.valid && input && typeof input==='object'){
    const snapshot={persona:input.persona,status:input.status,businessStatus:input.businessStatus};
    queueMicrotask(function(){
      const panel=root.document && root.document.getElementById('result');
      if(panel && !panel.classList.contains('hidden')){
        root.dispatchEvent(new CustomEvent('dasi:diagnosis-complete',{detail:snapshot}));
      }
    });
  }
  return result;
};
root.DasiEngine.__dasiBridgeInstalled=true;
})(typeof window!=='undefined'?window:globalThis);

// Run through use_figma after connected MCP access is restored.
// This repairs existing components in place; it does not recreate them.
const page = await figma.getNodeByIdAsync('0:1');
await figma.setCurrentPageAsync(page);
await Promise.all([
 {family:'Manrope',style:'Regular'},
 {family:'Manrope',style:'Medium'},
 {family:'Manrope',style:'SemiBold'},
 {family:'IBM Plex Mono',style:'Regular'}
].map(f=>figma.loadFontAsync(f)));
const changed=[];
// Keep temporary source captures clear of the component and review areas.
for(const [id,x,y] of [['3:2',-1800,80],['5:60',-1800,1160],['5:61',-1800,2800]]) {
 const n=await figma.getNodeByIdAsync(id);
 if(n){n.x=x;n.y=y;changed.push({id:n.id,name:n.name,w:n.width,h:n.height});}
}
for(const n of page.findAllWithCriteria({types:['FRAME']})) {
 if(n.layoutMode!=='NONE' && n.height<=10.1) {
  // resize() had reset the auto-layout height to FIXED during construction.
  n.primaryAxisSizingMode='AUTO';
  n.clipsContent=false;
  changed.push({id:n.id,name:n.name,w:n.width,h:n.height});
 }
}
return {mutatedNodeIds:changed.map(n=>n.id),changed};

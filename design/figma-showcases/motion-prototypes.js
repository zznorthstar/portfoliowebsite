// Authored and reviewed in the paid-team file. Existing-node guard prevents duplication.
// Figma previews replay their timeline; website entrances play one cycle.
// use_figma skillNames: figma-use,figma-use-motion,figma-generate-library,figma-generate-design
const showcaseSet=await figma.getNodeByIdAsync('1:1191');
const showcaseVariants=showcaseSet.children.map(c=>({name:c.name,node:c}));
let page=figma.root.children.find(p=>p.name==='02 · Motion prototypes');
const created=[];const changed=[];const frames=[];
if(!page){page=figma.createPage();page.name='02 · Motion prototypes';created.push(page.id);}
await figma.setCurrentPageAsync(page);
await Promise.all([{family:'Manrope',style:'Regular'},{family:'Manrope',style:'Medium'},{family:'Manrope',style:'SemiBold'},{family:'IBM Plex Mono',style:'Regular'}].map(f=>figma.loadFontAsync(f)));
const vars=await figma.variables.getLocalVariablesAsync();
const collections=await figma.variables.getLocalVariableCollectionsAsync();
const light=collections.find(c=>c.name==='HB · Light');
const v=Object.fromEntries(vars.filter(v=>v.variableCollectionId===light.id).map(v=>[v.name.replace('color/',''),v]));
const styles=Object.fromEntries((await figma.getLocalTextStylesAsync()).map(s=>[s.name.replace('HB / ',''),s]));
const track=n=>{created.push(n.id);return n;};
const paint=key=>figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',v[key]);
const ease={type:'CUSTOM_CUBIC_BEZIER',easingFunctionCubicBezier:{x1:.22,y1:1,x2:.36,y2:1}};
function keyframes(n,field,from,to,start,duration){n.applyManualKeyframeTrack({type:'PROPERTY',name:field},{keyframes:[{timelinePosition:start,value:{type:'FLOAT',value:from}},{timelinePosition:start+duration,value:{type:'FLOAT',value:to},easing:ease}]});changed.push(n.id);}
function text(parent,label,x,y,size,key='text',family='Manrope',style='Regular') {const n=track(figma.createText());parent.appendChild(n);n.fontName={family,style};n.characters=label;n.fontSize=size;n.fills=[paint(key)];n.x=x;n.y=y;return n;}
function rect(parent,name,x,y,w,h,key='surface'){const n=track(figma.createRectangle());n.name=name;parent.appendChild(n);n.resize(w,h);n.x=x;n.y=y;n.fills=[paint(key)];return n;}
function root(name,w,h,x,y){if(page.findOne(n=>n.name===name))throw new Error('Prototype already exists. Read its ledger before resuming.');const f=track(figma.createFrame());f.name=name;f.resize(w,h);f.fills=[paint('bg')];f.x=x;f.y=y;f.clipsContent=true;page.appendChild(f);frames.push({name,id:f.id});return f;}
const lines=[];
for(const mobile of [false,true]){
 const c=track(figma.createComponent());c.name=`Size=${mobile?'Mobile':'Desktop'}`;c.resize(mobile?342:782,mobile?39:100);c.fills=[];c.clipsContent=true;
 const t=text(c,'Unite ideas.',0,0,mobile?36:92.16,'text','Manrope','Medium');t.textStyleId=styles[mobile?'Hero/Mobile':'Hero/Desktop'].id;t.letterSpacing={unit:'PIXELS',value:mobile?-2.34:-6.4512};lines.push(c);
}
const lineSet=track(figma.combineAsVariants(lines,page));lineSet.name='Motion / Hero line';lineSet.description='Clipped line with editable copy. Motion acts on the text, preserving the parent layout.';lineSet.x=80;lineSet.y=80;lines.forEach((l,i)=>{l.x=24;l.y=24+i*140;});lineSet.resize(840,260);
const lineProp=lineSet.addComponentProperty('Copy','TEXT','Unite ideas.');lines.forEach(l=>{l.children[0].componentPropertyReferences={characters:lineProp};});
for(const mobile of [false,true]){
 const f=root(`Hero entrance / ${mobile?'Mobile':'Desktop'}`,mobile?390:1440,mobile?698:881,mobile?2520:960,80);
 const x=mobile?24:72,top=mobile?77:234,h=mobile?38.88:99.53;
 const intro=text(f,'AI systems architect. Commercial thinker.',x,mobile?40:189,mobile?11:13,'text-muted','Manrope','SemiBold');keyframes(intro,'TRANSLATION_Y',8,0,0,.42);keyframes(intro,'OPACITY',.5,1,0,.42);
 for(let i=0;i<2;i++){
  const mask=track(figma.createFrame());mask.name='Headline line mask';mask.resize(mobile?342:782,mobile?39:100);mask.fills=[];mask.clipsContent=true;f.appendChild(mask);mask.x=x;mask.y=top+i*h;const line=track(lines[mobile?1:0].createInstance());mask.appendChild(line);line.x=0;line.y=0;line.setProperties({[lineProp]:i?'Multiply impact.':'Unite ideas.'});
  const t=line.findAllWithCriteria({types:['TEXT']})[0];if(i)t.fills=[paint('accent')];
  keyframes(line,'TRANSLATION_Y',mobile?15:36,0,.06+i*.12,mobile?.62:.72);keyframes(line,'OPACITY',.35,1,.06+i*.12,mobile?.62:.72);
 }
 const desc=text(f,'I’m Hamdi. I connect people, business, and AI to build\nsystems that solve real problems.',x,mobile?216:539,mobile?14:17,'text-muted');if(mobile){desc.textAutoResize='HEIGHT';desc.resize(342,desc.height);}keyframes(desc,'TRANSLATION_Y',10,0,.24,.5);keyframes(desc,'OPACITY',.4,1,.24,.5);
 const action=track(figma.createAutoLayout('HORIZONTAL'));action.name='Hero actions';action.fills=[];f.appendChild(action);action.x=x;action.y=mobile?314:625;action.itemSpacing=32;
 const button=track(figma.createAutoLayout());button.fills=[paint('text')];button.paddingLeft=22;button.paddingRight=22;button.paddingTop=16;button.paddingBottom=16;action.appendChild(button);text(button,'Explore my work',0,0,13,'bg','Manrope','SemiBold');text(action,'Read the research',0,0,13,'text','Manrope','SemiBold');
 keyframes(action,'TRANSLATION_Y',6,0,.36,.4);keyframes(action,'OPACITY',.65,1,.36,.4);
 const photo=rect(f,'Portrait',mobile?207:1028,mobile?413:167,mobile?159:340,mobile?212:453,'surface-2');photo.fills=[{type:'IMAGE',imageHash:'499657ebda1a2a1b6b8c742e59daac229c5f27b6',scaleMode:'FILL',filters:{saturation:-1}}];keyframes(photo,'TRANSLATION_Y',mobile?10:16,0,.08,.8);keyframes(photo,'SCALE_X',1.025,1,.08,.8);keyframes(photo,'SCALE_Y',1.025,1,.08,.8);
 const mark=track(figma.createFrame());mark.name='Identity tile';mark.resize(mobile?110:144,mobile?110:144);mark.fills=[paint('accent-fill')];f.appendChild(mark);mark.x=mobile?24:894;mark.y=mobile?435:577;mark.clipsContent=true;
 rect(mark,'Vertical arm',mobile?48:64,24,mobile?14:16,mobile?62:96,'text');rect(mark,'Horizontal arm',24,mobile?48:64,mobile?62:96,mobile?14:16,'text');
 keyframes(mark,'TRANSLATION_X',-10,0,.22,.75);keyframes(mark,'TRANSLATION_Y',8,0,.22,.75);keyframes(mark,'ROTATION',8,0,.22,.75);
 text(f,'Ideas need people.\nGood systems connect them.',mobile?24:1058,mobile?636:636,mobile?10:11,'text-muted');
 const [timeline]=intro.timelines;if(timeline&&timeline.duration<1.3)intro.setTimelineDuration(timeline.id,1.3);
}
for(const mobile of [false,true]){
 const f=root(`Project reveal / ${mobile?'Mobile':'Desktop'}`,mobile?390:960,mobile?360:540,mobile?2520:960,1100);
 // Use the existing source variant; preserve component linkage.
 const source=showcaseVariants.find(c=>c.name===`Theme=light, Format=${mobile?'mobile':'desktop'}`).node;
 const ins=track(source.createInstance());f.appendChild(ins);if(mobile){ins.rescale(342/600);ins.x=24;ins.y=24;}
 keyframes(ins,'TRANSLATION_Y',mobile?14:20,0,0,mobile?.6:.7);keyframes(ins,'OPACITY',.55,1,0,mobile?.6:.7);keyframes(ins,'SCALE_X',mobile?1:.98,1,0,.7);keyframes(ins,'SCALE_Y',mobile?1:.98,1,0,.7);
 const [timeline]=ins.timelines;if(timeline&&timeline.duration<1.3)ins.setTimelineDuration(timeline.id,1.3);
}
return {createdNodeIds:created,mutatedNodeIds:[...new Set(changed)],pageId:page.id,frames,lineSet:lineSet.id};

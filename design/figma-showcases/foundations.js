const page = await figma.getNodeByIdAsync('0:1');
await figma.setCurrentPageAsync(page);
page.name = '01 · Showcase system';
await Promise.all([{family:'Manrope',style:'Regular'},{family:'Manrope',style:'Medium'},{family:'Manrope',style:'SemiBold'},{family:'IBM Plex Mono',style:'Regular'}].map(f=>figma.loadFontAsync(f)));
const existing = await figma.variables.getLocalVariableCollectionsAsync();
if (existing.some(c=>c.name==='HB · Primitives')) return {status:'already created',collections:existing.map(c=>({id:c.id,name:c.name}))};
const p = await createVariableCollection('HB · Primitives',['Value']);
const palette = {light:{bg:'#f8f8f4',surface:'#eeeee7','surface-2':'#e4e4dc',text:'#242422','text-muted':'#62625a','text-faint':'#73736a',accent:'#b84a22','accent-fill':'#ed8355',border:'#d9d9d0'},dark:{bg:'#1d1d1b',surface:'#282824','surface-2':'#33332d',text:'#f3f3e9','text-muted':'#b8b8ab','text-faint':'#a0a092',accent:'#ff9b70','accent-fill':'#ed8355',border:'#44443b'}};
const primitives=await createSemanticTokens(p.collection,p.modeIds,Object.entries(palette).flatMap(([theme,colors])=>Object.entries(colors).map(([name,value])=>({name:`${theme}/${name}`,type:'COLOR',values:{Value:value},scopes:[],codeSyntax:{WEB:`var(--${name})`}}))));
const collections={primitives:p.collection.id}; const vars={};
// Separate one-mode theme collections preserve Starter-plan compatibility.
for (const theme of ['light','dark']) {
 const c=await createVariableCollection(`HB · ${theme==='light'?'Light':'Dark'}`,['Value']);collections[theme]=c.collection.id;
 const t=await createSemanticTokens(c.collection,c.modeIds,Object.keys(palette[theme]).map(name=>({name:`color/${name}`,type:'COLOR',values:{Value:{type:'VARIABLE_ALIAS',id:primitives.variables[`${theme}/${name}`].id}},scopes:name.startsWith('text')||name==='accent'?['TEXT_FILL','SHAPE_FILL','STROKE_COLOR']:name==='border'?['STROKE_COLOR','SHAPE_FILL']:['FRAME_FILL','SHAPE_FILL'],codeSyntax:{WEB:`var(--${name})`}})));
 vars[theme]=Object.fromEntries(Object.entries(t.variables).map(([name,v])=>[name.replace('color/',''),v.id]));
}
const g=await createVariableCollection('HB · Geometry',['Value']);collections.geometry=g.collection.id;
const geometry=await createSemanticTokens(g.collection,g.modeIds,[4,8,12,16,24,32,48,72].map(n=>({name:`spacing/${n}`,type:'FLOAT',values:{Value:n},scopes:['GAP'],codeSyntax:{WEB:`var(--space-${n})`}})).concat([{name:'radius/sm',type:'FLOAT',values:{Value:4},scopes:['CORNER_RADIUS'],codeSyntax:{WEB:'var(--radius)'}}]));
const styles={};
for(const [name,family,style,size,line] of [['UI/Heading','Manrope','Medium',28,36],['UI/Body','Manrope','Medium',20,28],['UI/Small','Manrope','Regular',16,24],['UI/Mobile heading','Manrope','Medium',32,40],['UI/Mobile body','Manrope','Medium',24,32],['UI/Mono','IBM Plex Mono','Regular',14,22],['UI/Mobile mono','IBM Plex Mono','Regular',20,28],['Hero/Desktop','Manrope','Medium',92.16,99.5328],['Hero/Mobile','Manrope','Medium',36,38.88]]){
 const s=figma.createTextStyle();s.name=`HB / ${name}`;s.fontName={family,style};s.fontSize=size;s.lineHeight={unit:'PIXELS',value:line};styles[name]=s.id;
}
return {mutatedNodeIds:[page.id],collections,vars,geometry:Object.fromEntries(Object.entries(geometry.variables).map(([n,v])=>[n,v.id])),styles,variableCount:(await figma.variables.getLocalVariablesAsync()).length,scopesAndSyntaxValid:(await figma.variables.getLocalVariablesAsync()).every(v=>v.codeSyntax.WEB&&!v.scopes.includes('ALL_SCOPES'))};

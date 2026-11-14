let currentScene = 0;
let found = new Set();
let gameEnded = false;
const decoyPositions = {
  page5: [{ x: 38, y: 31 }, { x: 64, y: 62 }],
  page6: [{ x: 31, y: 68 }, { x: 84, y: 34 }],
  page7: [{ x: 28, y: 70 }, { x: 82, y: 66 }],
  page8: [{ x: 35, y: 28 }, { x: 62, y: 70 }],
  page9: [{ x: 36, y: 39 }, { x: 60, y: 42 }],
  page10: [{ x: 74, y: 42 }, { x: 88, y: 76 }]
};
const $ = (id) => document.getElementById(id);
function bookSnailKey(sceneId, snailId){ return `${sceneId}:${snailId}`; }
function getRank(foundCount, complete){ if(!complete) return '蝸牛觀察員'; if(foundCount >= 10) return '蝸牛大神'; if(foundCount >= 8) return '蝸牛達人'; if(foundCount >= 5) return '蝸牛獵人'; return '蝸牛尋跡者'; }
function isBookComplete(){ return snailScenes.every(scene => scene.snails.every(snail => found.has(bookSnailKey(scene.id, snail.id)))); }
function getTotalSnails(){ return snailScenes.reduce((total, scene) => total + scene.snails.length, 0); }
function renderDots(){ $('scene-dots').innerHTML = snailScenes.map((scene,index)=>`<button class="scene-dot${index===currentScene?' active':''}" type="button" aria-label="前往${scene.title}" data-scene="${index}"></button>`).join(''); document.querySelectorAll('.scene-dot').forEach(btn=>btn.addEventListener('click',()=>renderScene(Number(btn.dataset.scene)))); }
function updateResult(){ const result=$('rank-result'); result.hidden=!gameEnded; }
function finishGame(){ gameEnded=true; document.querySelector('.hunt-panel').classList.add('game-ended'); $('scene-frame').hidden=true; $('scene-controls').hidden=true; $('scene-feedback').textContent=''; const total=getTotalSnails(); const score=Math.round((found.size/total)*100); $('rank-result').hidden=false; $('rank-result').innerHTML=`<div>闖關成功！你找到了 ${found.size} / ${total} 隻蝸牛</div><strong class="final-score">${score} 分</strong><strong>${getRank(found.size,isBookComplete())}</strong><button class="play-again" type="button">再玩一次</button>`; $('rank-result').querySelector('.play-again').addEventListener('click',resetScene); }
function renderScene(sceneIndex){ currentScene=(sceneIndex+snailScenes.length)%snailScenes.length; const scene=snailScenes[currentScene]; $('scene-label').textContent=`場景 ${currentScene+1}`; $('scene-title').textContent=scene.title; $('scene-clue').textContent=scene.clue; $('scene-progress').textContent=`已找到 ${found.size} 隻`; $('scene-feedback').textContent=''; $('rank-result').hidden=true; $('scene-image').src=scene.image; $('scene-image').alt=`${scene.title}繪本場景，請找找藏起來的蝸牛`; const realHotspots=scene.snails.map(snail=>{const key=bookSnailKey(scene.id,snail.id);return `<button class="snail-hotspot${found.has(key)?' found':''}" style="left:${snail.x}%;top:${snail.y}%" type="button" aria-label="${snail.label}的蝸牛" data-snail="${key}" ${found.has(key)?'disabled':''}></button>`}); const decoys=(decoyPositions[scene.id]||[]).map((spot,index)=>`<button class="snail-hotspot decoy" style="left:${spot.x}%;top:${spot.y}%" type="button" aria-label="搜尋位置 ${index+1}"></button>`); $('snail-hotspots').innerHTML=realHotspots.concat(decoys).join(''); document.querySelectorAll('.snail-hotspot:not(.decoy):not([disabled])').forEach(btn=>btn.addEventListener('click',()=>{const key=btn.dataset.snail;if(found.has(key))return;found.add(key);btn.classList.add('found');btn.disabled=true;$('scene-progress').textContent=`已找到 ${found.size} 隻`;$('scene-feedback').textContent='找到了！再看看其他角落。';})); document.querySelectorAll('.snail-hotspot.decoy').forEach(btn=>btn.addEventListener('click',()=>{$('scene-feedback').textContent='這裡沒有蝸牛，再仔細看看石頭縫和草叢。';})); $('prev-scene').disabled=snailScenes.length<2; $('next-scene').disabled=snailScenes.length<2; renderDots(); updateResult(); }
function resetScene(){ found=new Set(); gameEnded=false; document.querySelector('.hunt-panel').classList.remove('game-ended'); $('scene-frame').hidden=false; $('scene-controls').hidden=false; renderScene(0); $('scene-feedback').textContent='重新出發，看看繪本裡還藏著哪些蝸牛。'; }
$('scene-image').addEventListener('error',()=>{$('image-error').hidden=false;$('image-error').style.display='grid'}); $('scene-image').addEventListener('load',()=>{$('image-error').hidden=true;$('image-error').style.display='none'}); $('prev-scene').addEventListener('click',()=>renderScene(currentScene-1)); $('next-scene').addEventListener('click',()=>{if(currentScene===snailScenes.length-1)finishGame();else renderScene(currentScene+1)}); $('reset-game').addEventListener('click',resetScene); renderScene(0);
document.addEventListener('click',(event)=>{ if(event.target.matches('.snail-hotspot:not(.decoy)')&&currentScene===snailScenes.length-1&&isBookComplete()) finishGame(); });
function syncNextButton(){ $('next-scene').textContent=currentScene===snailScenes.length-1?'闖關成功':'下一個場景'; }
document.addEventListener('click',(event)=>{ if(event.target.closest('.scene-controls')||event.target.matches('.scene-dot')) setTimeout(syncNextButton,0); });
syncNextButton();

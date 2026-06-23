function setMode(btn,m){document.querySelectorAll('.mchip').forEach(function(c){c.classList.remove('active');});btn.classList.add('active');tutorMode=m;chatH=[];}
function grow(el){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,120)+'px';}
function chatKey(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg();}}
function clearChat(){chatH=[];document.getElementById('chat-msgs').innerHTML='<div class="mr"><div class="mav ai">UV</div><div class="bub ai">Chat cleared! What shall we study? \uD83D\uDCDA</div></div>';}
function qs(t){document.getElementById('chat-ta').value=t;sendMsg();}
function addMsg(role,text){
  var c=document.getElementById('chat-msgs'),d=document.createElement('div');
  d.className='mr'+(role==='user'?' user':'');
  var init=role==='user'?((CP&&CP.firstName||'Me').substring(0,2).toUpperCase()):'UV';
  var html=text.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
  d.innerHTML='<div class="mav '+(role==='user'?'me':'ai')+'">'+init+'</div><div class="bub '+(role==='user'?'user':'ai')+'">'+html+'</div>';
  c.appendChild(d);c.scrollTop=c.scrollHeight;
}
function showTyping(){var c=document.getElementById('chat-msgs'),d=document.createElement('div');d.className='mr';d.id='typ';d.innerHTML='<div class="mav ai">UV</div><div class="typi"><div class="td"></div><div class="td"></div><div class="td"></div></div>';c.appendChild(d);c.scrollTop=c.scrollHeight;}
function rmTyping(){var t=document.getElementById('typ');if(t)t.remove();}
function sendMsg(){
  if(chatBusy)return;
  var ta=document.getElementById('chat-ta');var text=(ta.value||'').trim();if(!text)return;
  ta.value='';ta.style.height='auto';
  addMsg('user',text);chatH.push({role:'user',content:text});
  chatBusy=true;document.getElementById('sbtn2').disabled=true;showTyping();
  aiCall(getSys(tutorMode),text,chatH.slice(0,-1)).then(function(r){
    rmTyping();addMsg('ai',r);chatH.push({role:'assistant',content:r});
  }).catch(function(){
    rmTyping();addMsg('ai','\u26A0\uFE0F Connection issue. Check internet and try again.');
  }).finally(function(){chatBusy=false;document.getElementById('sbtn2').disabled=false;});
}
function setDiff(el,d){document.querySelectorAll('.dbtn').forEach(function(b){b.style.background='';b.style.borderColor='';b.style.color='';});el.style.background='rgba(85,133,255,.15)';el.style.borderColor='rgba(85,133,255,.4)';el.style.color='var(--ac)';qDiff=d;} function resetQuiz(){qData=[];qIdx=0;qScore=0;qAnswered=false;if(qTimer)clearInterval(qTimer);document.getElementById('quiz-setup').style.display='';document.getElementById('quiz-area').style.display='none';}
function genQuiz(){
  var subj=document.getElementById('q-subj').value,lvl=document.getElementById('q-lvl').value,num=document.getElementById('q-num').value;
  var top=(document.getElementById('q-top').value||'').trim(),board=document.getElementById('q-board').value;
  var btn=document.getElementById('q-btn');btn.disabled=true;btn.textContent='Generating...';
  showLoad('Creating '+num+' questions...');
  var sys='You are an expert '+lvl+' '+subj+' examiner'+(board!=='Any'?' ('+board+')':'')+'. Generate exactly '+num+' multiple choice questions'+(top?' on: '+top:' on key '+lvl+' syllabus topics — questions MUST be appropriate for '+lvl+' level students only')+'. Test genuine understanding. All 4 options plausible.\nReturn ONLY valid JSON array:\n[{"q":"Question?","opts":["A) opt","B) opt","C) opt","D) opt"],"ans":0,"exp":"Why correct and why others are wrong"}]\nans=0-based index — MUST be correct';
  aiCall(sys,'Generate the quiz. Double-check every ans value is correct before returning. Return ONLY the JSON array.').then(function(raw){
    hideLoad();var s=raw.indexOf('['),e=raw.lastIndexOf(']');if(s<0||e<0)throw new Error('No JSON');
    qData=JSON.parse(raw.substring(s,e+1));if(!qData.length)throw new Error('Empty');
    qIdx=0;qScore=0;qAnswered=false;
    document.getElementById('quiz-setup').style.display='none';document.getElementById('quiz-area').style.display='flex';
    renderQ();logAct('quiz');toast('Quiz ready! \uD83C\uDF40','success');
  }).catch(function(err){hideLoad();toast('Failed to generate quiz. Try again.','error');console.error(err);
  }).finally(function(){btn.disabled=false;btn.textContent='Generate Quiz \u2192';});
}
function renderQ(){
  if(qIdx>=qData.length){showScore();return;}
  var q=qData[qIdx];qAnswered=false;var pct=Math.round(qIdx/qData.length*100);
  var opts=q.opts.map(function(o,i){return '<div class="qopt" id="qo'+i+'" onclick="pickAns('+i+')"><div class="optl">'+['A','B','C','D'][i]+'</div><span>'+o.replace(/^[A-D]\)\s*/,'')+'</span></div>';}).join('');
  document.getElementById('quiz-area').innerHTML='<div style="height:4px;background:var(--b1);border-radius:2px;overflow:hidden"><div style="height:100%;width:'+pct+'%;background:var(--g1);border-radius:2px;transition:width .4s"></div></div><div class="qqc"><div class="qqn">Question '+(qIdx+1)+' of '+qData.length+' \u00B7 Score: '+qScore+'/'+qIdx+'</div><div class="qqq">'+q.q+'</div><div class="qopts">'+opts+'</div><div id="q-fb" style="display:none;border-radius:11px;padding:12px 15px;font-size:12.5px;line-height:1.6;margin-top:11px"></div></div><div style="display:flex;justify-content:flex-end"><button class="abt" id="q-nxt" onclick="nextQ()" style="display:none;padding:10px 20px;font-size:12px">Next \u2192</button></div>';
}
function pickAns(i){
  if(qAnswered)return;if(qTimer)clearInterval(qTimer);qAnswered=true;var q=qData[qIdx];var ok=(i===q.ans);if(ok)qScore++;
  for(var x=0;x<4;x++){var el=document.getElementById('qo'+x);if(!el)continue;if(x===q.ans)el.classList.add('ok');else if(x===i&&!ok)el.classList.add('no');}
  var fb=document.getElementById('q-fb');fb.style.display='block';fb.style.background=ok?'rgba(0,232,168,.07)':'rgba(255,79,107,.07)';fb.style.border='1px solid '+(ok?'rgba(0,232,168,.25)':'rgba(255,79,107,.2)');fb.innerHTML='<strong style="color:'+(ok?'var(--grn)':'var(--red)')+'"> '+(ok?'\u2713 Correct!':'\u2717 Incorrect')+'</strong> '+q.exp;document.getElementById('q-nxt').style.display='';
}
function nextQ(){if(qTimer)clearInterval(qTimer);qIdx++;renderQ();}
function showScore(){
  var pct=Math.round(qScore/qData.length*100),grade=pct>=90?'A*':pct>=80?'A':pct>=70?'B':pct>=60?'C':pct>=50?'D':'U',emoji=pct>=90?'\uD83C\uDFC6':pct>=70?'\uD83C\uDF1F':pct>=50?'\uD83D\uDC4D':'\uD83D\uDCDA';
  document.getElementById('quiz-area').innerHTML='<div class="qqc" style="text-align:center;padding:40px 20px"><div style="font-size:60px;margin-bottom:18px">'+emoji+'</div><div style="font-family:\'Playfair Display\',serif;font-size:26px;font-weight:800;margin-bottom:8px">'+(pct>=90?'Outstanding!':pct>=70?'Great work!':pct>=50?'Good effort!':'Keep practising!')+'</div><div style="font-size:14px;color:var(--t2);margin-bottom:8px">Score: <strong style="color:var(--ac);font-size:20px">'+qScore+'/'+qData.length+'</strong> ('+pct+'%)</div><div style="display:inline-block;background:rgba(85,133,255,.12);border:1px solid rgba(85,133,255,.3);color:var(--ac3);padding:8px 24px;border-radius:22px;font-size:14px;font-weight:700;margin-bottom:28px">Grade: '+grade+'</div><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button class="abt" onclick="resetQuiz()">New quiz</button><button class="tbtn" onclick="genQuiz()" style="padding:11px 20px">Retry</button><button class="tbtn" onclick="goV(\'tutor\',document.getElementById(\'ni-t\'))" style="padding:11px 20px">AI Tutor</button></div></div>';
  US.scores=US.scores||[];US.scores.push(pct);if(US.scores.length>20)US.scores.shift();saveSt();
}
function genCards(){
  var subj=document.getElementById('fc-s').value,top=(document.getElementById('fc-t').value||'').trim()||document.getElementById('fc-s').value,lvl=document.getElementById('fc-l').value;
  showLoad('Generating flashcards...');
  aiCall('Expert '+lvl+' '+subj+' teacher. Create 10 exam-ready flashcards on "'+top+'". 2-3 sentence answers.\nReturn ONLY JSON:\n[{"front":"Q?","back":"Answer"}]','Generate 10 flashcards. Return ONLY the JSON array.').then(function(raw){
    hideLoad();var s=raw.indexOf('['),e=raw.lastIndexOf(']');if(s<0||e<0)throw new Error('No JSON');
    fcCards=JSON.parse(raw.substring(s,e+1));if(!fcCards.length)throw new Error('Empty');
    fcIdx=0;fcKnow=0;fcUnsure=0;document.getElementById('fc-hint').textContent='Tap card to flip';
    renderCard();toast('10 flashcards ready! \uD83D\uDC46','success');logAct('flashcards');
  }).catch(function(err){hideLoad();toast('Failed. Try again.','error');console.error(err);});
}
function renderCard(){if(!fcCards.length)return;var c=fcCards[fcIdx];document.getElementById('fc-front').textContent=c.front;document.getElementById('fc-back').textContent=c.back;document.getElementById('fc-card').classList.remove('flipped');document.getElementById('fc-ctr').textContent=(fcIdx+1)+' / '+fcCards.length;document.getElementById('fc-pf').style.width=(fcIdx/fcCards.length*100)+'%';document.getElementById('fc-stat').textContent='\u2713 Know: '+fcKnow+' \u00B7 \uD83E\uDD14 Not sure: '+fcUnsure+' \u00B7 Remaining: '+(fcCards.length-fcIdx-1);}
function flipCard(){document.getElementById('fc-card').classList.toggle('flipped');}
function nextCard(){if(fcIdx<fcCards.length-1){fcIdx++;renderCard();}else toast('End of deck! \uD83C\uDF89','success');}
function prevCard(){if(fcIdx>0){fcIdx--;renderCard();}}
function rateCard(t){if(!fcCards.length)return;if(t==='know'){fcKnow++;US.cards=(US.cards||0)+1;saveSt();}else fcUnsure++;nextCard();}
function essayDo(action){
  var q=(document.getElementById('es-q').value||'').trim(),txt=(document.getElementById('es-txt').value||'').trim();
  var lvl=document.getElementById('es-l').value,board=document.getElementById('es-b').value,res=document.getElementById('es-res');
  if(!txt&&['feedback','improve','grade'].includes(action)){toast('Paste your essay first','error');return;}
  if(!q&&['plan','grade','points'].includes(action)){toast('Enter the essay title first','error');return;}
  ['eb1','eb2','eb3','eb4','eb5'].forEach(function(id){var el=document.getElementById(id);if(el)el.disabled=true;});
  res.style.display='block';res.textContent='Analysing...';res.style.color='var(--t2)';showLoad('Analysing...');
  var bd=board!=='Any'?' ('+board+' mark scheme)':'';
  var sys={feedback:'Senior '+lvl+' examiner'+bd+'. Feedback:\nOVERALL: [2 sentences]\nSTRENGTHS \u2713\n- [specific]\nERRORS \u2717\n- [with correction]\nMISSING \u26A0\n- [absent points]\nGRADE: [grade] \u2014 [reason]\nTOP 2 IMPROVEMENTS:\n1.\n2.',plan:lvl+' essay planner'+bd+'.\nTHESIS: [full thesis]\nPARA 1-3: [topic]+[evidence]+[analysis]\nCONCLUSION: [synthesis]\nKEY TERMS (8):\nAVOID:',improve:lvl+' writing expert'+bd+'.\n1. DIAGNOSIS: 2-3 weaknesses\n2. IMPROVED VERSION: Better intro\n3. KEY CHANGES: What changed',grade:lvl+' chief examiner'+bd+'.\nGRADE: [grade]\nEARNING \u2713:\nLOSING \u2717:\nGAP TO NEXT: [2-3 changes]\nTIP:',points:lvl+' expert'+bd+'.\nARGUMENTS (5):\nEVIDENCE (6):\nKEY TERMS (10):\nTOP ANSWERS DO:\nMISTAKES:'};
  var um=['plan','points'].includes(action)?'Essay: "'+q+'"':'Essay: "'+q+'"\n\n'+txt;
  aiCall(sys[action],um).then(function(r){hideLoad();res.style.color='var(--txt)';res.innerHTML=r.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<strong style="color:var(--gold)">$1</strong>');logAct('essay');}).catch(function(){hideLoad();res.textContent='Error. Try again.';res.style.color='var(--red)';}).finally(function(){['eb1','eb2','eb3','eb4','eb5'].forEach(function(id){var el=document.getElementById(id);if(el)el.disabled=false;});});
}
function solveHW(){
  var q=(document.getElementById('hw-q').value||'').trim();if(!q){toast('Type your question first','error');return;}
  var res=document.getElementById('hw-res'),steps=document.getElementById('hw-steps');
  res.style.display='block';document.getElementById('hw-title').textContent=q.length>65?q.substring(0,65)+'...':q;
  steps.innerHTML='<div style="color:var(--t2)">Solving...</div>';showLoad('Solving...');
  var lv=(CP&&CP.level)?(LVM[CP.level]||'GCSE'):'GCSE';
  aiCall('Solve this '+lv+' homework. Be precise. Respond in student\'s language.\nFORMAT:\nUNDERSTAND: [1 sentence]\n1. [Step + WHY]\nFINAL ANSWER: [complete]\nPRACTICE: [2 similar questions]',q).then(function(r){
    hideLoad();steps.innerHTML=r.split('\n').filter(function(l){return l.trim();}).map(function(l){var t=l.trim();if(/^FINAL ANSWER/i.test(t))return'<div style="margin-top:14px;padding:13px 16px;background:rgba(85,133,255,.1);border:1px solid rgba(85,133,255,.28);border-radius:12px;font-size:13px;color:var(--ac3);font-weight:700">'+l+'</div>';if(/^PRACTICE/i.test(t))return'<div style="margin-top:14px;padding:11px 14px;background:rgba(0,232,168,.07);border:1px solid rgba(0,232,168,.18);border-radius:11px;font-size:12.5px;color:var(--grn);font-weight:700">'+l+'</div>';if(/^UNDERSTAND/i.test(t))return'<div style="padding:10px 14px;background:rgba(160,123,255,.07);border:1px solid rgba(160,123,255,.18);border-radius:11px;font-size:12.5px;color:var(--pur);font-weight:700">'+l+'</div>';if(/^\d+[.):]/.test(t)){var n=t.match(/^\d+/)[0],tx=t.replace(/^\d+[.):\s]+/,'');return'<div class="hwstep"><div class="sn2">'+n+'</div><div class="st"><strong>'+tx+'</strong></div></div>';}return'<div style="font-size:12.5px;color:var(--t2);line-height:1.65;padding:2px 0 2px 38px">'+l+'</div>';}).join('');
    var _fa=r.match(/^FINAL ANSWER[:\s]*([\s\S]+?)(?=\nPRACTICE|\n\n|$)/im);
    var _fat=_fa?_fa[1].trim():'';
    var _abox=document.getElementById('hw-answer-box'),_atxt=document.getElementById('hw-answer-text');
    if(_fat&&_abox&&_atxt){_atxt.textContent=_fat;_abox.style.display='block';}
    else if(_abox){_abox.style.display='none';}
    logAct('homework');
  }).catch(function(){hideLoad();steps.innerHTML='<div style="color:var(--red)">Error. Check internet.</div>';});
}
function openPaper(name,subj,board){
  var pmtSubjects={'Mathematics':'https://www.physicsandmathstutor.com/maths-revision/','Biology':'https://www.physicsandmathstutor.com/biology-revision/','Chemistry':'https://www.physicsandmathstutor.com/chemistry-revision/','Physics':'https://www.physicsandmathstutor.com/physics-revision/','English Literature':'https://www.revisely.co.uk/past-papers/gcse/english-literature','English Language':'https://www.revisely.co.uk/past-papers/gcse/english-language','History':'https://www.revisely.co.uk/past-papers/gcse/history','Geography':'https://www.revisely.co.uk/past-papers/gcse/geography','Psychology':'https://www.physicsandmathstutor.com/psychology-revision/','Computer Science':'https://www.revisely.co.uk/past-papers/gcse/computer-science','Economics':'https://www.physicsandmathstutor.com/economics-revision/','French':'https://www.revisely.co.uk/past-papers/gcse/french','Spanish':'https://www.revisely.co.uk/past-papers/gcse/spanish','German':'https://www.revisely.co.uk/past-papers/gcse/german'};
  var directUrl=pmtSubjects[subj]||'https://www.revisely.co.uk/past-papers';
  document.getElementById('chat-ta').value='Help me prepare for '+name+' ('+board+'). Give me: 1) Key topics likely to come up 2) '+board+' mark scheme secrets 3) Common mistakes students make 4) Top 5 tips for a top grade 5) A practice question with model answer';
  goV('tutor',document.getElementById('ni-t'));
  toast('AI ready! Opening past papers...','success');
  setTimeout(function(){window.open(directUrl,'_blank');},1500);
}
function summariseYT(){
  var url=(document.getElementById('yt-url').value||'').trim();if(!url){toast('Paste a YouTube URL or topic','error');return;}
  var res=document.getElementById('yt-res');res.style.display='block';res.textContent='Generating notes...';res.style.color='var(--t2)';showLoad('Generating revision notes...');
  var vid=url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  var ref=(url.includes('youtube.com')||url.includes('youtu.be'))?'YouTube video'+(vid?' ID: '+vid[1]:''):url;
  aiCall('Create COMPREHENSIVE revision notes. Be detailed and thorough.','Revision notes for: "'+ref+'"\n\n\uD83D\uDCCB OVERVIEW\n[3-4 sentences]\n\n\uD83C\uDFAF LEARNING OBJECTIVES\n[6-7 points]\n\n\uD83D\uDCDA CONTENT NOTES\nSection 1: [concept]\n\u2022 [detail]\nSection 2: [concept]\n\u2022 [detail]\n\n\uD83D\uDD11 KEY TERMS (12)\n[Term]: [definition]\n\n\uD83D\uDCCA KEY FACTS (10+)\n\u2022 [fact]\n\n\u26A1 EXAM TIPS\n1. [tip]\n\n\u2753 PRACTICE QUESTIONS\nQ1 (6 marks): [question]\nAnswer: [key points]').then(function(r){hideLoad();res.style.color='var(--txt)';res.innerHTML=r.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<strong style="color:var(--gold)">$1</strong>');logAct('youtube');toast('Notes done! \u2713','success');}).catch(function(){hideLoad();res.style.color='var(--red)';res.textContent='Error. Check internet.';});
}

function ytDemo(topic){document.getElementById('yt-url').value=topic;summariseYT();}
function notesAI(action){
  var notes=(document.getElementById('notes-ta').value||'').trim();if(!notes){toast('Write notes first','error');return;}
  var res=document.getElementById('notes-res');res.style.display='block';res.textContent='Processing...';showLoad('Analysing notes...');
  var sys={summarise:'Summarise:\nKEY POINTS (6 bullets)\nCORE CONCEPTS\nONE-LINE SUMMARY:',flashcards:'8 flashcard pairs:\nQ1: [q]\nA1: [a]\n...',gaps:'4-5 knowledge gaps:\nGAP: [topic]\nWHY: [importance]\nADD: [what to learn]',improve:'Improve these notes into polished exam-ready format.',quiz:'5 quiz questions:\n1. [Q] ([marks] marks)\nAnswer: [model]',mindmap:'Text mind map:\nCENTRAL: [topic]\n\u251C\u2500\u2500 BRANCH 1\n\u2502 \u251C\u2500\u2500 [sub]'};
  aiCall(sys[action],'Notes:\n\n'+notes).then(function(r){hideLoad();res.style.color='var(--txt)';res.innerHTML=r.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<strong style="color:var(--gold)">$1</strong>');logAct('notes');toast('Done! \u2713','success');}).catch(function(){hideLoad();res.style.color='var(--red)';res.textContent='Error. Try again.';});
}
function clearNotes(){document.getElementById('notes-ta').value='';document.getElementById('notes-res').style.display='none';}
function saveNote(){var n=document.getElementById('notes-ta').value;if(!n){toast('Nothing to save','info');return;}localStorage.setItem('uv_note_'+Date.now(),JSON.stringify({content:n,saved:new Date().toISOString()}));toast('Notes saved! \u2713','success');}
function toggleRec(){
  if(isRec){stopRec();return;}
  var SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){toast('Voice notes need Chrome or Safari','error');return;}
  recog=new SR();recog.continuous=true;recog.interimResults=true;
  var lm={en:'en-GB',ar:'ar-SA',fr:'fr-FR',es:'es-ES',de:'de-DE',zh:'zh-CN',hi:'hi-IN',pt:'pt-BR',ja:'ja-JP',tr:'tr-TR'};
  recog.lang=lm[currentLang]||'en-GB';
  recog.onresult=function(e){var fin='',intr='';for(var i=e.resultIndex;i<e.results.length;i++){if(e.results[i].isFinal)fin+=e.results[i][0].transcript;else intr+=e.results[i][0].transcript;}if(fin)voiceTxt+=fin+' ';var tt=document.getElementById('v-trans');if(tt)tt.textContent=voiceTxt+intr;};
  recog.onerror=function(e){stopRec();toast('Voice error: '+e.error,'error');};
  recog.start();isRec=true;
  document.getElementById('v-ring').classList.add('rec');
  document.getElementById('v-status').textContent='Recording... tap to stop';
  var trans=document.getElementById('v-trans');trans.style.display='block';if(!voiceTxt)trans.textContent='Listening...';
}
function stopRec(){if(recog)recog.stop();isRec=false;document.getElementById('v-ring').classList.remove('rec');document.getElementById('v-status').textContent=voiceTxt?'Done \u2014 choose an AI action below':'No speech detected. Try again.';if(voiceTxt)document.getElementById('v-acts').style.display='flex';}
function voiceAI(action){
  if(!voiceTxt){toast('Record something first','error');return;}
  var resw=document.getElementById('v-resw'),res=document.getElementById('v-res');resw.style.display='block';res.textContent='Processing...';showLoad('Processing...');
  var sys={notes:'Structured revision notes from spoken notes. Clear headings, bullets, exam-ready.',flashcards:'8 flashcard pairs:\nQ1: [q]\nA1: [a]\n...',quiz:'5 quiz questions:\n1. [Q] ([marks] marks)\nAnswer: [model]'};
  aiCall(sys[action],'Spoken notes:\n\n'+voiceTxt).then(function(r){hideLoad();res.innerHTML=r.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<strong style="color:var(--gold)">$1</strong>');logAct('voice');toast('Done! \u2713','success');}).catch(function(){hideLoad();res.textContent='Error. Try again.';});
}
function clearVoice(){voiceTxt='';var t=document.getElementById('v-trans'),rw=document.getElementById('v-resw'),a=document.getElementById('v-acts'),s=document.getElementById('v-status');t.style.display='none';t.textContent='';rw.style.display='none';a.style.display='none';s.textContent='Tap to start recording';}


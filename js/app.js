// Load Supabase SDK
let _sb = null;
function getSB() {
  if (_sb) return Promise.resolve(_sb);
  return new Promise(function(res, rej) {
    if (window.supabase) { _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); res(_sb); return; }
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    s.onload = function() { _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); res(_sb); };
    s.onerror = function() { rej(new Error('Cannot load Supabase')); };
    document.head.appendChild(s);
  });
}

// Check if Supabase is configured
function sbConfigured() {
  return SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';
}

// ── TRANSLATIONS ──
const LANGS = {
  en:{dir:'ltr',badge:"The World's Best Free AI Study Platform",hero:'Study smarter. Achieve extraordinary results.',sub:'9 powerful AI tools. Every exam board. Any language. Free forever.',start:'Get started free \u2192',signin:'Sign in',fn:'First name',ln:'Last name',email:'Email address',pw:'Password',signinbtn:'Sign in to UltraVision AI',stud:'Students',free:'Forever',tools:'AI Tools',countries:'Countries'},
  ar:{dir:'rtl',badge:'\u0623\u0641\u0636\u0644 \u0645\u0646\u0635\u0629 \u062f\u0631\u0627\u0633\u0629 \u0630\u0643\u0627\u0621 \u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0645\u062c\u0627\u0646\u064a\u0629 \u0641\u064a \u0627\u0644\u0639\u0627\u0644\u0645',hero:'\u0627\u062f\u0631\u0633 \u0628\u0630\u0643\u0627\u0621. \u062d\u0642\u0651\u0642 \u0646\u062a\u0627\u0626\u062c \u0627\u0633\u062a\u062b\u0646\u0627\u0626\u064a\u0629.',sub:'9 \u0623\u062f\u0648\u0627\u062a \u0630\u0643\u0627\u0621 \u0627\u0635\u0637\u0646\u0627\u0639\u064a. \u0643\u0644 \u0644\u062c\u0627\u0646 \u0627\u0644\u0627\u0645\u062a\u062d\u0627\u0646\u0627\u062a. \u0623\u064a \u0644\u063a\u0629. \u0645\u062c\u0627\u0646\u0627\u064b \u0644\u0644\u0623\u0628\u062f.',start:'\u0627\u0628\u062f\u0623 \u0645\u062c\u0627\u0646\u0627\u064b \u2190',signin:'\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644',fn:'\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0623\u0648\u0644',ln:'\u0627\u0633\u0645 \u0627\u0644\u0639\u0627\u0626\u0644\u0629',email:'\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a',pw:'\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631',signinbtn:'\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0625\u0644\u0649 UltraVision AI',stud:'\u0637\u0627\u0644\u0628',free:'\u0645\u062c\u0627\u0646\u064a',tools:'\u0623\u062f\u0648\u0627\u062a',countries:'\u062f\u0648\u0644\u0629'},
  fr:{dir:'ltr',badge:"La meilleure plateforme d'IA scolaire gratuite",hero:'\u00c9tudiez mieux. Obtenez des r\u00e9sultats extraordinaires.',sub:'9 outils IA. Tous les examens. Toutes les langues. Gratuit pour toujours.',start:'Commencer gratuitement \u2192',signin:'Se connecter',fn:'Pr\u00e9nom',ln:'Nom',email:'Adresse e-mail',pw:'Mot de passe',signinbtn:'Se connecter \u00e0 UltraVision AI',stud:'\u00c9tudiants',free:'Gratuit',tools:'Outils IA',countries:'Pays'},
  es:{dir:'ltr',badge:'La mejor plataforma de estudio con IA del mundo',hero:'Estudia m\u00e1s inteligente. Logra resultados extraordinarios.',sub:'9 herramientas de IA. Todos los ex\u00e1menes. Cualquier idioma. Gratis para siempre.',start:'Comenzar gratis \u2192',signin:'Iniciar sesi\u00f3n',fn:'Nombre',ln:'Apellido',email:'Correo electr\u00f3nico',pw:'Contrase\u00f1a',signinbtn:'Iniciar sesi\u00f3n en UltraVision AI',stud:'Estudiantes',free:'Gratis',tools:'Herramientas IA',countries:'Pa\u00edses'},
  de:{dir:'ltr',badge:'Die beste kostenlose KI-Lernplattform der Welt',hero:'Lerne intelligenter. Erziele au\u00dfergew\u00f6hnliche Ergebnisse.',sub:'9 KI-Tools. Alle Pr\u00fcfungen. Jede Sprache. Kostenlos f\u00fcr immer.',start:'Kostenlos starten \u2192',signin:'Anmelden',fn:'Vorname',ln:'Nachname',email:'E-Mail-Adresse',pw:'Passwort',signinbtn:'Bei UltraVision AI anmelden',stud:'Sch\u00fcler',free:'Kostenlos',tools:'KI-Tools',countries:'L\u00e4nder'},
  zh:{dir:'ltr',badge:'\u5168\u7403\u6700\u597d\u7684\u514d\u8d39AI\u5b66\u4e60\u5e73\u53f0',hero:'\u8070\u660e\u5b66\u4e60\uff0c\u53d6\u5f97\u975e\u51e1\u6210\u7ee9\u3002',sub:'9\u5927AI\u5de5\u5177\u3002\u8986\u76d6\u6240\u6709\u8003\u8bd5\u3002\u652f\u6301\u4efb\u4f55\u8bed\u8a00\u3002\u6c38\u4e45\u514d\u8d39\u3002',start:'\u514d\u8d39\u5f00\u59cb \u2192',signin:'\u767b\u5f55',fn:'\u540d',ln:'\u59d3',email:'\u7535\u5b50\u90ae\u4ef6\u5730\u5740',pw:'\u5bc6\u7801',signinbtn:'\u767b\u5f55 UltraVision AI',stud:'\u5b66\u751f',free:'\u6c38\u4e45\u514d\u8d39',tools:'AI\u5de5\u5177',countries:'\u56fd\u5bb6'},
  hi:{dir:'ltr',badge:'\u0926\u0941\u0928\u093f\u092f\u093e \u0915\u093e \u0938\u092c\u0938\u0947 \u0905\u091a\u094d\u091b\u093e \u092e\u0941\u092b\u093c\u094d\u0924 AI \u0905\u0927\u094d\u092f\u092f\u0928 \u092e\u0902\u091a',hero:'\u0938\u094d\u092e\u093e\u0930\u094d\u091f \u0924\u0930\u0940\u0915\u0947 \u0938\u0947 \u092a\u0922\u093c\u0947\u0902\u0964 \u0905\u0938\u093e\u0927\u093e\u0930\u0923 \u092a\u0930\u093f\u0923\u093e\u092e \u092a\u093e\u090f\u0902\u0964',sub:'9 AI \u0909\u092a\u0915\u0930\u0923\u0964 \u0939\u0930 \u092a\u0930\u0940\u0915\u094d\u0937\u093e\u0964 \u0915\u094b\u0908 \u092d\u0940 \u092d\u093e\u0937\u093e\u0964 \u0939\u092e\u0947\u0936\u093e \u092e\u0941\u092b\u093c\u094d\u0924\u0964',start:'\u092e\u0941\u092b\u093c\u094d\u0924 \u0936\u0941\u0930\u0942 \u0915\u0930\u0947\u0902 \u2192',signin:'\u0938\u093e\u0907\u0928 \u0907\u0928',fn:'\u092a\u0939\u0932\u093e \u0928\u093e\u092e',ln:'\u0905\u0902\u0924\u093f\u092e \u0928\u093e\u092e',email:'\u0908\u092e\u0947\u0932 \u092a\u0924\u093e',pw:'\u092a\u093e\u0938\u0935\u0930\u094d\u0921',signinbtn:'UltraVision AI \u092e\u0947\u0902 \u0938\u093e\u0907\u0928 \u0907\u0928 \u0915\u0930\u0947\u0902',stud:'\u091b\u093e\u0924\u094d\u0930',free:'\u092e\u0941\u092b\u093c\u094d\u0924',tools:'AI \u0909\u092a\u0915\u0930\u0923',countries:'\u0926\u0947\u0936'},
  pt:{dir:'ltr',badge:'A melhor plataforma de estudo com IA do mundo',hero:'Estude de forma mais inteligente. Obtenha resultados extraordin\u00e1rios.',sub:'9 ferramentas de IA. Todos os exames. Qualquer idioma. Gratuito para sempre.',start:'Come\u00e7ar gr\u00e1tis \u2192',signin:'Entrar',fn:'Primeiro nome',ln:'Sobrenome',email:'Endere\u00e7o de e-mail',pw:'Senha',signinbtn:'Entrar no UltraVision AI',stud:'Estudantes',free:'Gr\u00e1tis',tools:'Ferramentas IA',countries:'Pa\u00edses'},
  ja:{dir:'ltr',badge:'\u4e16\u754c\u6700\u9ad8\u306e\u7121\u6599AI\u5b66\u7fd2\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0',hero:'\u8ce2\u304f\u5b66\u307c\u3046\u3002\u7d20\u6674\u3089\u3057\u3044\u7d50\u679c\u3092\u9054\u6210\u3057\u3088\u3046\u3002',sub:'9\u3064\u306eAI\u30c4\u30fc\u30eb\u3002\u3042\u3089\u3086\u308b\u8a66\u9a13\u3002\u3042\u3089\u3086\u308b\u8a00\u8a9e\u3002\u6c38\u4e45\u7121\u6599\u3002',start:'\u7121\u6599\u3067\u59cb\u3081\u308b \u2192',signin:'\u30b5\u30a4\u30f3\u30a4\u30f3',fn:'\u540d\u524d',ln:'\u59d3',email:'\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9',pw:'\u30d1\u30b9\u30ef\u30fc\u30c9',signinbtn:'UltraVision AI\u306b\u30b5\u30a4\u30f3\u30a4\u30f3',stud:'\u5b66\u751f',free:'\u6c38\u4e45\u7121\u6599',tools:'AI\u30c4\u30fc\u30eb',countries:'\u56fd'},
  tr:{dir:'ltr',badge:'D\u00fcnyan\u0131n en iyi \u00fccretsiz AI \u00e7al\u0131\u015fma platformu',hero:'Daha ak\u0131ll\u0131 \u00e7al\u0131\u015f. Ola\u011f\u00fcst\u00fc sonu\u00e7lar elde et.',sub:'9 g\u00fc\u00e7l\u00fc AI arac\u0131. Her s\u0131nav kurulu. Her dil. Sonsuza kadar \u00fccretsiz.',start:'\u00dccretsiz ba\u015fla \u2192',signin:'Giri\u015f yap',fn:'Ad',ln:'Soyad',email:'E-posta adresi',pw:'\u015eifre',signinbtn:"UltraVision AI'e giri\u015f yap",stud:'\u00d6\u011frenci',free:'\u00dccretsiz',tools:'AI Ara\u00e7lar\u0131',countries:'\u00dclke'}
};

// ── LOCAL PROFILE STORE (for study data - Supabase handles auth) ──
const LOCAL = {
  getProfiles: function() { try { return JSON.parse(localStorage.getItem('uv_profiles') || '{}'); } catch(e) { return {}; } },
  getProfile: function(uid) { return LOCAL.getProfiles()[uid] || {}; },
  saveProfile: function(uid, data) { var p = LOCAL.getProfiles(); p[uid] = Object.assign(p[uid]||{}, data); localStorage.setItem('uv_profiles', JSON.stringify(p)); },
  getStat: function(uid) { try { return JSON.parse(localStorage.getItem('uv_st_' + uid) || '{"sessions":0,"scores":[],"cards":0,"streak":1}'); } catch(e) { return {sessions:0,scores:[],cards:0,streak:1}; } },
  saveStat: function(uid, s) { localStorage.setItem('uv_st_' + uid, JSON.stringify(s)); }
};

// ── STATE ──
var CU = null; // current Supabase user
var CP = {};   // current profile (extra data)
var US = {sessions:0, scores:[], cards:0, streak:1};
var chatH = [], tutorMode = 'tutor', chatBusy = false;
var qData = [], qIdx = 0, qScore = 0, qAnswered = false, qDiff = 'medium', qTimer = null;
var fcCards = [], fcIdx = 0, fcKnow = 0, fcUnsure = 0;
var recentActs = [];
var selLevel = '', selTier = '', selBoardVal = '';
var recog = null, isRec = false, voiceTxt = '';
var currentLang = 'en';

var isAdmin = function(email) { return email && email.toLowerCase() === ADMIN_EMAIL.toLowerCase(); };

// ── LANGUAGE ──
function applyLang(lang) {
  var L = LANGS[lang] || LANGS.en;
  currentLang = lang;
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', L.dir);
  var map = {
    'hero-badge':'badge','hero-h1':'hero','hero-sub-text':'sub',
    'hero-btn1':'start','hero-btn2':'signin',
    'nav-signin-btn':'signin','nav-start-btn':'start',
    'su-fn-lbl':'fn','su-ln-lbl':'ln','su-em-lbl':'email','su-pw-lbl':'pw',
    'li-em-lbl':'email','li-pw-lbl':'pw','li-btn':'signinbtn',
    'sc-stud-lbl':'stud','sc-free-lbl':'free','sc-tools-lbl':'tools','sc-count-lbl':'countries'
  };
  Object.keys(map).forEach(function(id) {
    var el = document.getElementById(id);
    if (el && L[map[id]]) el.textContent = L[map[id]];
  });
  var phs = {'li-em':L.email,'li-pw':L.pw,'su-fn':L.fn,'su-ln':L.ln,'su-em':L.email,'su-pw':L.pw};
  Object.keys(phs).forEach(function(id) { var el=document.getElementById(id); if(el&&phs[id]) el.placeholder=phs[id]; });
  document.querySelectorAll('.hbtns,.hpills').forEach(function(el) { el.style.justifyContent = L.dir==='rtl' ? 'flex-end' : 'flex-start'; });
}
function setLang(lang) {
  if (!LANGS[lang]) return;
  applyLang(lang);
  var names = {en:'English',ar:'\u0627\u0644\u0639\u0631\u0628\u064a\u0629',fr:'Fran\u00e7ais',es:'Espa\u00f1ol',de:'Deutsch',zh:'\u4e2d\u6587',hi:'\u0939\u093f\u0902\u0926\u0940',pt:'Portugu\u00eas',ja:'\u65e5\u672c\u8a9e',tr:'T\u00fcrk\u00e7e'};
  toast('Language: ' + (names[lang]||lang), 'success');
}

// ── UI HELPERS ──
function toast(msg, type) {
  var el = document.getElementById('toast');
  var c = {success:'#00E8A8',info:'#5585FF',error:'#FF4F6B'};
  el.textContent = msg; el.style.borderColor = c[type]||c.info; el.style.color = c[type]||c.info;
  el.classList.add('show'); setTimeout(function(){el.classList.remove('show');}, 3800);
}
function showLoad(m) { document.getElementById('ai-msg').textContent = m||'UltraVision AI is thinking...'; document.getElementById('aiol').classList.add('show'); }
function hideLoad() { document.getElementById('aiol').classList.remove('show'); }
function toggleSB() { document.getElementById('sidebar').classList.toggle('open'); document.getElementById('sovl').classList.toggle('show'); }
function closeSB() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sovl').classList.remove('show'); }
function showPg(id) {
  document.querySelectorAll('#auth-wrap > div').forEach(function(el){el.classList.add('hidden');});
  var el = document.getElementById('pg-'+id);
  if (el) { el.classList.remove('hidden'); window.scrollTo(0,0); }
}
function togglePw(id) { var el=document.getElementById(id); if(el) el.type=el.type==='password'?'text':'password'; }
function showSetupBanner() {
  var existing = document.getElementById('setup-banner');
  if (existing) { existing.style.display='flex'; return; }
  var banner = document.createElement('div');
  banner.id = 'setup-banner';
  banner.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(4,6,14,.97);display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(10px)';
  banner.innerHTML = '<div style="max-width:560px;background:rgba(12,18,36,.98);border:1px solid rgba(85,133,255,.3);border-radius:22px;padding:36px;box-shadow:0 32px 80px rgba(0,0,0,.7)">' +
    '<div style="font-size:30px;margin-bottom:16px">⚡</div>' +
    '<h2 style="font-family:\'Playfair Display\',serif;font-size:24px;font-weight:800;margin-bottom:12px">Set up Real Auth in 5 minutes</h2>' +
    '<p style="color:var(--t2);font-size:13px;line-height:1.65;margin-bottom:24px">UltraVision AI uses <strong style="color:var(--txt)">Supabase</strong> for real email verification, real password reset, and a real user database. It\'s <strong style="color:var(--grn)">100% free</strong> for up to 50,000 users.</p>' +
    '<ol style="color:var(--t2);font-size:13px;line-height:2.2;padding-left:20px;margin-bottom:24px">' +
    '<li>Go to <a href="https://supabase.com" target="_blank" style="color:var(--ac)">supabase.com</a> \u2192 New project (free)</li>' +
    '<li>Settings \u2192 API \u2192 Copy <strong style="color:var(--txt)">Project URL</strong> and <strong style="color:var(--txt)">anon public</strong> key</li>' +
    '<li>Open this <code style="background:rgba(85,133,255,.12);padding:2px 8px;border-radius:5px;font-family:monospace">index.html</code> in a text editor</li>' +
    '<li>Find <code style="background:rgba(85,133,255,.12);padding:2px 8px;border-radius:5px;font-family:monospace">YOUR_SUPABASE_URL</code> and replace with your URL</li>' +
    '<li>Find <code style="background:rgba(85,133,255,.12);padding:2px 8px;border-radius:5px;font-family:monospace">YOUR_SUPABASE_ANON_KEY</code> and replace with your key</li>' +
    '<li>Authentication \u2192 Email Templates \u2192 customise your emails (optional)</li>' +
    '<li>Save the file, re-upload to Vercel. Done! \uD83C\uDF89</li>' +
    '</ol>' +
    '<div style="background:rgba(85,133,255,.08);border:1px solid rgba(85,133,255,.2);border-radius:11px;padding:14px;margin-bottom:20px;font-family:monospace;font-size:12px;color:var(--ac3);line-height:1.9">' +
    'const SUPABASE_URL = \'https://xxxx.supabase.co\';<br>' +
    'const SUPABASE_ANON_KEY = \'eyJhbGc...\';</div>' +
    '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
    '<a href="https://supabase.com/dashboard" target="_blank" style="background:var(--g1);color:#fff;padding:12px 22px;border-radius:11px;font-size:13px;font-weight:700;text-decoration:none;box-shadow:0 4px 18px rgba(85,133,255,.4)">Open Supabase Dashboard \u2192</a>' +
    '<button onclick="document.getElementById(\'setup-banner\').style.display=\'none\'" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:var(--t2);padding:12px 22px;border-radius:11px;font-size:13px;cursor:pointer;font-family:\'Outfit\',sans-serif">Close</button>' +
    '</div></div>';
  document.body.appendChild(banner);
}

// ── LAUNCH APP ──
  function saveProgress() {
  if (!CU) return;
  getSB().then(function(sb) {
    var stats = JSON.parse(localStorage.getItem('uv_st_' + CU.id) || '{}');
    return sb.from('progress').upsert({
      user_id: CU.id,
      sessions: stats.sessions || 0,
      quizzes_taken: stats.quizzes || 0,
      quiz_avg: stats.quizAvg || 0,
      cards_done: stats.cards || 0,
      streak: stats.streak || 1,
      last_active: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
  }).catch(function(){});
}
function launchApp() {
  if (!CU) return;
  var meta = CU.user_metadata || {};
  var email = CU.email;
  // Load or init profile
  CP = LOCAL.getProfile(CU.id);
  // Merge Supabase metadata into local profile
  if (meta.level && !CP.level) CP.level = meta.level;
  if (meta.board && !CP.board) CP.board = meta.board;
  if (meta.country && !CP.country) CP.country = meta.country;
  if (meta.school && !CP.school) CP.school = meta.school;
  if (meta.subjects && !CP.subjects) CP.subjects = meta.subjects;
  CP.firstName = meta.first_name || meta.full_name || email.split('@')[0];
  CP.name = meta.full_name || CP.firstName;
  CP.email = email;
  LOCAL.saveProfile(CU.id, CP);
  US = LOCAL.getStat(CU.id);
  US.sessions = (US.sessions||0)+1;
  LOCAL.saveStat(CU.id, US);
  document.getElementById('auth-wrap').style.display = 'none';
  document.getElementById('app').classList.add('on');
  var init = (CP.firstName||'UV').substring(0,2).toUpperCase();
  var av=document.getElementById('sb-av'); if(av){av.textContent=init;av.className=isAdmin(email)?'sbav adm':'sbav';}
  var nm=document.getElementById('sb-name'); if(nm) nm.textContent=CP.firstName||CP.name;
  var pl=document.getElementById('sb-plan'); if(pl){pl.textContent=isAdmin(email)?'\u26A1 Super Admin':CP.isPro?'\u26A1 Pro Plan':'\u2736 Free Plan';pl.style.color=CP.isPro?'var(--gold)':'';pl.className=isAdmin(email)?'sbpl adm':'sbpl';}
  var dn=document.getElementById('dash-name'); if(dn) dn.textContent=CP.firstName||CP.name;
  var dd=document.getElementById('dash-date'); if(dd) dd.textContent=new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  var di=document.getElementById('dash-info');
  if(di){var lm={secondary:'Secondary School',gcse:'GCSE',alevel:'A-Level',university:'University'};var parts=[];if(CP.level)parts.push(lm[CP.level]||CP.level);if(CP.board&&CP.board!=='Other')parts.push(CP.board);if(CP.country)parts.push(CP.country);di.textContent=parts.join(' \u00B7');}
  var an=document.getElementById('ni-a'),as2=document.getElementById('sb-admsec');
  if(isAdmin(email)){if(an)an.classList.remove('hidden');if(as2)as2.style.display='';}
  else{if(an)an.classList.add('hidden');if(as2)as2.style.display='none';}
 updateUI();
  if(window.location.search.includes('upgraded=true')){
    CP.isPro=true;LOCAL.saveProfile(CU.id,CP);
    history.replaceState(null,'',window.location.pathname);
    toast('Welcome to Pro! \uD83C\uDF89 You now have full access!','success');
    var pl=document.getElementById('sb-plan');
    if(pl){pl.textContent='\u26A1 Pro Plan';pl.style.color='var(--gold)';}
  } else {
    toast('Welcome to UltraVision AI! \uD83D\uDE80','success');
  }
}

// ── LOAD ──
window.addEventListener('load', function() {
  applyLang('en'); showPg('land');
  // Handle email verification / password reset callbacks
  handleAuthCallback();
  // Check for existing session
  if (sbConfigured()) {
    getSB().then(function(sb) {
      return sb.auth.getSession();
    }).then(function(res) {
      if (res.data && res.data.session) {
        CU = res.data.session.user;
        if (window.location.hash.includes('type=recovery')) {
          document.getElementById('auth-wrap').style.display = 'flex';
          document.getElementById('app').classList.remove('on');
          showPg('reset-pw');
        } else {
          launchApp();
        }
      }
    }).catch(function(){});
    // Listen for auth state changes
    getSB().then(function(sb) {
      sb.auth.onAuthStateChange(function(event, session) {
  var isRecovery = window.location.hash.indexOf('type=recovery') > -1 || 
                    window.location.search.indexOf('type=recovery') > -1;
  
  if (event === 'PASSWORD_RECOVERY' || isRecovery) {
    document.getElementById('auth-wrap').style.display = 'flex';
    document.getElementById('auth-wrap').style.zIndex = '9999';
    document.getElementById('app').style.display = 'none';
    document.getElementById('app').classList.remove('on');
    showPg('reset-pw');
    return;
  }
  
  if (event === 'SIGNED_IN' && session) {
    if (isRecovery) return;
    if (document.getElementById('auth-wrap').style.display !== 'none' && 
        document.getElementById('pg-reset-pw') && 
        !document.getElementById('pg-reset-pw').classList.contains('hidden')) return;
    CU = session.user; 
    launchApp();
  } else if (event === 'SIGNED_OUT') {
    CU = null;
  }
});
    });
  }
  // If not configured, show demo mode notice
  if (!sbConfigured()) {
    // Show a non-intrusive banner
    var notice = document.createElement('div');
    notice.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:1000;background:rgba(85,133,255,.12);border:1px solid rgba(85,133,255,.3);color:var(--ac3);padding:12px 18px;border-radius:12px;font-size:12px;font-weight:600;cursor:pointer;max-width:280px;line-height:1.5;backdrop-filter:blur(12px)';
    notice.textContent = '\u26A1 Supabase not configured — click to set up real auth (5 min, free)';
    notice.onclick = showSetupBanner;
    document.body.appendChild(notice);
  }
  initParticles();
});

function initParticles() {
  var c=document.getElementById('pc'); if(!c)return;
  var ctx=c.getContext('2d'); var W,H,pts=[];
  function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;}
  resize(); window.addEventListener('resize',resize);
  for(var i=0;i<55;i++) pts.push({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,r:Math.random()*1.5+.5,o:Math.random()*.3+.08});
  function draw() {
    ctx.clearRect(0,0,W,H);
    pts.forEach(function(p){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(85,133,255,'+p.o+')';ctx.fill();});
    for(var i=0;i<pts.length;i++) for(var j=i+1;j<pts.length;j++){var dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<130){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle='rgba(85,133,255,'+(0.06*(1-d/130))+')';ctx.lineWidth=.8;ctx.stroke();}}
    requestAnimationFrame(draw);
  }
  draw();
}

function goV(id,el) {
  if(id==='admin'&&!isAdmin(CU&&CU.email)){toast('Access denied','error');return;}
  document.querySelectorAll('.view').forEach(function(v){v.classList.remove('active');});
  var v=document.getElementById('v-'+id); if(v) v.classList.add('active');
  document.querySelectorAll('.ni').forEach(function(n){n.classList.remove('active');});
  if(el) el.classList.add('active');
  if(id!=='dashboard') logAct(id);
  if(id==='admin') refreshAdmin();
  closeSB();
}
function updateUI() {
  var g=function(id){return document.getElementById(id);};
  if(g('st-s'))g('st-s').textContent=US.sessions||0;
  if(g('st-c'))g('st-c').textContent=US.cards||0;
  if(g('st-r'))g('st-r').textContent='\uD83D\uDD25 '+(US.streak||1);
  if(g('sb-streak'))g('sb-streak').textContent=US.streak||1;
  var avg=(US.scores&&US.scores.length)?Math.round(US.scores.reduce(function(a,b){return a+b;},0)/US.scores.length)+'%':'\u2014';
  if(g('st-a'))g('st-a').textContent=avg;
}
function saveSt(){if(CU)LOCAL.saveStat(CU.id,US);updateUI();}
function logAct(id){
  var lb={tutor:'AI Tutor session',quiz:'Quiz Generator',flashcards:'Flashcard review',essay:'Essay Helper',homework:'Homework Solver',papers:'Past Papers',youtube:'YouTube Summariser',notes:'Smart Notes',voice:'Voice Notes'};
  var cl={tutor:'var(--ac)',quiz:'var(--pur)',flashcards:'var(--gold)',essay:'var(--grn)',homework:'var(--warn)',papers:'var(--red)',youtube:'var(--cyan)',notes:'var(--pink)',voice:'var(--grn)'};
  recentActs.unshift({l:lb[id]||id,c:cl[id]||'var(--ac)',t:'Just now'});
  if(recentActs.length>5)recentActs.pop();
  var el=document.getElementById('rec-list');
  if(el)el.innerHTML=recentActs.map(function(a){return '<div class="ri"><div class="rid" style="background:'+a.c+'"></div><div class="rit">'+a.l+'</div><div class="ritm">'+a.t+'</div></div>';}).join('');
  saveProgress();
}

// ── PUTER AI (free, no key needed) ──
function loadPuter(){
  return new Promise(function(res,rej){
    if(typeof puter!=='undefined'&&puter.ai){res();return;}
    var s=document.createElement('script');s.src='https://js.puter.com/v2/';
    s.onload=function(){var t=0;var iv=setInterval(function(){t++;if(typeof puter!=='undefined'&&puter.ai){clearInterval(iv);res();}if(t>150){clearInterval(iv);rej(new Error('timeout'));}},100);};
    s.onerror=function(){rej(new Error('Cannot load AI'));};
    document.head.appendChild(s);
  });
}
function aiCall(sys,msg,hist){
  hist=hist||[];
  return loadPuter().then(function(){
    var p=sys+'\n\n';
    hist.slice(-6).forEach(function(m){p+=(m.role==='user'?'Student: ':'Tutor: ')+m.content+'\n\n';});
    p+='Student: '+msg+'\n\nTutor:';
    return puter.ai.chat(p,{model:'gpt-4o-mini'});
  }).then(function(r){
    if(typeof r==='string')return r.trim();
    if(r&&r.message&&r.message.content){var c=r.message.content;return(Array.isArray(c)?c.map(function(x){return x.text||'';}).join(''):String(c)).trim();}
    if(r&&r.text)return r.text.trim();
    return String(r).trim();
  });
}
var LVM={secondary:'KS3/Year 7-9',gcse:'GCSE',alevel:'A-Level',university:'University'};
function getSys(mode){
  var lv=(CU&&CP&&CP.level)?(LVM[CP.level]||CP.level):'GCSE';
  var bd=(CP&&CP.board&&CP.board!=='Other')?' ('+CP.board+' mark scheme)':'';
  var langRule=currentLang!=='en'?'\nCRITICAL: Respond in the SAME language the student writes in.':'';
 var base='You are UltraVision AI, a smart helpful study assistant for '+lv+' students'+bd+'.'+langRule+'\nBe natural and conversational. Keep responses concise and clear. No forced analogies. No follow-up questions unless it genuinely helps. Bold **key terms**. Get straight to the point. Never write more than 150 words unless the student specifically asks for a full detailed breakdown. If a question could need a long answer, give a short version first and offer to expand. If a student expresses distress or mentions self-harm, respond with empathy, take it seriously, and signpost UK crisis support (Samaritans: 116 123) before anything else. If a student asks about exam topics or papers, ask which exam board first before answering. You have memory of this conversation — refer back to what the student said earlier when relevant. Do not help with anything harmful, illegal, or unrelated to education — such as how to make weapons, drugs, hacking, or anything dangerous. Politely decline and redirect to studies.';
  var modes={
    tutor:base,
    explain:base+'\nExplain clearly in simple steps. Use an example if helpful.',
    simplify:base+'\nSimplify for a younger student. No jargon. Short and clear.',
    exam:base+'\nFocus on exam technique: mark scheme, common mistakes, top tips.',
    check:base+'\nAct as an examiner. Give honest feedback: strengths, errors, grade, improvements.',
    concise:base+'\nBe extremely concise. Key facts only. Bullets if needed.',
    translate:base+'\nRespond in the student\'s own language.'
  };
  return modes[mode]||modes.tutor;
}
/* UltraVision AI — Premium interactions v3 */
(function(){
  var rm=window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* SCROLL FADE-UP */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target);}
      });
    },{threshold:.1,rootMargin:'0px 0px -48px 0px'});
    document.querySelectorAll('.fade-up').forEach(function(el){io.observe(el);});
  } else {
    document.querySelectorAll('.fade-up').forEach(function(el){el.classList.add('in-view');});
  }

  /* HERO H1 CHAR REVEAL */
  var h1=document.getElementById('hero-h1');
  if(h1&&!rm){
    var html=h1.innerHTML;
    var out='';var delay=0;var inTag=false;
    for(var i=0;i<html.length;i++){
      var c=html[i];
      if(c==='<'){inTag=true;out+=c;continue;}
      if(inTag){out+=c;if(c==='>'){inTag=false;}continue;}
      if(c===' '){out+='<span class="char-sp"> </span>';delay+=20;continue;}
      out+='<span class="char-s" style="animation-delay:'+(delay)+'ms">'+c+'</span>';
      delay+=38;
    }
    h1.innerHTML=out;
  }

  /* PHONE TYPEWRITER LOOP */
  var phoneEl=document.getElementById('phone-typed-text');
  if(phoneEl&&!rm){
    var msgs=[
      'Using the quadratic formula...\nx = (−5 ± √(25+24)) / 6\nx = (−5 ± 7) / 6\n\n✓ x = ⅓ or x = −2',
      'Photosynthesis: 6CO₂ + 6H₂O\n→ C₆H₁₂O₆ + 6O₂\n\nLight-dependent: ATP produced ⚡\nCalvin cycle: CO₂ fixed ✓',
      'Essay plan for Macbeth:\n1. Power & ambition\n2. Guilt & consequence\n3. Supernatural influence\n\n→ Grade A structure ✓'
    ];
    var mi=0;var ci=0;var typing=true;var cursor='<span class="iphone-cursor"></span>';
    function nextTick(){
      var m=msgs[mi];
      if(typing){
        ci++;
        phoneEl.innerHTML=m.slice(0,ci).replace(/\n/g,'<br>')+cursor;
        if(ci>=m.length){typing=false;setTimeout(nextTick,2200);return;}
        setTimeout(nextTick,28);
      } else {
        ci=0;typing=true;mi=(mi+1)%msgs.length;
        phoneEl.innerHTML=cursor;
        setTimeout(nextTick,600);
      }
    }
    setTimeout(nextTick,1200);
  }

  /* CURSOR AMBIENT GLOW */
  var gc=document.getElementById('glow-cursor');
  var land=document.getElementById('pg-land');
  if(gc&&!rm){
    var tx=0,ty=0,cx=0,cy=0;
    document.addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY;},{passive:true});
    (function lerp(){
      cx+=(tx-cx)*.1;cy+=(ty-cy)*.1;
      if(land&&!land.classList.contains('hidden')){
        gc.style.background='radial-gradient(650px circle at '+Math.round(cx)+'px '+Math.round(cy)+'px,rgba(79,142,247,.06),rgba(157,92,255,.03) 40%,transparent 65%)';
      }
      requestAnimationFrame(lerp);
    })();
  }

  /* STATS COUNTER ANIMATION */
  var counted=false;
  var sbar=document.querySelector('.sbar');
  if(sbar&&'IntersectionObserver' in window){
    var sio=new IntersectionObserver(function(entries){
      if(entries[0].isIntersecting&&!counted){
        counted=true;
        countUp('sc-students',50000,'+',1800);
        countUp('sc-tools',9,'',1200);
        countUp('sc-countries',150,'+',1400);
      }
    },{threshold:.5});
    sio.observe(sbar);
  }
  function countUp(id,target,suffix,dur){
    var el=document.getElementById(id);
    if(!el)return;
    var t0=performance.now();
    (function tick(now){
      var p=Math.min((now-t0)/dur,1);
      var ease=p*p*(3-2*p);
      var v=Math.round(ease*target);
      el.textContent=(v>=1000?v.toLocaleString():v)+suffix;
      if(p<1)requestAnimationFrame(tick);
      else el.textContent=(target>=1000?target.toLocaleString():target)+suffix;
    })(t0);
  }

  /* MARQUEE PAUSE ON HOVER */
  var mt=document.querySelector('.marquee-track');
  if(mt){
    mt.addEventListener('mouseenter',function(){mt.style.animationPlayState='paused';});
    mt.addEventListener('mouseleave',function(){mt.style.animationPlayState='running';});
  }

  /* MAGNETIC BUTTONS */
  if(!rm){
    document.querySelectorAll('.hbm,.lbp').forEach(function(btn){
      btn.addEventListener('mousemove',function(e){
        var r=btn.getBoundingClientRect();
        var dx=e.clientX-r.left-r.width/2;
        var dy=e.clientY-r.top-r.height/2;
        btn.style.transform='translate('+dx*.18+'px,'+dy*.18+'px)';
      });
      btn.addEventListener('mouseleave',function(){
        btn.style.transform='';
      });
    });
  }

  /* PAGE FADE TRANSITIONS — patch showPg */
  if(!rm&&typeof showPg==='function'){
    var _orig=showPg;
    window.showPg=function(id){
      var cur=document.querySelector('#auth-wrap>div:not(.hidden)');
      if(cur){
        cur.style.opacity='0';cur.style.transition='opacity .15s ease';
        setTimeout(function(){
          cur.style.opacity='';cur.style.transition='';
          _orig(id);
          var nxt=document.getElementById('pg-'+id)||document.getElementById(id);
          if(nxt){nxt.style.opacity='0';nxt.style.transition='opacity .15s ease';setTimeout(function(){nxt.style.opacity='1';setTimeout(function(){nxt.style.opacity='';nxt.style.transition='';},160);},20);}
        },160);
      } else {
        _orig(id);
      }
    };
  }
})();
/* ═══ DASHBOARD INTERACTIONS v4 ═══ */
(function(){
var rm=window.matchMedia('(prefers-reduced-motion:reduce)').matches;

/* ─── TOAST UPGRADE (right-side, glass, progress bar) ─── */
var _origToast=window.toast;
window.toast=function(msg,type,dur){
  dur=dur||3200;
  var el=document.getElementById('toast');
  var bar=document.getElementById('toast-bar');
  if(!el)return _origToast&&_origToast(msg,type,dur);
  el.textContent=msg;
  if(bar){el.appendChild(bar);bar.style.width='100%';bar.style.transition='none';}
  el.className='show';
  if(type==='error'){el.style.borderColor='rgba(255,68,85,.45)';}
  else if(type==='success'){el.style.borderColor='rgba(0,200,150,.38)';}
  else{el.style.borderColor='rgba(79,142,247,.28)';}
  clearTimeout(el._t);
  if(bar){requestAnimationFrame(function(){requestAnimationFrame(function(){bar.style.transition='width '+dur+'ms linear';bar.style.width='0%';});});}
  el._t=setTimeout(function(){el.classList.remove('show');el.style.borderColor='';},dur);
};

/* ─── SPARKLINES ─── */
function drawSparkline(svgId,data,color){
  var svg=document.getElementById(svgId);
  if(!svg||!data||data.length<2)return;
  var w=80,h=28,pad=2;
  var mn=Math.min.apply(null,data),mx=Math.max.apply(null,data);
  if(mn===mx){mn=0;mx=mn+1;}
  var pts=data.map(function(v,i){
    var x=pad+(i/(data.length-1))*(w-pad*2);
    var y=h-pad-(v-mn)/(mx-mn)*(h-pad*2);
    return x.toFixed(1)+','+y.toFixed(1);
  });
  var fill=pts.map(function(p,i){return i===0?'M'+p:'L'+p;}).join(' ')+' L'+(w-pad)+','+h+' L'+pad+','+h+' Z';
  var line=pts.map(function(p,i){return i===0?'M'+p:'L'+p;}).join(' ');
  svg.innerHTML='<defs><linearGradient id="sg-'+svgId+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="'+color+'" stop-opacity=".25"/><stop offset="100%" stop-color="'+color+'" stop-opacity="0"/></linearGradient></defs>'
    +'<path d="'+fill+'" fill="url(#sg-'+svgId+')" stroke="none"/>'
    +'<path d="'+line+'" fill="none" stroke="'+color+'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
}
setTimeout(function(){
  drawSparkline('spark-s',[0,1,0,2,1,3,2],'#4F8EF7');
  drawSparkline('spark-a',[0,0,0,0,0,0,0],'#00C896');
  drawSparkline('spark-c',[0,0,0,0,0,0,0],'#F0B429');
  drawSparkline('spark-r',[1,1,1,1,1,1,1],'#FFA020');
},400);

/* ─── DASHBOARD TOOL CARD STAGGER ─── */
function animateToolCards(){
  var cards=document.querySelectorAll('#v-dashboard .tc-anim');
  cards.forEach(function(c,i){
    c.style.opacity='0';c.style.transform='translateY(16px)';
    setTimeout(function(){
      c.style.transition='opacity .35s cubic-bezier(.22,1,.36,1),transform .35s cubic-bezier(.22,1,.36,1)';
      c.style.opacity='1';c.style.transform='';
    },(i*45)+80);
  });
}
setTimeout(animateToolCards,300);

/* ─── MOBILE BOTTOM NAV ─── */
window.updateBNav=function(key){
  document.querySelectorAll('.bni').forEach(function(b){b.classList.remove('active');});
  var el=document.getElementById('bni-'+key);
  if(el)el.classList.add('active');
};
var _origGoV=window.goV;
if(typeof _origGoV==='function'){
  window.goV=function(view,niEl){
    _origGoV(view,niEl);
    var keyMap={dashboard:'d',tutor:'t',quiz:'q',flashcards:'f',essay:'e',homework:'h',papers:'p',youtube:'yt',notes:'n',voice:'v',admin:'a'};
    var k=keyMap[view];
    if(k)updateBNav(k);
  };
}

/* ─── STREAK RING UPDATE ─── */
function updateStreakRing(days){
  days=parseInt(days)||1;
  var max=30;
  var pct=Math.min(days/max,1);
  var circ=145;
  var offset=circ-(pct*circ);
  var fill=document.getElementById('wb-ring-fill');
  if(fill){fill.style.strokeDashoffset=offset;}
  var lbl=document.getElementById('wb-streak-lbl');
  if(lbl){lbl.textContent=days;}
  /* sidebar ring */
  var sbr=document.getElementById('sb-streak-ring');
  if(sbr){var c2=107;sbr.style.strokeDashoffset=c2-(pct*c2);}
}
setTimeout(function(){
  var sn=document.getElementById('sb-streak');
  if(sn)updateStreakRing(sn.textContent);
},600);

/* ─── COPY BUTTON INJECTION into AI chat ─── */
var chatMsgs=document.getElementById('chat-msgs');
if(chatMsgs){
  var _obs=new MutationObserver(function(muts){
    muts.forEach(function(m){
      m.addedNodes.forEach(function(n){
        if(n.nodeType!==1)return;
        var bub=n.querySelector('.bub.ai');
        if(!bub||n.querySelector('.msg-copy-btn'))return;
        var btn=document.createElement('button');
        btn.className='msg-copy-btn';btn.title='Copy';btn.setAttribute('aria-label','Copy response');
        btn.innerHTML='<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
        btn.onclick=function(){
          navigator.clipboard&&navigator.clipboard.writeText(bub.innerText).then(function(){
            toast('Copied!','success',1600);
          });
        };
        n.style.alignItems='flex-start';
        n.appendChild(btn);
      });
    });
  });
  _obs.observe(chatMsgs,{childList:true});
}

/* ─── VOICE INPUT (Web Speech API) ─── */
window.startVoiceInput=function(){
  var SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SpeechRecognition){toast('Voice input not supported in this browser','error');return;}
  var btn=document.getElementById('voice-input-btn');
  var ta=document.getElementById('chat-ta');
  var recog=new SpeechRecognition();
  recog.lang='en-GB';recog.interimResults=true;recog.maxAlternatives=1;
  recog.onstart=function(){if(btn)btn.classList.add('rec');};
  recog.onresult=function(e){
    var t=Array.from(e.results).map(function(r){return r[0].transcript;}).join('');
    if(ta){ta.value=t;if(typeof grow==='function')grow(ta);}
  };
  recog.onerror=function(){if(btn)btn.classList.remove('rec');};
  recog.onend=function(){if(btn)btn.classList.remove('rec');};
  recog.start();
};

/* ─── FLASHCARD KEYBOARD SHORTCUTS ─── */
document.addEventListener('keydown',function(e){
  var fc=document.getElementById('v-flashcards');
  if(!fc||!fc.classList.contains('active'))return;
  if(document.activeElement&&['INPUT','TEXTAREA','SELECT'].indexOf(document.activeElement.tagName)>-1)return;
  if(e.code==='Space'){e.preventDefault();if(typeof flipCard==='function')flipCard();}
  else if(e.code==='ArrowRight'){if(typeof nextCard==='function')nextCard();}
  else if(e.code==='ArrowLeft'){if(typeof prevCard==='function')prevCard();}
  else if(e.key.toLowerCase()==='k'){if(typeof rateCard==='function')rateCard('know');}
  else if(e.key.toLowerCase()==='r'){if(typeof rateCard==='function')rateCard('unsure');}
});

/* ─── FLASHCARD SWIPE GESTURES ─── */
var fcZone=document.getElementById('fc-zone');
if(fcZone){
  var _sx=null,_sy=null;
  fcZone.addEventListener('touchstart',function(e){
    _sx=e.touches[0].clientX;_sy=e.touches[0].clientY;
  },{passive:true});
  fcZone.addEventListener('touchend',function(e){
    if(_sx===null)return;
    var dx=e.changedTouches[0].clientX-_sx;
    var dy=e.changedTouches[0].clientY-_sy;
    if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>55){
      if(dx>0){if(typeof rateCard==='function')rateCard('know');}
      else{if(typeof rateCard==='function')rateCard('unsure');}
    } else if(Math.abs(dy)<40&&Math.abs(dx)<20){
      if(typeof flipCard==='function')flipCard();
    }
    _sx=null;
  },{passive:true});
}

/* ─── FLASHCARD TTS ─── */
window.fcSpeak=function(){
  var card=document.getElementById('fc-card');
  var isFlipped=card&&card.classList.contains('flipped');
  var txt=isFlipped?document.getElementById('fc-back').textContent:document.getElementById('fc-front').textContent;
  if(!txt||txt==='—')return;
  window.speechSynthesis.cancel();
  var u=new SpeechSynthesisUtterance(txt);
  u.lang='en-GB';u.rate=0.92;
  window.speechSynthesis.speak(u);
  var btn=document.getElementById('fc-tts-btn');
  if(btn){btn.classList.add('active');u.onend=function(){btn.classList.remove('active');};}
};

/* ─── FLASHCARD STREAK & DUAL PROGRESS ─── */
var _fcStreak=0;
var _origRateCard=window.rateCard;
if(typeof _origRateCard==='function'){
  window.rateCard=function(r){
    if(r==='know'){_fcStreak++;} else{_fcStreak=0;}
    var sn=document.getElementById('fc-streak-num');
    if(sn)sn.textContent=_fcStreak;
    _origRateCard(r);
    /* update dual progress bar */
    setTimeout(function(){
      var stat=document.getElementById('fc-stat');
      if(!stat)return;
      var txt=stat.textContent||'';
      var know=parseInt((txt.match(/✓\s*(\d+)/)||[0,0])[1])||0;
      var unsure=parseInt((txt.match(/🤔\s*(\d+)/)||[0,0])[1])||0;
      var total=know+unsure;
      if(!total)return;
      var pk=document.getElementById('fc-pf-know');
      var pr=document.getElementById('fc-pf-review');
      if(pk)pk.style.width=(know/total*100)+'%';
      if(pr)pr.style.width=(unsure/total*100)+'%';
    },50);
  };
}

/* ─── FLASHCARD COMPLETION DETECTION ─── */
var _origNextCard=window.nextCard;
if(typeof _origNextCard==='function'){
  window.nextCard=function(){
    _origNextCard();
    var ctr=document.getElementById('fc-ctr');
    if(!ctr)return;
    var txt=ctr.textContent.trim();
    var parts=txt.split('/');
    if(parts.length===2){
      var cur=parseInt(parts[0]);var total=parseInt(parts[1]);
      if(cur>=total&&total>0){showFcCompletion();}
    }
  };
}
function showFcCompletion(){
  var stat=document.getElementById('fc-stat');
  var know=0;var total=1;
  if(stat){var m=stat.textContent.match(/(\d+)\s*\/\s*(\d+)/);if(m){know=parseInt(m[1]);total=parseInt(m[2]);}}
  var pct=total>0?Math.round((know/total)*100):0;
  var sc=document.getElementById('fc-comp-score');if(sc)sc.textContent=pct+'%';
  var su=document.getElementById('fc-comp-summary');if(su)su.textContent='You mastered '+know+' / '+total+' cards';
  var comp=document.getElementById('fc-completion');
  if(comp){comp.classList.add('show');setTimeout(function(){var b=comp.querySelector('.confetti-burst');if(b){b.style.animation='none';void b.offsetWidth;b.style.animation='';}},50);}
}

/* ─── QUIZ PROGRESS + STREAK + RESULTS ─── */
var _qStreak=0,_qWrong=[],_qTotal=0,_qCorrect=0;
var _origGenQuiz=window.genQuiz;
if(typeof _origGenQuiz==='function'){
  window.genQuiz=function(){
    _qStreak=0;_qWrong=[];_qTotal=0;_qCorrect=0;
    updateQStreak(0);
    var prog=document.getElementById('quiz-prog');
    var res=document.getElementById('quiz-results');
    if(prog){prog.style.display='none';}
    if(res){res.style.display='none';}
    _origGenQuiz();
  };
}
var _origResetQuiz=window.resetQuiz;
if(typeof _origResetQuiz==='function'){
  window.resetQuiz=function(){
    _qStreak=0;_qWrong=[];_qTotal=0;_qCorrect=0;
    var prog=document.getElementById('quiz-prog');var res=document.getElementById('quiz-results');
    if(prog)prog.style.display='none';if(res)res.style.display='none';
    _origResetQuiz();
  };
}
function updateQStreak(n){
  var b=document.getElementById('q-streak-badge');
  var t=document.getElementById('q-streak-txt');
  if(!b)return;
  if(n>=3){b.classList.remove('hidden-v');if(t)t.textContent=n+' in a row!';}
  else{b.classList.add('hidden-v');}
}
function updateQProgress(cur,total){
  var prog=document.getElementById('quiz-prog');
  var fill=document.getElementById('q-prog-fill');
  var txt=document.getElementById('q-prog-txt');
  if(prog)prog.style.display='block';
  if(fill)fill.style.width=((cur/total)*100)+'%';
  if(txt)txt.textContent='Question '+cur+' of '+total;
}
/* Intercept quiz option clicks for feedback + tracking */
document.addEventListener('click',function(e){
  var opt=e.target.closest('.qopt');
  if(!opt)return;
  var isOk=opt.classList.contains('ok');
  var isNo=opt.classList.contains('no');
  if(isOk){_qStreak++;_qCorrect++;updateQStreak(_qStreak);}
  else if(isNo){_qStreak=0;updateQStreak(0);_qWrong.push(opt);}
  /* auto-show results when last question answered */
  setTimeout(function(){
    var area=document.getElementById('quiz-area');
    if(!area)return;
    var cards=area.querySelectorAll('.qqc');
    var answered=area.querySelectorAll('.qopt.ok,.qopt.no');
    _qTotal=cards.length;
    if(answered.length>0&&cards.length>0){
      var qs=area.querySelectorAll('.qqc');
      var done=0;
      qs.forEach(function(q){if(q.querySelector('.qopt.ok')||q.querySelector('.qopt.no'))done++;});
      if(done>=qs.length&&qs.length>0){setTimeout(showQuizResults,800);}
    }
  },150);
});
function showQuizResults(){
  var res=document.getElementById('quiz-results');
  if(!res||res.style.display==='flex')return;
  var pct=_qTotal>0?Math.round((_qCorrect/_qTotal)*100):0;
  var ring=document.getElementById('qr-ring');
  var pctEl=document.getElementById('qr-pct');
  var grade=document.getElementById('qr-grade');
  var msg=document.getElementById('qr-msg');
  if(pctEl)pctEl.textContent='0%';
  res.style.display='flex';
  if(ring){setTimeout(function(){ring.style.strokeDashoffset=289-(pct/100*289);},50);}
  if(pctEl){var cnt=0;var iv=setInterval(function(){cnt+=2;pctEl.textContent=Math.min(cnt,pct)+'%';if(cnt>=pct)clearInterval(iv);},20);}
  var g='D',gc='d',gm='Keep practising — you can improve!';
  if(pct>=90){g='A*';gc='a-star';gm='Outstanding! Exam-ready performance.';}
  else if(pct>=80){g='A';gc='a';gm='Excellent work! Nearly there.';}
  else if(pct>=70){g='B';gc='b';gm='Good effort! Review the missed questions.';}
  else if(pct>=60){g='C';gc='c';gm='Decent start — focus on the gaps.';}
  if(grade){grade.textContent='Grade '+g;grade.className='qr-grade '+gc;}
  if(msg)msg.textContent=gm;
  var prog=document.getElementById('quiz-prog');if(prog)prog.style.display='none';
}
window.retryWrong=function(){
  var res=document.getElementById('quiz-results');if(res)res.style.display='none';
  _qStreak=0;_qCorrect=0;
  toast('Retry wrong answers — coming with quiz v2!','info');
};

/* ─── ESSAY WORD COUNT + READING TIME ─── */
window.updateEssayMeta=function(ta){
  var words=ta.value.trim().split(/\s+/).filter(Boolean).length;
  var wc=document.getElementById('es-wc');var rt=document.getElementById('es-rt');
  if(wc)wc.textContent=words.toLocaleString()+' words';
  if(rt)rt.textContent='~'+Math.max(1,Math.ceil(words/200))+' min read';
};

/* ─── ESSAY GRADE BADGE ─── */
var _origEssayDo=window.essayDo;
if(typeof _origEssayDo==='function'){
  window.essayDo=function(action){
    _origEssayDo(action);
    if(action==='grade'){
      setTimeout(function(){
        var res=document.getElementById('es-res');
        if(!res)return;
        var txt=(res.textContent||'').toLowerCase();
        var badge=document.getElementById('es-grade-badge');
        if(!badge)return;
        var g='B',gc='b';
        if(txt.indexOf('a*')>-1||txt.indexOf('a star')>-1){g='A*';gc='astar';}
        else if(txt.match(/\bgrade a\b|\bpredicted a\b/)){g='A';gc='a';}
        else if(txt.match(/\bgrade b\b|\bpredicted b\b/)){g='B';gc='b';}
        badge.textContent='Predicted: '+g;
        badge.className='essay-grade-badge '+gc;
        setTimeout(function(){badge.classList.add('show');},50);
      },1200);
    }
  };
}

/* ─── HOMEWORK COPY ANSWER ─── */
window.copyHWAnswer=function(){
  var el=document.getElementById('hw-answer-text');
  if(!el)return;
  navigator.clipboard&&navigator.clipboard.writeText(el.textContent).then(function(){toast('Answer copied!','success',1600);});
};

/* ─── HOMEWORK STEP CARDS RENDERER ─── */
var _origSolveHW=window.solveHW;
/* We hook the AI output rendering to wrap steps in hw-step-card */
var _hwObs=new MutationObserver(function(muts){
  muts.forEach(function(m){
    m.addedNodes.forEach(function(n){
      if(n.nodeType!==1)return;
      /* transform .hwstep divs into new step card design */
      var steps=n.querySelectorAll&&n.querySelectorAll('.hwstep');
      if(!steps||!steps.length)return;
      steps.forEach(function(step,i){
        step.className='hw-step-card';
        var numEl=step.querySelector('.sn2');
        var textEl=step.querySelector('.st');
        if(numEl)numEl.className='hw-step-num';
        if(textEl){
          textEl.className='hw-step-text';
          /* add Why? toggle */
          var why=document.createElement('button');
          why.className='hw-why-btn';
          why.innerHTML='<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg> Why?';
          var content=document.createElement('div');
          content.className='hw-why-content';
          content.textContent='This step applies the standard method for this type of problem. Understanding why helps you apply it independently in exams.';
          why.onclick=function(){why.classList.toggle('open');content.classList.toggle('open');};
          var body=step.querySelector('.hw-step-body')||textEl.parentElement;
          if(body){body.appendChild(why);body.appendChild(content);}
        }
      });
    });
  });
});
var hwRes=document.getElementById('hw-res');
if(hwRes)_hwObs.observe(hwRes,{childList:true,subtree:true});

/* ─── PAST PAPERS FILTER CHIPS ─── */
var _ppLevelFilter='all',_ppSubjFilter='all';
window.ppFilter=function(btn,type,val){
  var group=btn.parentElement;
  group.querySelectorAll('.pp-chip').forEach(function(c){c.classList.remove('active');});
  btn.classList.add('active');
  if(type==='level')_ppLevelFilter=val;
  else _ppSubjFilter=val;
  document.querySelectorAll('#pp-list .pp-v2').forEach(function(card){
    var lvl=card.dataset.level;var subj=card.dataset.subj;
    var showL=_ppLevelFilter==='all'||(lvl===_ppLevelFilter);
    var showS=_ppSubjFilter==='all'||(subj===_ppSubjFilter);
    card.style.display=(showL&&showS)?'':'none';
  });
};

/* ─── VOICE NOTES WAVEFORM ANIMATION ─── */
var _vWaveAnim=null;
var _origToggleRec=window.toggleRec;
if(typeof _origToggleRec==='function'){
  window.toggleRec=function(){
    _origToggleRec();
    var ring=document.getElementById('v-ring');
    var timer=document.getElementById('v-timer');
    var isRec=ring&&ring.classList.contains('rec');
    if(isRec){
      /* animate waveform */
      var bars=document.querySelectorAll('.v-wbar');
      var _t=0;
      _vWaveAnim=setInterval(function(){
        bars.forEach(function(b){b.style.height=(6+Math.random()*28).toFixed(0)+'px';});
        _t++;
      },120);
      /* timer */
      var secs=0;
      if(timer){timer.style.display='block';}
      _vTimerIv=setInterval(function(){
        secs++;
        var m=String(Math.floor(secs/60)).padStart(2,'0');
        var s=String(secs%60).padStart(2,'0');
        if(timer)timer.textContent=m+':'+s;
      },1000);
    } else {
      clearInterval(_vWaveAnim);clearInterval(_vTimerIv);
      if(timer){timer.style.display='none';timer.textContent='00:00';}
      var bars2=document.querySelectorAll('.v-wbar');
      bars2.forEach(function(b,i){b.style.height=[6,14,9,22,12,30,18,25,10,20,15,28,8,18,12,24,10,16,7,12][i]+'px';});
    }
  };
}
var _vTimerIv=null;

/* ─── FOLLOW-UP CHIPS after AI response ─── */
var _followSets={
  tutor:['Can you explain that differently?','Give me a practice question','What are the key exam points?'],
  explain:['Can you break it down further?','Show me an example','Why is this important?'],
  simplify:['Explain it like I\'m 10','What\'s the one thing I must remember?','Quiz me on this'],
  exam:['What are the mark scheme key words?','Show me a model answer','What mistakes do students make?'],
  check:['What did I get wrong?','How can I improve my answer?','Show me the correct method'],
  concise:['Bullet point version','Key facts only','One sentence summary'],
  translate:['Translate to French','Translate to Spanish','Translate to Arabic']
};
var _chatMode='tutor';
var _origSetMode=window.setMode;
if(typeof _origSetMode==='function'){
  window.setMode=function(el,mode){_chatMode=mode;_origSetMode(el,mode);};
}
var chatMsgsEl=document.getElementById('chat-msgs');
if(chatMsgsEl){
  var _fcObs=new MutationObserver(function(muts){
    muts.forEach(function(m){
      m.addedNodes.forEach(function(n){
        if(n.nodeType!==1)return;
        var bub=n.querySelector&&n.querySelector('.bub.ai');
        if(!bub||n.querySelector('.follow-chips'))return;
        var chips=document.createElement('div');
        chips.className='follow-chips';
        var set=_followSets[_chatMode]||_followSets.tutor;
        set.forEach(function(txt){
          var c=document.createElement('button');
          c.className='follow-chip';c.textContent=txt;
          c.onclick=function(){if(typeof qs==='function')qs(txt);};
          chips.appendChild(c);
        });
        n.appendChild(chips);
      });
    });
  });
  _fcObs.observe(chatMsgsEl,{childList:true});
}

/* ─── STAGGER TOOL CARDS when view activated ─── */
document.addEventListener('click',function(e){
  var ni=e.target.closest('.ni');
  if(!ni||!ni.id)return;
  if(ni.id==='ni-d'){setTimeout(animateToolCards,120);}
});

})();

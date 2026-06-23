// ── ADMIN (reads all Supabase users via profiles table if set up, otherwise just shows message) ──
var allAdmUsers=[];
function refreshAdmin(){
  if(!isAdmin(CU&&CU.email))return;
  var tb=document.getElementById('adm-body');
  if(tb)tb.innerHTML='<tr><td colspan="11" style="text-align:center;padding:24px;color:var(--t2)">Loading users from Supabase...</td></tr>';
  getSB().then(function(sb){
    return fetch(SUPABASE_URL+'/auth/v1/admin/users?page=1&per_page=500',{
      headers:{'apikey':SUPABASE_ANON_KEY,'Authorization':'Bearer '+SUPABASE_ANON_KEY,'Content-Type':'application/json'}
    });
  }).then(function(r){return r.json();}).then(function(data){
    var users=data.users||[];
    allAdmUsers=users;
    updateAdmStats(users);
    renderAdmUsers(users);
  }).catch(function(){
    fallbackProfiles();
  });
}
function fallbackProfiles(){
  var profiles=JSON.parse(localStorage.getItem('uv_profiles')||'{}');
  var users=Object.values(profiles).map(function(p){
    return{id:p.id||p.email,email:p.email||'',user_metadata:{first_name:p.firstName,full_name:p.name,level:p.level,board:p.board,country:p.country,school:p.school},email_confirmed_at:p.verified?new Date().toISOString():null,created_at:p.joinedAt||new Date().toISOString(),last_sign_in_at:p.lastActive||new Date().toISOString(),banned_until:null};
  });
  allAdmUsers=users;
  updateAdmStats(users);
  renderAdmUsers(users);
}
function updateAdmStats(users){
  var today=new Date().toDateString();
  var confirmed=users.filter(function(u){return u.email_confirmed_at;}).length;
  var banned=users.filter(function(u){return u.banned_until&&new Date(u.banned_until)>new Date();}).length;
  var td=users.filter(function(u){return new Date(u.created_at).toDateString()===today;}).length;
  var g=function(id){return document.getElementById(id);};
  if(g('adm-tot'))g('adm-tot').textContent=users.length;
  if(g('adm-td'))g('adm-td').textContent=td;
  if(g('adm-ac'))g('adm-ac').textContent=confirmed;
  if(g('adm-bn'))g('adm-bn').textContent=banned;
  var cnt=document.getElementById('adm-count');
  if(cnt)cnt.textContent='('+users.length+' total)';
}
function renderAdmUsers(users){
  var tb=document.getElementById('adm-body');if(!tb)return;
  var q=((document.getElementById('adm-s')||{}).value||'').toLowerCase();
  var flt=((document.getElementById('adm-filter')||{}).value)||'all';
  var filtered=users.filter(function(u){
    var meta=u.user_metadata||{};
    var nm=(meta.full_name||meta.first_name||'').toLowerCase();
    var em=(u.email||'').toLowerCase();
    var ok=!q||nm.includes(q)||em.includes(q);
    var banned=u.banned_until&&new Date(u.banned_until)>new Date();
    var conf=!!u.email_confirmed_at;
    var fok=flt==='all'||(flt==='confirmed'&&conf)||(flt==='unconfirmed'&&!conf)||(flt==='banned'&&banned);
    return ok&&fok;
  });
  if(!filtered.length){tb.innerHTML='<tr><td colspan="11" style="text-align:center;padding:30px;color:var(--t3)">No users found.</td></tr>';return;}
  var lm={secondary:'Secondary',gcse:'GCSE',alevel:'A-Level',university:'University'};
  tb.innerHTML=filtered.map(function(u,i){
    var meta=u.user_metadata||{};
    var nm=esc(meta.full_name||meta.first_name||u.email.split('@')[0]);
    var em=esc(u.email||'');
    var uid=u.id||'';
    var banned=u.banned_until&&new Date(u.banned_until)>new Date();
    var conf=!!u.email_confirmed_at;
    var adm=isAdmin(u.email);
    var vb=conf?'<span style="color:var(--grn);font-weight:700;font-size:11px">Yes</span>':'<span style="color:var(--warn);font-size:11px">No</span>';
    var sb=banned?'<span class="abd abb">Banned</span>':adm?'<span class="abd" style="background:rgba(245,200,66,.1);color:var(--gold);border:1px solid rgba(245,200,66,.2)">Admin</span>':'<span class="abd aba">Active</span>';
    var ab=adm?'<span style="color:var(--gold);font-size:10px">Admin</span>':
      banned?'<button class="unbanbtn" data-uid="'+uid+'" data-em="'+(u.email||'')+'" onclick="event.stopPropagation();unbanUser(this.dataset.uid,this.dataset.em)">Unban</button>':
      '<button class="banbtn" data-uid="'+uid+'" data-em="'+(u.email||'')+'" onclick="event.stopPropagation();banUser(this.dataset.uid,this.dataset.em)">Ban</button>';
    ab+=' <button class="delbtn" data-uid="'+uid+'" onclick="event.stopPropagation();viewUser(this.dataset.uid)">View</button>';
    return '<tr data-uid="'+uid+'" onclick="viewUser(this.dataset.uid)" style="cursor:pointer" class="'+(banned?'bnr':'')+'"><td style="color:var(--t3)">'+(i+1)+'</td><td style="font-weight:700">'+nm+'</td><td style="color:var(--t2);font-size:11px">'+em+'</td><td>'+(lm[meta.level]||meta.level||'-')+'</td><td>'+(meta.board||'-')+'</td><td style="color:var(--t3);font-size:11px">'+(meta.country||'-')+'</td><td style="color:var(--t3);font-size:11px">'+(u.created_at?new Date(u.created_at).toLocaleDateString('en-GB'):'-')+'</td><td style="color:var(--t3);font-size:11px">'+(u.last_sign_in_at?new Date(u.last_sign_in_at).toLocaleDateString('en-GB'):'-')+'</td><td onclick="event.stopPropagation()">'+vb+'</td><td onclick="event.stopPropagation()">'+sb+'</td><td onclick="event.stopPropagation()">'+ab+'</td></tr>';
  }).join('');
}
function filterUsers(q){renderAdmUsers(allAdmUsers);}
function banUser(uid,email){
  if(!isAdmin(CU&&CU.email)||isAdmin(email))return;
  if(!confirm('Ban '+email+'?'))return;
  fetch(SUPABASE_URL+'/auth/v1/admin/users/'+uid,{method:'PUT',headers:{'apikey':SUPABASE_ANON_KEY,'Authorization':'Bearer '+SUPABASE_ANON_KEY,'Content-Type':'application/json'},body:JSON.stringify({ban_duration:'87600h'})})
  .then(function(){toast(email+' banned','success');refreshAdmin();})
  .catch(function(){toast('Ban needs service_role key - use Supabase Dashboard','info');});
}
function unbanUser(uid,email){
  if(!isAdmin(CU&&CU.email))return;
  fetch(SUPABASE_URL+'/auth/v1/admin/users/'+uid,{method:'PUT',headers:{'apikey':SUPABASE_ANON_KEY,'Authorization':'Bearer '+SUPABASE_ANON_KEY,'Content-Type':'application/json'},body:JSON.stringify({ban_duration:'none'})})
  .then(function(){toast(email+' unbanned','success');refreshAdmin();})
  .catch(function(){toast('Needs service_role key','info');});
}
function delUser(uid){
  if(!isAdmin(CU&&CU.email))return;
  if(!confirm('Permanently delete this user?\nThis cannot be undone.'))return;
  fetch(SUPABASE_URL+'/auth/v1/admin/users/'+uid,{method:'DELETE',headers:{'apikey':SUPABASE_ANON_KEY,'Authorization':'Bearer '+SUPABASE_ANON_KEY}})
  .then(function(){toast('User deleted','success');refreshAdmin();})
  .catch(function(){toast('Needs service_role key','info');});
}
function viewUser(uid){
  var u=allAdmUsers.find(function(x){return x.id===uid;});if(!u)return;
  var meta=u.user_metadata||{};
  var lm={secondary:'Secondary School',gcse:'GCSE',alevel:'A-Level',university:'University'};
  var g=function(id){return document.getElementById(id);};
  g('md-name').textContent=meta.full_name||meta.first_name||u.email.split('@')[0];
  g('md-email').textContent=u.email||'-';
  g('md-level').textContent=lm[meta.level]||meta.level||'-';
  g('md-board').textContent=meta.board||'-';
  g('md-country').textContent=meta.country||'Not provided';
  g('md-school').textContent=meta.school||'Not provided';
  g('md-joined').textContent=u.created_at?new Date(u.created_at).toLocaleString('en-GB'):'-';
  g('md-last').textContent=u.last_sign_in_at?new Date(u.last_sign_in_at).toLocaleString('en-GB'):'Never';
  g('md-verified').textContent=u.email_confirmed_at?'Verified':'Not verified';
  var banned=u.banned_until&&new Date(u.banned_until)>new Date();
  g('md-status').textContent=banned?'Banned':isAdmin(u.email)?'Admin':'Active';
  var ma=g('md-acts');
  if(isAdmin(u.email)){ma.innerHTML='<span style="color:var(--gold)">Admin account</span>';}
  else{
    var ub='<button class="abt" style="background:linear-gradient(135deg,var(--grn),#00B880)" data-uid="'+uid+'" data-em="'+(u.email||'')+'" onclick="unbanUser(this.dataset.uid,this.dataset.em);closeMol()">Unban</button>';
    var bb='<button class="tbtn danger" data-uid="'+uid+'" data-em="'+(u.email||'')+'" onclick="banUser(this.dataset.uid,this.dataset.em);closeMol()">Ban</button>';
    var db='<button class="tbtn danger" data-uid="'+uid+'" onclick="delUser(this.dataset.uid);closeMol()">Delete</button>';
    ma.innerHTML=(banned?ub:bb)+' '+db;
  }
  document.getElementById('user-mol').classList.add('show');
}
function exportCSV(){
  if(!isAdmin(CU&&CU.email))return;
  if(!allAdmUsers.length){toast('Click Refresh first','info');return;}
  var lm={secondary:'Secondary School',gcse:'GCSE',alevel:'A-Level',university:'University'};
  var rows=[['Name','Email','Level','Board','Country','School','Joined','Last Sign In','Verified','Status']];
  allAdmUsers.forEach(function(u){
    var meta=u.user_metadata||{};
    var banned=u.banned_until&&new Date(u.banned_until)>new Date();
    rows.push([meta.full_name||meta.first_name||'',u.email||'',lm[meta.level]||meta.level||'',meta.board||'',meta.country||'',meta.school||'',u.created_at?new Date(u.created_at).toLocaleDateString('en-GB'):'',u.last_sign_in_at?new Date(u.last_sign_in_at).toLocaleDateString('en-GB'):'',u.email_confirmed_at?'Yes':'No',banned?'Banned':isAdmin(u.email)?'Admin':'Active']);
  });
  var nl=String.fromCharCode(10);
  var csv=rows.map(function(r){return r.map(function(v){return'"'+String(v).replace(/"/g,'""')+'"';}).join(',');}).join(nl);
  var a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
  a.download='ultravision-users-'+new Date().toISOString().slice(0,10)+'.csv';
  a.click();
  toast('Exported '+allAdmUsers.length+' users','success');
}
function closeMol(){document.getElementById('user-mol').classList.remove('show');}
document.addEventListener('click',function(e){var m=document.getElementById('user-mol');if(m&&e.target===m)closeMol();});
function esc(s){return(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

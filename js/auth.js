function pwStr(v) {
  var b=document.getElementById('sw-b'),l=document.getElementById('sw-l'); if(!b)return;
  if(!v){b.style.width='0';l.textContent='';return;}
  var s=0; if(v.length>=8)s++; if(/[A-Z]/.test(v))s++; if(/[0-9]/.test(v))s++; if(/[^A-Za-z0-9]/.test(v))s++;
  var m=[['0','',''],['25%','#FF4F6B','Too short'],['50%','#FFB030','Weak'],['75%','#F5C842','Good'],['100%','#00E8A8','Strong']];
  b.style.width=m[s][0]; b.style.background=m[s][1]; l.textContent=m[s][2]; l.style.color=m[s][1];
}
function vEmail(e){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);}

// ── ONBOARDING STEPS ──
function selOpt(el, type, val) {
  el.parentElement.querySelectorAll('.obn').forEach(function(b){b.classList.remove('sel');});
  el.classList.add('sel');
  if (type==='level') { selLevel=val; var t=document.getElementById('gcse-tier'); if(t) t.classList.toggle('hidden',val!=='gcse'); }
  if (type==='tier') selTier=val;
}
function selBoard(el, board) {
  document.querySelectorAll('#board-opts .bopt').forEach(function(b){b.classList.remove('sel');});
  el.classList.add('sel'); selBoardVal=board;
}
function goStep(n) {
  ['step1','step2','step3'].forEach(function(id){var el=document.getElementById(id);if(el)el.classList.add('hidden');});
  var el=document.getElementById('step'+n); if(el) el.classList.remove('hidden');
}
function goStep2() {
  var fn=(document.getElementById('su-fn').value||'').trim();
  var em=(document.getElementById('su-em').value||'').trim().toLowerCase();
  var pw=document.getElementById('su-pw').value||'';
  document.getElementById('su-em').classList.remove('inv');
  document.getElementById('su-em-e').style.display='none';
  if (!fn){toast('Please enter your first name','error');return;}
  if (!vEmail(em)){document.getElementById('su-em').classList.add('inv');document.getElementById('su-em-e').style.display='block';return;}
  if (pw.length<8){toast('Password must be at least 8 characters','error');return;}
  goStep(2);
}
function goStep3() { if(!selLevel){toast('Please select your study level','error');return;} goStep(3); }

// ── SIGNUP (Supabase sends real verification email) ──
function doSignup() {
  if (!sbConfigured()) { toast('Supabase not configured yet \u2014 see setup instructions below', 'error'); showSetupBanner(); return; }
  var fn=(document.getElementById('su-fn').value||'').trim();
  var ln=(document.getElementById('su-ln').value||'').trim();
  var em=(document.getElementById('su-em').value||'').trim().toLowerCase();
  var pw=document.getElementById('su-pw').value||'';
  if (!document.getElementById('su-tc').checked){toast('Please accept the Terms of Service','error');return;}
  var btn=document.getElementById('su-btn'); btn.disabled=true; btn.textContent='Creating account...';
  getSB().then(function(sb) {
    return sb.auth.signUp({
      email: em,
      password: pw,
      options: {
        data: {
          first_name: fn,
          last_name: ln,
          full_name: fn + (ln?' '+ln:''),
          level: selLevel,
          tier: selTier,
          board: selBoardVal,
          school: (document.getElementById('su-school').value||'').trim(),
          country: (document.getElementById('su-country').value||'').trim(),
          subjects: (document.getElementById('su-subjects').value||'').trim()
        }
      }
    });
  }).then(function(res) {
    btn.disabled=false; btn.textContent='Create free account \uD83D\uDE80';
    if (res.error) { toast(res.error.message, 'error'); return; }
    // Supabase sends a real verification email automatically
    document.getElementById('verify-email-display').textContent = em;
    showPg('verify');
    toast('Verification email sent to ' + em + '! Check your inbox.', 'success');
  }).catch(function(err) {
    btn.disabled=false; btn.textContent='Create free account \uD83D\uDE80';
    toast('Error: ' + err.message, 'error');
  });
}

// ── VERIFY (user clicks link in email, then comes back and clicks Continue) ──
function submitVerifyCode() {
  // With Supabase email verification, the user clicks the link in their email
  // That link redirects back to the app with a token in the URL
  // We handle that in the window.load listener below
  // This button just prompts them to check email
  toast('Check your email and click the verification link!', 'info');
}
function skipVerify() {
  // Only works if email confirmation is disabled in Supabase dashboard
  toast('Please click the link in your verification email to continue.', 'info');
}
function resendCode() {
  var em = document.getElementById('verify-email-display').textContent;
  getSB().then(function(sb) {
    return sb.auth.resend({ type: 'signup', email: em });
  }).then(function(res) {
    if (res.error) toast(res.error.message, 'error');
    else toast('Verification email resent to ' + em, 'success');
  });
}

// ── LOGIN (Supabase handles it — real session, real JWT) ──
function doLogin() {
  if (!sbConfigured()) { toast('Supabase not configured yet \u2014 see setup instructions below', 'error'); showSetupBanner(); return; }
  var em=(document.getElementById('li-em').value||'').trim().toLowerCase();
  var pw=document.getElementById('li-pw').value||'';
  document.getElementById('li-em').classList.remove('inv');
  document.getElementById('li-pw').classList.remove('inv');
  document.getElementById('li-err').style.display='none';
  if (!vEmail(em)){document.getElementById('li-em').classList.add('inv');toast('Please enter a valid email','error');return;}
  if (!pw){document.getElementById('li-pw').classList.add('inv');toast('Please enter your password','error');return;}
  var btn=document.getElementById('li-btn'); btn.disabled=true; btn.textContent='Signing in...';
  getSB().then(function(sb) {
    return sb.auth.signInWithPassword({ email: em, password: pw });
  }).then(function(res) {
    btn.disabled=false; btn.textContent='Sign in to UltraVision AI';
    if (res.error) {
      document.getElementById('li-err').style.display='block';
      document.getElementById('li-em').classList.add('inv');
      document.getElementById('li-pw').classList.add('inv');
      return;
    }
    CU = res.data.user;
    launchApp();
  }).catch(function(err) {
    btn.disabled=false; btn.textContent='Sign in to UltraVision AI';
    toast('Sign in failed: ' + err.message, 'error');
  });
}

// ── FORGOT PASSWORD (Supabase sends real reset email) ──
function doForgot() {
  if (!sbConfigured()) { toast('Supabase not configured yet', 'error'); showSetupBanner(); return; }
  var em=(document.getElementById('fg-em').value||'').trim().toLowerCase();
  if (!vEmail(em)){toast('Please enter a valid email','error');return;}
  getSB().then(function(sb) {
    return sb.auth.resetPasswordForEmail(em, {
      redirectTo: 'https://ultravision-ai.co.uk'
    });
  }).then(function(res) {
    if (res.error) { toast(res.error.message, 'error'); return; }
    document.getElementById('fg-ok').style.display='block';
    toast('Password reset email sent! Check your inbox.', 'success');
  });
}

// ── HANDLE EMAIL LINK CALLBACKS (verify + password reset) ──
// Supabase puts tokens in the URL hash after the user clicks email links
function handleAuthCallback() {
  var hash = window.location.hash;
  var search = window.location.search;
  if (!hash && !search.includes('type=recovery') && !search.includes('access_token')) return;
  if (hash.includes('access_token') || hash.includes('type=signup') || hash.includes('type=recovery') || window.location.search.includes('type=recovery')) {
    getSB().then(function(sb) {
      return sb.auth.getSessionFromUrl ? sb.auth.getSessionFromUrl({ storeSession: true }) : sb.auth.getSession();
    }).then(function(res) {
      // Clear the hash from URL
      var type = hash.includes('type=recovery') ? 'recovery' : 'signup';
      history.replaceState(null, '', window.location.pathname);
      if (res.data && res.data.session) {
        CU = res.data.session.user;
        if (type === 'recovery') {
          // Show password reset form
          showPg('reset-pw');
        } else {
          // Email verified successfully
          toast('Email verified! Welcome to UltraVision AI \uD83C\uDF89', 'success');
          launchApp();
        }
      }
    }).catch(function(){});
  }
}

// ── PASSWORD RESET (after clicking email link) ──
function doReset() {
 var np=document.getElementById('new-pw-input').value||'';
  var cp=document.getElementById('new-cpw-input').value||'';
  if (np.length<8) {toast('Password must be at least 8 characters','error');return;}
  if (np!==cp){toast('Passwords do not match','error');return;}
  getSB().then(function(sb) {
    return sb.auth.updateUser({ password: np });
  }).then(function(res) {
    if (res.error){toast(res.error.message,'error');return;}
    toast('Password updated! Please sign in.','success');
    getSB().then(function(sb){sb.auth.signOut();});
    showPg('login');
  });
}

// Stubs for reset code inputs (not used with Supabase but HTML references them)
function rcKeyUp(){}
function rcKeyDown(){}
function rcPaste(e){e.preventDefault();}
function vcKeyUp(el,idx){if(el.value.length===1&&idx<5){var ins=document.querySelectorAll('#pg-verify .vci');if(ins[idx+1])ins[idx+1].focus();}}
function vcKeyDown(el,e,idx){if(e.key==='Backspace'&&!el.value&&idx>0){var ins=document.querySelectorAll('#pg-verify .vci');if(ins[idx-1])ins[idx-1].focus();}}
function vcPaste(e){e.preventDefault();}
function doLogout(){
  getSB().then(function(sb){return sb.auth.signOut();}).finally(function() {
    CU=null; CP={}; chatH=[];
    document.getElementById('app').classList.remove('on');
    document.getElementById('auth-wrap').style.display='flex';
    showPg('land'); toast('Signed out','info');
  });
}

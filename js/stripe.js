function loadStripe(){
  return new Promise(function(res,rej){
    if(window.Stripe){res(window.Stripe(STRIPE_KEY));return;}
    var s=document.createElement('script');s.src='https://js.stripe.com/v3/';
    s.onload=function(){res(window.Stripe(STRIPE_KEY));};
    s.onerror=function(){rej(new Error('Stripe failed'));};
    document.head.appendChild(s);
  });
}
function upgradePro(){
  if(!CU){toast('Sign in first','error');return;}
  window.open('https://buy.stripe.com/test_eVq3co8HL1Mi5M8eDue7m00','_blank');
}

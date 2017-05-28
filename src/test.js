const b=()=>{
  console.log('test');
  c();
}

const a= (next)=>{
  b();
  c();
}

function c(){
  var test=1;
  test++;
}
a(1);
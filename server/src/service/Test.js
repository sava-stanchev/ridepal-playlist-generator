
let a = 0;
const out = () => {
  a =5;
  var a = 2;
  const incr = () => {
    a++;
  };
  incr();
  console.log(a);
};
out();

const b = 1_024;
console.log(b);

const a =3;
var a = 4;

let x ="10";
console.log(x + + + 5, x);
console.log(x +++5, x);

const one = ( ) => {
  a = 42;
  const b = () => a;
  var a = 24;
  return b;
}

console.log(one()());

(new Function('console.log(this)'))()

const x = 3;
console.log(1..x);

for (let i=0; i<5; i++) {

}

i()
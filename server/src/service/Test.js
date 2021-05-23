import hash from 'object-hash';

const obj = {name: 'My', age: '13'};
const obj1 = {name: 'My', age: '14'};

console.log(hash(obj));
console.log(hash(obj1));

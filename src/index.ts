interface Human {
  name:string,
  age:number,
  gender:string
}

const person = {
  name: "hyunjin",
  age: 28,
  gender: "male"
}

const sayHi = (person:Human):string => {
  return `hello ${person.name}, you are ${person.age}, you are a ${person.gender}`;
};

console.log(sayHi(person));

export {};

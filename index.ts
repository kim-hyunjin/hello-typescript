const myName = "hyunjin",
  age = 28,
  gender = "male";

  // gender는 필수 파라미터가 아님
const sayHi = (name, age, gender?) => {
  console.log(`hello ${name}, you are ${age}, you are a ${gender}`);
};

sayHi(myName, age);

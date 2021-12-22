/**
 * Intersection Type
 */
type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

type EleavatedEmployee = Admin & Employee;

const e1: EleavatedEmployee = {
  name: "Nana",
  privileges: ["create-server"],
  startDate: new Date(),
};

interface Admin2 {
  name: string;
  privileges: string[];
}

interface Employee2 {
  name: string;
  startDate: Date;
}

interface EleavatedeEmployee1 extends Admin2, Employee2 {}

type EleavatedEmployee2 = Admin2 & Employee2;

/**
 * Type Guard
 */
type Combinable = string | number;
type Numeric = number | boolean;
type Universal = Combinable & Numeric;

function add(a: Combinable, b: Combinable) {
  if (typeof a === "string" || typeof b === "string") {
    return a.toString() + b.toString();
  }
  return a + b;
}

type UnknownEmployee = Employee | Admin;

function printEmployeeInfo(emp: UnknownEmployee) {
  console.log("Name: " + emp.name);
  if ("privileges" in emp) {
    console.log("Privileges: " + emp.privileges);
  }
  if ("startDate" in emp) {
    console.log("StartDate: " + emp.startDate);
  }
}

printEmployeeInfo({ name: "Namu", startDate: new Date() });

class Car {
  drive() {
    console.log("Brooong boorooong");
  }
}

class Truck {
  drive() {
    console.log("boowaaaaaaang");
  }

  loadCargo(amount: number) {
    console.log("Loading cargo ... " + amount);
  }
}

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();
  //   if ("loadCargo" in vehicle) {
  //     vehicle.loadCargo(1000);
  //   }
  // class는 js에서도 제공. instanceOf로 타입을 체크할 수 있다.
  if (vehicle instanceof Truck) {
    vehicle.loadCargo(1000);
  }
}

useVehicle(v1);
useVehicle(v2);

/**
 * Discriminated Unions
 */

interface Bird {
  type: "bird";
  flyingSpeed: number;
}

interface Horse {
  type: "horse";
  runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
  switch (animal.type) {
    case "bird":
      console.log("Moving with speed: " + animal.flyingSpeed);
      break;
    case "horse":
      console.log("Moving with speed: " + animal.runningSpeed);
  }
}

moveAnimal({ type: "bird", flyingSpeed: 20 });
moveAnimal({ type: "horse", runningSpeed: 30 });

/**
 * Type Casting
 */
const paragraph = document.getElementById("message-output");
// const userInput = <HTMLInputElement>document.getElementById("user-input")!; // it work too
const userInput = document.getElementById("user-input")! as HTMLInputElement;
userInput.value = "Hi there!";

/**
 * Index Type
 */
interface ErrorContainer {
  [prop: string]: string; // property는 string, value는 string
}

const errorBag: ErrorContainer = {
  email: "Not a valid email!",
  username: "Must start with a capital character!",
};

/**
 * Overload
 */
function add2(a: number, b: number): number;
function add2(a: string, b: string): string;
function add2(a: number, b: string): string;
function add2(a: string, b: number): string;
function add2(a: Combinable, b: Combinable) {
  if (typeof a === "string" || typeof b === "string") {
    return a.toString() + b.toString();
  }
  return a + b;
}
const result = add2("max ", 5);
result.split(" ");

/**
 * Optional Chainning
 */
const fetchUserData = {
  id: "u1",
  name: "max",
  job: { title: "CEO", description: "my own company" },
};

console.log(fetchUserData?.job?.title);

/**
 * Nullish Coalescing
 */
const userInputData = undefined;
const storedData = userInputData ?? "DEFAULT"; // null or undefined 일 경우, DEFAULT 문자열을 사용

console.log(storedData);

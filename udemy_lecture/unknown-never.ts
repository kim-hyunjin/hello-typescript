/**
 * unknown type
 */

let userInput: unknown;
let userInput2: any;

userInput = 5;
userInput = "max";
userInput2 = "max";

let userName: string;
// userName = userInput // Error!
userName = userInput2; // No Error...

if (typeof userInput === "string") {
  userName = userInput; // OK
}
// so unknown type is more restrict than any type

/**
 * never type
 */

// we can explitb our intention. this method never return
function generateError(message: string, code: number): never {
  throw { message, errorCode: code };
}

const whatGenerateErrorReturn = generateError("An error occurred!", 500);
console.log(whatGenerateErrorReturn); // nothing happen

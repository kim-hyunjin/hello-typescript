function add(num1, num2, showResult, phrase) {
    var result = num1 + num2;
    if (showResult)
        console.log(phrase + result);
    return result;
}
var num1 = "5";
var num2 = 2.7;
var num3 = 5;
var printResult = true;
var phrase = "Result is : ";
// const result = add(num1, num2); // Error! typescript can help us!
var result = add(num2, num3, printResult, phrase);

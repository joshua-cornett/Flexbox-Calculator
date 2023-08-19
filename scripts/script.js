console.log("Hello");

let buttons = document.querySelectorAll('.calc-button');

//grab the display (an element inside the display div holds the shown number)
let display = document.getElementById("innerDisplay");
let expressionDisplay = document.getElementById("expression");

let operand = display.innerHTML = "0";
let expression = [];

let state = "clear";

buttons.forEach((button) => {
  const buttonVal = button.querySelector('p').innerText;
  button.addEventListener('click', () => {
    //call function to process
    processButton(buttonVal);
  });
});

//add the value to expression array
const processButton = (bVal) => {

  let updateExpression = false;

  switch (bVal) {

    case 'C':
      //clear
      C();
      updateExpression = true;
      break;

    case 'DEL':
      //delete
      DEL();
      break;

    case '=':
      //evaulate
      expression.push(operand);
      evaluate(expression);
      updateExpression = true;
      break;

    default:
      //must be a operand or operator
      let isOperand = !isNaN(parseInt(bVal));
      let isOperator = !isOperand;

      switch(state) {

        case "clear":
          if (isOperand) {
            //operand on clear
            display.innerHTML = operand = bVal;
            state = "operand"; 
          }
          else {
            //operator on clear
            expression.push(operand,bVal);
            updateExpression = true;
            state = "operator";
          }
          break;

        case "operand":
          if (isOperand) { //operand on operand
            //add it so long as it doesn't start with zero
            operand += bVal;
            display.innerHTML += bVal;
          }
          else { //operator on operand
            expression.push(operand,bVal);
            updateExpression = true;
            state = "operator";
          }
          break;

        case "operator":
          if(isOperand) { //operand on operator
            //incorporate new operand and update display
            display.innerHTML = operand = bVal;
            state = "operand";
          }
          else { //operator on operator
            //override previous operator
            expression[expression.length -1] = bVal;
            updateExpression = true;
            state = "operator";
          }
          break;
        default:
          break;
      }

      break;
  }
  if (updateExpression) { expressionDisplay.innerHTML = expression.join(' ')}
  //if (expressionDisplay.innerHTML === "") {expressionDisplay.innerHTML = "0"}
};

//when "=" is clicked
//should return the result
const evaluate = (e) => {
  console.log(expression);
};

const C = () => {
  operand = display.innerHTML = "0";
  expression = [];
  state = "clear";
};

const DEL =  () => {
  //let's not leave the display empty
  if (display.innerHTML.length === 1) { 
    display.innerHTML = "0";
    state = "clear";
    return;
  }
  display.innerHTML = display.innerHTML.slice(0,-1);
};

const divide = () => {

};

const times = () => {

};

const minus = () => {

};

const plus = () => {

};

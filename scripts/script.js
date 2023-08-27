console.log("Hello");

const buttons = document.querySelectorAll('.calc-button');

//grab the display (an element inside the display div holds the shown number)
const displayValue = document.getElementById("displayValue");
const displayOperation = document.getElementById("displayOperation");

//grab the expression display
//holds expressions as p elements
const exprDisplay = document.getElementById("expressionBox");

let operand = displayValue.innerHTML = "0";
let operator = "";
let operation = ["","","",""];

let lastEntry = "";

let expressions = [];
let expression = [];

//Map to store operators and their assigned priorities (PEMDAS)
const operatorMap = new Map([
  ["×", 1],
  ["÷", 1],
  ["+", 2],
  ["-", 2],
]);

const operators = [ ...operatorMap.keys()];

buttons.forEach((button) => {
  const buttonVal = button.querySelector('p').innerText;
  button.addEventListener('click', () => {
    //call function to process
    const updates = processButton(buttonVal);
    lastEntry = buttonVal;
    if(updates[0]) { //update calculator display
      displayValue.innerHTML = operand;
    }
    if(updates[1]) { //update expression display
      displayOperation.innerHTML = operation.join(' ');
      exprDisplay.lastElementChild.innerHTML = expression.join(' ');
    }
    if(updates[2]) { //add a new expression placeholder in the expression box
      addNewExpression();
    }
  });
});

const addNewExpression = () => {
  //expression = [operand, operator, expression[expression.length-3]];
  expression = [];
  const newPElement = exprDisplay.appendChild(document.createElement('p'));
  newPElement.setAttribute('class','expression');
}

/*****BUG LIST******/
  //'.' after operator
  //operator not clearing after new operand
const processButton = (bVal) => {

  //check if the operand contains a decimal
  let isDecimal = operand.length > 0 && operand.includes('.');

  if (!isNaN(parseInt(bVal))) { 
    //if the operand is currently either a decimal or a non-zero integer
      //add the entry
    //otherwise, overwrite it
    isDecimal || (!isNaN(parseInt(operand[operand.length-1])) && operand !== "0") ? 
      operand += bVal : operand = bVal;
    return [1, 0, 0];
  }
  else {
    operand = parseFloat(operand);
    switch(bVal) {
      
      case "." :
        //add the decimal so long as there isn't one already
        let updateOperand = true;
        (!isDecimal) ?
          (!operators.includes(lastEntry)) ?
            operand += bVal
          : operand = "0" + bVal
        : updateOperand = false;
         
        return [updateOperand,0,0]
      case "C" : return Clr();
      case "DEL" : return DEL();
      case "=" : 
        //pushing the current operand like usual
          //simultaneously checking if it was formerly empty
            //and if so, that means we're evaluating continuously
            //so we want to repeat the last operation on that operand 
        if(expression.push(operand) - 1 === 0) {
          if(expressions.length > 0) {
            console.log("repeat operation");
            
            const lastExpression = expressions[expressions.length-1];
            const lastOperand = lastExpression[lastExpression.length-3];
            expression.push(operator,lastOperand);
            //operation = [operator, lastOperand];
            operand = evaluate(expression);
            expression.push(bVal,operand);
            return [1, 1, 1];
          }
        }

        operand = evaluate(expression);
        expression.push(bVal,operand);
        expressions.push(expression);
        return [1, 1, 1];
      default:
        //pressed operator
        //need to specifically check if the last button pressed was an operator
          //so if it isn't an integer, and it isn't a '.'
            //no need to check for '=' since that is never the end of our expressions
        if(expression.length > 0) {
          if (isNaN(parseInt(lastEntry)) && lastEntry !== '.') {
            expression[expression.length-1] = operator = bVal;
            return [1,1,0];
          }
        }
        operator = bVal;
        expression.push(operand,operator);
        
        operand = evaluate(expression);
        return [1,1,0];
    }
  }
};

const Clr = () => {
  operand = "0";
  operator = "";
  expression = [];
  return [1, 1, 0];
};

const DEL =  () => {
  operand = operand.toString().slice(0,-1);
  //let's not leave the display empty
  if (operand.length === 0) { 
    operand = "0";
  }
  return [1, 0, 0];
};

const getExprSplit_i = (e) => {
  let maxPriority = -1;
  let maxPriority_i = 0;
  for (let i = 0; i < e.length; i += 2) {
    if (operators.includes(e[i+1])) {
      const currPriority = operatorMap.get(e[i+1]);
      if(currPriority >= maxPriority) {
        maxPriority = currPriority;
        maxPriority_i = i+1;
      }
    }
  }
  return maxPriority_i;
};

const evaluate = (expr,expr_i) => {

  if (expr.length < 3) { return parseFloat(expr[0]); } //if it's just a single operand, we can return that

  //this part is a little confusing
  //counterintuitively, the expression needs to be split by operators in order of lowest PEMDAS
    /* ex: 
        eval(["1", "+", "2", "*", "3", "+", "4", "*", "5"]) 
        becomes eval( eval["1", "+", "2", "*", "3"], "+", eval(["4", "*", "5"]) ) 
        and so on..
    */
  //By splitting by the lower order PEMDAS operators,
  //the higher order PEMDAS operations can fully evaluate before returning

  const opIndex = getExprSplit_i(expr);//this function handles getting the index of the operator to split around
  const op = expr[opIndex]; //this is that operator, needed for the outermost evaluation

  const leftExpr = expr.slice(0, opIndex); //slice the array to yield the expression to the left of the priority operator
  const rightExpr = expr.slice(opIndex + 1, opIndex.length); //and then the right as well

  //check to make sure subexpressions contain something
  //otherwise just proceed with the other expression
  if(leftExpr.length === 0 && rightExpr.length > 0) {
    return evaluate(rightExpr);
  }
  if(rightExpr.length === 0 && leftExpr.length > 0) {
    return evaluate(leftExpr);
  }

  const leftVal = evaluate(leftExpr);
  const rightVal = evaluate(rightExpr);  

  let result;
  switch (op) {
    case '+':
      result = leftVal + rightVal;
      break;
    case '-':
      result = leftVal - rightVal;
      break;
    case '×':
      result = leftVal * rightVal;
      break;
    case '÷':
      result = leftVal / rightVal;
      break;
    default:
      throw new Error(`Invalid operator: ${op}`);
  }

  return parseFloat(result);
};

console.log("Hello");

const buttons = document.querySelectorAll('.calc-button');

//grab the display (an element inside the display div holds the shown number)
const calcDisplay = document.getElementById("displayValue");

//grab the expression display
//holds expressions as p elements
const exprDisplay = document.getElementById("expressionBox");

let operand = calcDisplay.innerHTML = "0";
let operator = "";

let expressions = [];
let expression = [];

//const ops = ['(',')','e',['×','÷'],['+','-']];

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
    if(updates[0]) { //update calculator display
      calcDisplay.innerHTML = operand;
    }
    if(updates[1]) { //update expression display
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
  newPElement.setAttribute('class','expressionValue');
}

const processButton = (bVal) => {

  if (bVal === ".") {
    alert("Sorry for the alert, but decimals aren't ready yet.");
    return [0, 0, 0];
  }


  if (!isNaN(parseInt(bVal))) { 
    //need to check if last item in expression is an operator
    operand !== "0" && (!isNaN(parseInt(operand[operand.length-1]))) ? 
      operand += bVal : operand = bVal;
    return [1, 0, 0];
  }
  else {
    switch(bVal) {
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
            //the code directly below works, but for legibility I'm partitioning it out
            //expression.push(operator,expressions[expressions.length - 1][expressions[expressions.length - 1].length - 3]);
            const lastExpression = expressions[expressions.length-1];
            const lastOperand = lastExpression[lastExpression.length-3];
            expression.push(operator,lastOperand);
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
        operator = bVal;
        expression.push(operand,operator);
        operand = evaluate(expression);
        return [1,1,0];
    }
  }
};

const Clr = () => {
  operand = "0";
  expression = [];
  return [1, 1, 0];
};

//*** Need checks for deleting from evaluated results */
const DEL =  () => {
  operand = operand.toString().slice(0,-1);
  //let's not leave the display empty
  if (operand.length === 0) { 
    operand = "0";
  }
  return [1, 0, 0];
};

/*const getExprSplit_i = (e) => {
  
  let topPriority_i = 0;
  let topPriority = -1;
  for (let i = 0; i < e.length; i += 2) { //loop through expression, skipping operators
    if (operators.includes(e[i + 1]) ) { //check if the next value in the expression is an actionable operator
      const priority = operators.length - operators.indexOf(e[i + 1]); //set the current priority to the operator's place in the operations array (listed by descending PEMDAS)
      if (priority >= topPriority) { //check if that priority is higher than the currently recorded highest
        topPriority = priority; //if it is, set the new top priority
        topPriority_i = i + 1; //and record the index of that operator in the expression
      }
    }
  }
  
  return topPriority_i;
};*/

const getExprSplit_i = (e) => {
  let maxPriority = -1;
  let maxPriority_i = 0;
  for (let i = 0; i < e.length; i += 2) {
    if (operators.includes(e[i+1])) {
      console.log("yay?");
      const currPriority = operatorMap.get(e[i+1]);
      if(currPriority >= maxPriority) {
        maxPriority = currPriority;
        maxPriority_i = i+1;
      }
    }
  }
  return maxPriority_i;
};



const evaluate = (expr) => {

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

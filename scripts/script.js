let buttons = document.querySelectorAll('.calc-button');

buttons.forEach((button) => {
  const buttonVal = button.querySelector('p').innerText;
  button.addEventListener('click', () => {
    //call function to process
    processButton(buttonVal);
  });
});

//add the value to operation array
const addVal = (val) => {
  console.log(val);
};

//add operator, likely to array called "operation"//
const addOperator = (operator) => {
  console.log("Adding operator!");
};

//basic getNum function, returns the number, if it is one, else returns NAN -- 
//DOESN'T CURRENTLY WORK FOR ZERO!
const getNum = (value) => {return parseInt(value);};

//will need conditional to determine if number or operation
  //could be good to seperate nums and operator processing

//when "=" is clicked
//takes a simple array of operations EX: ["2","+","2"]
//and should return the result I.E. 4
const evaluate = (operationArr) {
  //will need conditional to determine if number or operation
  //could be good to seperate nums and operator processing
  if(isNum(val)){
    console.log("Number!");
  }
  else {
    console.log("Operator!")
    addOperator(val);
  }
};

//array mapping example, useful for eventual evaluation function

/*var arr = ["100", "+","0"];
arr = arr.map( x => x == 0 ? 0 : (parseInt(x) || x));
console.log(arr);*/

//Crude script load check
console.log("Hello from refactor");

//EVENT LISTENER INTIALIZATION
    //a click event for each calculator button
const buttons = document.querySelectorAll('.calc-button');
buttons.forEach((button) => {

    const buttonValue = button.querySelector('p').innerText;

    button.addEventListener('click', () => {

        processButton(buttonValue); //button handler
        alignExpressions(); //realign expressions

    });

});

//Aligns expressions by result length
const alignExpressions = () => {
    const results = document.querySelectorAll(".result");
    let maxResultWidth = 0;

    // Calculate the maximum result width
    results.forEach((result) => {
        const resultWidth = result.clientWidth;
        if (resultWidth > maxResultWidth) {
            maxResultWidth = resultWidth;
        }
    });

    // Set the calculated maximum result width
    results.forEach((result) => {
        result.style.minWidth = maxResultWidth + "px";
    });

}

class Expression {
    constructor() {
        this.expression = {
            left: [],
            operator: '',
            right: []
        }
    }

    get() {
        return this.expression;
    }

    appendValue(value) {
        this.expression += value;
    }

    appendOperator(operator) {
        this.expression += operator;
    }

    clear() {
        this.expression = [];
    }
}

const Calculator = {
    //displays
    historyDisplay: document.getElementById("history"),
    expressionDisplay: document.getElementById("currentExpression"),
    operationBuildDisplay: document.getElementById("operationBuild"),
    inputDisplay: document.getElementById("input"),

    //constants
    operatorMap: new Map([
        ['*', 1],
        ['/', 1],
        ['+', 2],
        ['-', 2]
      ]),
    operators: [],

    // tracked/mutable values
    history: [], //contains all final expression evaluations
    expression: new Expression(), //contains the current expression slotted to evaluate
    operationBuild: [], //contains the expression evaulation so far and the tentative operator
    input: [], //contains the current input
    
    updateStatus: { //tracks what to update when updateDisplays is called
        history: false,
        expression: false,
        operationBuild: false,
        input: false,

        //shortcut methods for toggling all update statuses on or off
        all() {
            this.history = this.expression = this.operationBuild = this.input = true;
        },
        reset() {
            this.history = this.expression = this.operationBuild = this.input = false;
        }

    },

    initialize() {
        // Gather the operators from 'operatorMap'
        this.operators = Array.from(this.operatorMap.keys());

        //... default display code here ...
        this.input.push("0");
        this.updateDisplays("input");

        // ... any other initialization code ...
    },

    appendValue(value) {

        //***TODO: Create a function to check if the value is an operator or operand */
        //***TODO: Add decimal logic, move append logic to Expression class */
        const isOperand = false;

        if (isOperand) {
            
        }
    },

    updateDisplays(update = '') {

        const updates = this.updateStatus;

        //short-circuit?
        if(updates.input || update === "input") {
            //update the input display
            this.inputDisplay.textContent = this.input;
        }

        //short-circuit?
        if(updates.operationBuild || update === "operationBuild") {
            //update the operationBuild display
            this.operationBuildDisplay.textContent = this.operationBuild;
        }

        if(updates.expression || update === "expression") {
            //update the current expression display
            this.expressionDisplay.textContent = this.expression.get();

            alignExpressions(); //realign expressions
        }

        if(updates.history || update === "history") {
            //TODO: Loop over history[] to add and fill spans
            //update the history

            //TODO: Separate this into another method to call upon "=" evaluation
            const newExpressionSpan = this.historyDisplay.appendChild(document.createElement('span'));
            newExpressionSpan.setAttribute('class','expression');
            newExpressionSpan.textContent = this.expression.get();
            
            alignExpressions(); //realign expressions
        }

        //reset the update status
        this.updateStatus.reset();
    },

    // ... other methods ...

        //EVALUATION
};


//processes the button based on it's value
const processButton = (buttonVal) => {
    //nothing yet
}

Calculator.initialize();
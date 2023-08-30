
//Crude script load check
console.log("Hello from refactor");

/**** Expression class ****
 * Purpose: Handles all expression logic
 * Properties: left, operator, right
 * Methods: get, clear, setters, hasNested, evaluate
 * ***********************/
class Expression {
    constructor() {
        this.expression = {
            left: null,
            operator: '',
            right: null
        };
    }

    get() {
        const { left, operator, right } = this.expression;
        const leftArr = left instanceof Expression ? left.get() : [left];
        const rightArr = right instanceof Expression ? right.get() : [right];
        return [...leftArr, operator, ...rightArr];
    }

    clear() {
        this.expression = [];
    }

    setLeft(operand) {
        this.expression.left = operand;
    }

    setOperator(operator) {
        this.expression.operator = operator;
    }

    setRight(operand) {
        this.expression.right = operand;
    }

    hasNested() {
        return (this.expression.left instanceof Expression || 
            this.expression.right instanceof Expression);
    }

    evaluate() {
        if (this.hasNested()) {
            return Calculator.evaluate(this.expression); // Using Calculator directly
        } else {
            // Evaluate non-nested expression
        }
    }

}


/**** Display class ****
 * Purpose: Handles all display logic
 * Properties: ID, element
 * Methods: update, clear, alignExpressions
 * ***********************/
class Display {
    constructor(htmlID) {
        this.display = {
            ID: htmlID,
            element: document.getElementById(htmlID)
        }
    }

    update() {
        switch(this.display.ID) {
            case 'input':
                // ... input Update logic ... //
                this.display.element.textContent = calculator.input.value;
                break;
            case 'operationBuild':
                // ... operationBuild Update logic ... //
                this.display.element.textContent = [calculator.operationBuild.expression].join(' ');
                break;
            case 'currentExpression':
                // ... expression Update logic ... //
                this.display.element.textContent = calculator.expression;
                this.alignExpressions();
                break;
            case 'history':
                // ... history Update logic ... //
                this.display.element.textContent = calculator.history;
                this.alignExpressions();
                break;
            default: break;
        }
    }

    clear() {
        this.display.element.textContent = '';
    }

    //Aligns expressions by result length
    alignExpressions() {
        const results = document.querySelectorAll(".result");
        console.log(results);
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
}


/**** Calculator class ****
 * Purpose: Handles all input processing and data storage
 * Properties: history, currentExpression, operationBuild, input,
 *          buttons, operatorPriorityMap, operators
 * Methods: processInput, evaluate
 * ***********************/
class Calculator {

    constructor() {
        // Initialize calculator properties
        this.history = {
            data: [],
            display: new Display("history"),
        };
        
        this.currentExpression = {
            expression: null,
            display: new Display("currentExpression"),
        };

        this.operationBuild = {
            expression: null,
            operator: '',
            display: new Display("operationBuild"),
        };

        this.input = {
            value: '',
            display: new Display("input"),
        };

        this.buttons = document.querySelectorAll('.calc-button'),

        this.buttons.forEach((button) => {

            const buttonValue = button.querySelector('p').innerText;
        
            button.addEventListener('click', () => {
                this.processInput(buttonValue); //button handler
            });
        
        });

        this.operatorPriorityMap = new Map([
            ['(', -1],  //TODO: figure out how to handle parentheses
            [')', -1],  //
            ['*', 1],
            ['/', 1],
            ['+', 2],
            ['-', 2],
            //... additional operators go here ...
        ]);

        this.operators = Array.from(this.operatorPriorityMap.keys());
    }

    processInput(input) {
        //TODO: INPUT PROCESSING
        this.input.value += input;
        this.input.display.update();
    }

    evaluate(expression) {
        if (expression instanceof Expression) {
            return expression.evaluate(); // Evaluate the Expression instance
        } else if (Array.isArray(expression)) {
            const [leftExpr, operator, rightExpr] = expression;
            const leftValue = this.evaluate(leftExpr);
            const rightValue = this.evaluate(rightExpr);

            // Perform operations based on operator precedence
            if (this.operatorPrecedence[operator] <= this.currentPrecedence) {
                // Evaluate the current operation
                //TODO: Handle evaluation of expression
            }
            //TODO: Handle operators with higher precedence later

            //TODO: Implement logic to perform the operation based on operator
        }
    }

    

};

const calculator = new Calculator();
function eval() {
    // Do not use eval!!!
    return;
}

class ExpressionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ExpressionError';
    }
}

function expressionCalculator(expr) {
    let bracketStack = []
    let buf = expr.match(/\d+|\+|\-|\(|\)|\*|\//g)

    function calculate(expr) {
        for (let i = 0; i < expr.length; i++) {
            if (expr[i] == '*' || expr[i] == '/') {
                if (expr[i] == '*') {
                    expr[i-1] = Number(expr[i-1]) * Number(expr[i+1]);
                } else {
                    if (Number(expr[i+1]) == 0) {
                        throw new TypeError('TypeError: Division by zero.');
                    }
                    expr[i-1] = Number(expr[i-1]) / Number(expr[i+1]);
                }
                expr.splice(i, 2);
                i--;
            }
        }
        for (let i = 0; i < expr.length; i++) {
            if (expr[i] == '+' || expr[i] == '-') {
                if (expr[i] == '+') {
                    expr[i-1] = Number(expr[i-1]) + Number(expr[i+1]);
                } else {
                    expr[i-1] = Number(expr[i-1]) - Number(expr[i+1]);
                }
                expr.splice(i, 2);
                i--;
            }
        }
        return expr[0];
    }

    for (let i = 0; i < buf.length; i++) {
        if (buf[i] == '(') {
            bracketStack.push(i);
        } else if (buf[i] == ')') {
            let startBracket = bracketStack.pop();
            if (startBracket == undefined) {
                throw new ExpressionError('ExpressionError: Brackets must be paired');
            }
            let bracketsLen = i - startBracket - 1;
            buf.splice(i, 1);
            buf[startBracket] = calculate(buf.splice(startBracket + 1, bracketsLen));
            i -= bracketsLen + 1;
        }
    }
    if (bracketStack.length > 0) {
        throw new ExpressionError('ExpressionError: Brackets must be paired');
    }
    
    return calculate(buf);
}

module.exports = {
    expressionCalculator
}

import React from 'react';
import './calculator.css'

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const LIMIT = 5;

function Calculator() {
    const [expression, setExpression] = React.useState("0");
    const [result, setResult] = React.useState(0);
    const [clear, setClear] = React.useState(false);

    /**
     * Converts the expression string into a numerical result
     */
    const compute = () => {
        // Debug variable. Compared with LIMIT to prevent stack overflow
        var STEP = 0;

        // Convert the expression string into computable blocks
        var computation = [expression[0]];
        for (var i = 1; i < expression.length; i++) {
            var e = expression[i];

            // If element is a digit to be appended to another number instead of making a new block
            if (isFloat(e) && isFloat(computation[computation.length - 1]))
                computation[computation.length - 1] += e;
            // Otherwise, make a new block with the element
            else if (e !== ' ')
                computation.push(e);
        }
        console.log("===== =====\nCPT: " + computation);

        // Start the calculations
        var res = recurseComputeBlock(computation, STEP);

        // Minor check for error
        if (res === null)
            res = "ERROR";

        // set result with the calculation results
        setResult(res);

        console.log("result: " + res);
    }

    /**
     * Recurseable function for processing computations of a block.
     * Supports parantheses (), exponents ^, multiplication *, division /, addition +, and subtraction -.
     * 
     * @param {string[]} array string[] that represents a calculator's input
     * @param {number} step Debug variable used to limit stack size
     * @returns string[] representing the computation's results. If (step > limit), returns null.
     */
    const recurseComputeBlock = (array, step) => {
        // Check recursion depth
        console.log("B STEP: " + step);
        if (step > LIMIT)
            return null;
        step++;

        console.log("rcb array: " + array);
        // if (array.length < 3)
        //     return array[0];

        var arr = array;
        var startIndex = -1;
        var depthCounter = 0;
        var block = [];

        // Search arr (copy of array) for an open parentheses (.
        for (var i = 0; i < arr.length; i++) {
            console.log('(i, arr[i], depthCounter): ' + i + ', ' + arr[i] + ', ' + depthCounter);
            // If '(' is found, compute the block. (Everything after the '(' is thrown in).
            if (arr[i] === "(" && depthCounter === 0) {
                console.log("BLOCK START @" + i);
                startIndex = i;
                depthCounter++;

                // Recursively compute the block
                block = recurseComputeBlock(arr.slice(i + 1), step);
                console.log("startIndex: " + i);
            }
            // If '(' is found before the former block has been completed, ignore. (For nested parantheses.)
            else if (arr[i] === "(" && depthCounter > 0)
                depthCounter++;
            // If ')' is found and we have a computed block, condense arr using the block and revert counters.
            else if (arr[i] === ")" && depthCounter === 1) {
                console.log("B STEP: " + step);
                console.log("endIndex: " + i);
                console.log("COMP B: " + block);
                console.log("COMP A: " + arr);

                // Compress the block into the array
                arr = compress(arr, block, startIndex, i);

                startIndex = -1;
                i = 0;
                depthCounter = 0;

                console.log("outcomp: " + arr);
            }
            // If ')' is found but it's for a nested parantheses, ignore.
            else if (arr[i] === ")" && depthCounter > 1)
                depthCounter--;
            // If ')' is found but no internal block was found. i.e. This is already the lowest block.
            else if (arr[i] === ")" && depthCounter === 0)
                break;
        }

        // E.M.D.A.S.
        arr = basicComputeBlock(arr, ["^"], step);
        arr = basicComputeBlock(arr, ["*", "/"], step);
        arr = basicComputeBlock(arr, ["+", "-"], step);

        //Remove closing parantheses in the first index, if possible
        if (arr.length > 1 && arr[1] === ")")
            arr = arr.slice(0, 1);


        console.log("arr: " + arr);
        console.log("BLOCK END");

        return arr;
    }

    /**
     * 
     * @param {string[]} array string[] that represents a calculator's input
     * @param {string[]} operations list of operations to detect and compute
     * @param {number} step debug variable to limit stack overflow
     * @returns string[] of the block's results
     */
    const basicComputeBlock = (array, operations, step) => {
        if (step > LIMIT)
            return null;
        step++;
        console.log(operations[0] + " STEP: " + step);
        console.log("bcb arr: " + array);

        var arr = array;

        for (var i = 0; i < arr.length; i++) {
            var a = arr[i];

            for (var j = 0; j < operations.length; j++) {
                if (a === operations[j]) {
                    console.log(i + "arr: " + arr);
                    arr = basicCompute(arr, i);
                    i -= 2;
                }
                else if (a === ")")
                    return arr;
            }

        }

        console.log("pcp arr: " + arr);
        return arr;
    }

    const basicCompute = (array, currentIndex) => {
        var arr = [];
        console.log("compute: " + array);
        // BASIC Operation +-*/^
        var x = operate(
            parseFloat(array[currentIndex - 1]),
            array[currentIndex],
            parseFloat(array[currentIndex + 1])
        );

        arr = compress(
            array,
            x,
            currentIndex - 1,
            currentIndex + 1
        );

        // console.log("computed: " + arr);
        return arr;
    }

    // [baseArray[0], baseArray[startIndex]) [subArray] (baseArray[endIndex], baseArray[-1])
    const compress = (baseArray, subArray, startIndex, endIndex) => {
        var newArray = []
        if (startIndex !== 0)
            newArray = baseArray.slice(0, startIndex);

        newArray = newArray.concat(subArray);

        if (endIndex !== baseArray.length - 1)
            newArray = newArray.concat(baseArray.slice(endIndex + 1));

        return newArray;
    }

    const isInt = (value) => {
        return !isNaN(parseInt(value, 10));
    }

    const isFloat = (value) => {
        return !isNaN(parseFloat(value));
    }

    const printDebug = () => {
        console.log("comp: " + expression);
        console.log("rest: " + result);
        // console.log("cpu: " + recurseCompute(computation));
        console.log(expression.substring(0, expression.length - 2));
    }

    const operate = (base, operation, variable) => {
        if (operation === "+")
            return base + variable;
        else if (operation === "-")
            return base - variable;
        else if (operation === "*")
            return base * variable;
        else if (operation === "/")
            return base / variable;
        else if (operation === "^")
            return base ** variable;
    }

    const directExpression = (event) => {
        setExpression(event.target.value)
    }

    const updateExpression = (value) => {
        setClear(false);
        var lastChar = expression[expression.length - 1];

        // Replace string operations
        if (typeof (value) === "string" &&
            (!isInt(lastChar) && lastChar !== "(" && lastChar !== ".")) {
            setExpression(expression.substring(0, expression.length - 2));
        }
        else if ((typeof (value) !== "string" || value === "(" || value === ".") && expression === "0")
            setExpression("" + value);
        else if (value === "(" && isInt(lastChar)) {
            setExpression(expression + "*" + value)
        }
        else if (value === "(" && lastChar === ".")
            setExpression(expression + "0*" + value)
        else if (typeof (value) === "string" && lastChar === ".") {
            setExpression(expression + "0" + value)
        }
        else {
            setExpression(expression + value)
        }
    }

    const tryClear = () => {
        if (clear) {
            setClear(false);
            setExpression("0");
        }
        else
            setClear(true);
    }

    return (
        <div className="page">
            <div className="grid-column">
                <div id="result" className="paper-back">
                    {result}
                </div>
                <TextField
                    onChange={directExpression}
                    value={expression}
                    sx={{ backgroundColor: '#deb887c0;' }}
                >

                </TextField>
                {/* <Button
                    onClick={printDebug}
                    centerRipple
                    variant="outlined"
                >
                    Print Computation
                </Button> */}
                <div id="calculator-input" className="paper-back">
                    <div />
                    <Button
                        onClick={() => updateExpression(1)}
                        centerRipple
                        variant="outlined"
                    >
                        1
                    </Button>
                    <Button
                        onClick={() => updateExpression(4)}
                        centerRipple
                        variant="outlined"
                    >
                        4
                    </Button>
                    <Button
                        onClick={() => updateExpression(7)}
                        centerRipple
                        variant="outlined"
                    >
                        7
                    </Button>
                    <div />
                    <Button
                        onClick={() => updateExpression("(")}
                        centerRipple
                        variant="outlined"
                    >
                        {"("}
                    </Button>
                    <Button
                        onClick={() => updateExpression(2)}
                        centerRipple
                        variant="outlined"
                    >
                        2
                    </Button>
                    <Button
                        onClick={() => updateExpression(5)}
                        centerRipple
                        variant="outlined"
                    >
                        5
                    </Button>
                    <Button
                        onClick={() => updateExpression(8)}
                        centerRipple
                        variant="outlined"
                    >
                        8
                    </Button>
                    <Button
                        onClick={() => updateExpression(0)}
                        centerRipple
                        variant="outlined"
                    >
                        0
                    </Button>
                    <Button
                        onClick={() => updateExpression(")")}
                        centerRipple
                        variant="outlined"
                    >
                        {")"}
                    </Button>
                    <Button
                        onClick={() => updateExpression(3)}
                        centerRipple
                        variant="outlined"
                    >
                        3
                    </Button>
                    <Button
                        onClick={() => updateExpression(6)}
                        centerRipple
                        variant="outlined"
                    >
                        6
                    </Button>
                    <Button
                        onClick={() => updateExpression(9)}
                        centerRipple
                        variant="outlined"
                    >
                        9
                    </Button>
                    <Button
                        onClick={() => updateExpression(".")}
                        centerRipple
                        variant="outlined"
                    >
                        .
                    </Button>
                    <Button
                        onClick={() => updateExpression("^")}
                        centerRipple
                        variant="outlined"
                    >
                        ^
                    </Button>
                    <Button
                        onClick={() => updateExpression("+")}
                        centerRipple
                        variant="outlined"
                    >
                        +
                    </Button>
                    <Button
                        onClick={() => updateExpression("-")}
                        centerRipple
                        variant="outlined"
                    >
                        -
                    </Button>
                    <Button
                        onClick={() => updateExpression("*")}
                        centerRipple
                        variant="outlined"
                    >
                        *
                    </Button>
                    <Button
                        onClick={() => updateExpression("/")}
                        centerRipple
                        variant="outlined"
                    >
                        /
                    </Button>
                    <Button
                        className="two-tall"
                        onClick={() => tryClear()}
                        centerRipple
                        variant={clear ? "contained" : "outlined"}
                        color="error"
                    >
                        C
                    </Button>
                    <Button
                        className="three-tall"
                        onClick={() => compute()}
                        centerRipple
                        variant="contained"
                        color="success"
                    >
                        =
                    </Button>
                </div>
                <div id="notes" className="paper-back">
                    <h1>Features</h1>
                    <ul>
                        <li>Follows order of operations: PEMDAS</li>
                        <li>Works with multiple and nested parantheses</li>
                        <li>Clear button needs to be clicked twice</li>
                    </ul>
                    <h1>To-do</h1>
                    <ul>
                        <li>Add cursor functionality</li>
                        <li>Add button to replace expression with result</li>
                        <li>Add show/hide comma seperators in results (i.e. 1000 vs 1,000)</li>
                    </ul>
                    <ul>
                        <li>Add absolute function</li>
                        <li>Add trig functions</li>
                        <li>Add some calculus functions</li>
                        <li>Add number theory functions (mod, rounding, permutations, combinations)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Calculator;
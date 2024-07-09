import React, { useState, useEffect } from "react";
import "./index.css";
import ConfettiExplosion from "react-confetti-explosion";
import { evaluate } from "mathjs";

const MacCalculator = () => {
  const [displayValue, setDisplayValue] = useState("0");
  const [memory, setMemory] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [isRadians, setIsRadians] = useState(true);
  const [expression, setExpression] = useState("");
  const [switchbtn, setswitchbtn] = useState(true);

  useEffect(() => {
    if (confetti) {
      setTimeout(() => setConfetti(false), 3000);
    }
  }, [confetti]);

  const handleDigit = (digit) => {
    if (displayValue === "0") {
      setDisplayValue(digit);
    } else {
      setDisplayValue(displayValue + digit);
    }
    setExpression(expression + digit);
  };

  const handleOperator = (op) => {
    setDisplayValue(displayValue + op);
    setExpression(expression + op);
  };

  const calculateResult = () => {
    if (!expression) return null;

    try {
      const result = evaluate(expression);
      return result;
    } catch (error) {
      return null;
    }
  };

  const triggerConfetti = (expression) => {
    const numbers = expression.match(/(\d+(\.\d+)?)/g).map(Number);

    if (numbers.includes(2) && numbers.includes(6)) {
      setConfetti(true);
    }
  };

  const handleEquals = () => {
    triggerConfetti(expression);
  
    let result;
    if (expression.includes("√")) {
      // Handle y√x operation
      const [y, x] = expression.split("√").map((item) => parseFloat(evaluate(item)));
      result = Math.pow(x, 1 / y);
    } else {
      result = calculateResult();
    }
  
    if (result !== null) {
      setDisplayValue(result.toString());
      setExpression(result.toString());
    }
  };
  

  const handleClear = () => {
    setDisplayValue("0");
    setMemory(null);
    setExpression("");
  };

  const handleToggleSign = () => {
    setDisplayValue((parseFloat(displayValue) * -1).toString());
    setExpression(
      expression.slice(0, -displayValue.length) +
        (parseFloat(displayValue) * -1).toString()
    );
  };

  const handlePercentage = () => {
    let newValue;
    if (operator) {
      // If there is an operator, calculate the percentage based on the display value and the previous operand
      newValue = parseFloat(displayValue) * (parseFloat(expression.split(operator).pop()) || 1) / 100;
      setDisplayValue(newValue.toString());
      setExpression(expression + "%");
    } else {
      // If there is no operator, just calculate the percentage of the current display value
      newValue = parseFloat(displayValue/100);
      setDisplayValue(newValue.toString());
      setExpression(newValue.toString());
    }
  };
  

  const handleMemoryClear = () => {
    setMemory(null);
  };

  const handleMemoryAdd = () => {
    setMemory((prevMemory) =>
      prevMemory
        ? prevMemory + parseFloat(displayValue)
        : parseFloat(displayValue)
    );
  };

  const handleMemorySubtract = () => {
    setMemory((prevMemory) =>
      prevMemory
        ? prevMemory - parseFloat(displayValue)
        : -parseFloat(displayValue)
    );
  };

  const handleMemoryRecall = () => {
    if (memory !== null) {
      setDisplayValue(memory.toString());
      setExpression(memory.toString());
    }
  };

  const handleScientificFunction = (func) => {
    let result = parseFloat(displayValue);

    switch (func) {
      case "sinh":
        result = Math.sinh(result);
        break;
      case "cosh":
        result = Math.cosh(result);
        break;
      case "tanh":
        result = Math.tanh(result);
        break;
      case "sinh-1":
        result = Math.asinh(result);
        break;
      case "cosh-1":
        result = Math.acosh(result);
        break;
      case "tanh-1":
        result = Math.atanh(result);
        break;
      case "sin-1":
        result = isRadians
          ? Math.asin(result)
          : Math.asin(result) * (180 / Math.PI);
        break;
      case "cos-1":
        result = isRadians
          ? Math.acos(result)
          : Math.acos(result) * (180 / Math.PI);
        break;
      case "tan-1":
        result = isRadians
          ? Math.atan(result)
          : Math.atan(result) * (180 / Math.PI);
        break;
      case "π":
        result = Math.PI;
        break;
      case "Rand":
        result = Math.random();
        break;
      case "EE":
        result = parseFloat(displayValue).toExponential();
        break;
      case "sin":
        result = isRadians
          ? Math.sin(result)
          : Math.sin((result * Math.PI) / 180);
        break;
      case "cos":
        result = isRadians
          ? Math.cos(result)
          : Math.cos((result * Math.PI) / 180);
        break;
      case "tan":
        result = isRadians
          ? Math.tan(result)
          : Math.tan((result * Math.PI) / 180);
        break;
      case "2√x":
        result = Math.sqrt(result);
        break;
      case "3√x":
        result = Math.cbrt(result);
        break;
      case "x!":
        result = factorial(result);
        break;
      case "ln":
        result = Math.log(result);
        break;
      case "log10":
        result = Math.log10(result);
        break;
      case "e":
        result = Math.E;
        break;
      case "x2":
        result = Math.pow(result, 2);
        break;
      case "x3":
        result = Math.pow(result, 3);
        break;
      case "e^x":
        result = Math.exp(result);
        break;
      case "10^x":
        result = Math.pow(10, result);
        break;
      case "1/x":
        result = 1 / result;
        break;
      case "2nd":
        break;
      case "x^y":
        setExpression(expression + "^");
        setDisplayValue("");
        return;
      case "y√x":
        setExpression(expression + "√");
        setDisplayValue("");
        return;
      default:
        break;
    }

    setDisplayValue(result.toString());
    setExpression(result.toString());
  };

  const handleRadiansToggle = () => {
    setIsRadians(!isRadians);
  };

  const factorial = (n) => {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    let result = 1;
    for (let i = n; i > 1; i--) {
      result *= i;
    }
    return result;
  };

  const handleParenthesis = (type) => {
    if (type === "(") {
      setExpression(expression + "(");
      setDisplayValue(displayValue + "(");
    } else if (type === ")") {
      setExpression(expression + ")");
      setDisplayValue(displayValue + ")");
    }
  };

  return (
    <>
      <div className="mt-10 text-center font-bold bg-clip-text text-3xl text-transparent bg-gradient-to-r from-yellow-400 to-pink-800 sm:text-5xl">
        <h1>Confetti Calculator</h1>
      </div>
      <div className="meri relative bg-gray-700 w-3/4 mx-auto mt-10 rounded-lg border-2 border-gray-800 shadow-2xl">
        <div className="p-2">
          <div className="flex">
            <span className="flex w-3 h-3 me-2 bg-red-500 rounded-full"></span>
            <span className="flex w-3 h-3 me-2 bg-yellow-500 rounded-full"></span>
            <span className="flex w-3 h-3 me-2 bg-green-500 rounded-full"></span>
          </div>
          <div className="p-2 text-white flex text-5xl justify-end">
            <p>{displayValue}</p>
          </div>
        </div>
        {confetti && <ConfettiExplosion />}
        <div className="grid grid-cols-4 text-white gap-1 md:grid-cols-10">
          <button
            className="bg-gray-500 py-1.5 border-none rounded-none hidden md:block"
            onClick={() => handleParenthesis("(")}
          >
            (
          </button>
          <button
            className="bg-gray-500 border-none rounded-none hidden md:block"
            onClick={() => handleParenthesis(")")}
          >
            )
          </button>
          <button
            className="bg-gray-500 border-none rounded-none hidden md:block"
            onClick={handleMemoryClear}
          >
            Mc
          </button>
          <button
            className="bg-gray-500 border-none rounded-none hidden md:block"
            onClick={handleMemoryAdd}
          >
            M+
          </button>
          <button
            className="bg-gray-500 border-none rounded-none hidden md:block"
            onClick={handleMemorySubtract}
          >
            M-
          </button>
          <button
            className="bg-gray-500 border-none rounded-none hidden md:block"
            onClick={handleMemoryRecall}
          >
            mr
          </button>
          <button
            className="bg-gray-500 border-none rounded-none"
            onClick={handleClear}
          >
            C
          </button>
          <button
            className="bg-gray-500 border-none rounded-none"
            onClick={handleToggleSign}
          >
            +/-
          </button>
          <button
            className="bg-gray-500 border-none rounded-none"
            onClick={handlePercentage}
          >
            %
          </button>
          <button
            className="bg-orange-400 border-none rounded-none"
            onClick={() => handleOperator("/")}
          >
            /
          </button>
          <button
            className="bg-gray-500 border-none rounded-none hidden md:block"
            onClick={() => setswitchbtn((prev) => !prev)}
          >
            2nd
          </button>

          <button
            className="bg-gray-500 border-none rounded-none hidden md:block"
            onClick={() => handleScientificFunction("x2")}
          >
            x²
          </button>
          <button
            className="bg-gray-500 border-none rounded-none hidden md:block"
            onClick={() => handleScientificFunction("x3")}
          >
            x³
          </button>
          <button
            className="bg-gray-500 border-none rounded-none hidden md:block"
            onClick={() => handleScientificFunction("x^y")}
          >
            x^y
          </button>
          <button
            className="bg-gray-500 border-none rounded-none hidden md:block"
            onClick={() => handleScientificFunction("e^x")}
          >
            eˣ
          </button>
          <button
            className="bg-gray-500 border-none rounded-none hidden md:block"
            onClick={() => handleScientificFunction("10^x")}
          >
            10^x
          </button>
          <button
            className="bg-gray-400 py-1.5 border-none rounded-none"
            onClick={() => handleDigit("7")}
          >
            7
          </button>
          <button
            className="bg-gray-400 border-none rounded-none"
            onClick={() => handleDigit("8")}
          >
            8
          </button>
          <button
            className="bg-gray-400 border-none rounded-none"
            onClick={() => handleDigit("9")}
          >
            9
          </button>
          <button
            className="bg-orange-400 border-none rounded-none"
            onClick={() => handleOperator("*")}
          >
            x
          </button>
          <button
            className="bg-gray-500 border-none rounded-none hidden md:block"
            onClick={() => handleScientificFunction("1/x")}
          >
            1/x
          </button>
          <button
            className="bg-gray-500 border-none rounded-none hidden md:block"
            onClick={() => handleScientificFunction("2√x")}
          >
            2√x
          </button>
          <button
            className="bg-gray-500 py-1.5 border-none rounded-none hidden md:block"
            onClick={() => handleScientificFunction("3√x")}
          >
            3√x
          </button>
          <button
            className="bg-gray-500 border-none rounded-none hidden md:block"
            onClick={() => handleScientificFunction("y√x")}
          >
            y√x
          </button>
          <button
            className="bg-gray-500 border-none rounded-none hidden md:block"
            onClick={() => handleScientificFunction("ln")}
          >
            ln
          </button>
          <button
            className="bg-gray-500 border-none rounded-none hidden md:block"
            onClick={() => handleScientificFunction("log10")}
          >
            log10
          </button>
          <button
            className="bg-gray-400 border-none rounded-none"
            onClick={() => handleDigit("4")}
          >
            4
          </button>
          <button
            className="bg-gray-400 border-none rounded-none"
            onClick={() => handleDigit("5")}
          >
            5
          </button>
          <button
            className="bg-gray-400 border-none rounded-none"
            onClick={() => handleDigit("6")}
          >
            6
          </button>
          <button
            className="bg-orange-400 border-none rounded-none"
            onClick={() => handleOperator("-")}
          >
            -
          </button>
          <button
            className="bg-gray-500 border-none rounded-none hidden md:block"
            onClick={() => handleScientificFunction("x!")}
          >
            x!
          </button>

          {switchbtn ? (
            <button
              className="bg-gray-500 py-1.5 border-none rounded-none hidden md:block"
              onClick={() => handleScientificFunction("sin")}
            >
              sin
            </button>
          ) : (
            <button
              className="bg-gray-500 py-1.5 border-none rounded-none hidden md:block"
              onClick={() => handleScientificFunction("sin-1")}
            >
              sin-1
            </button>
          )}

          {switchbtn ? (
            <button
              className="bg-gray-500 border-none rounded-none hidden md:block"
              onClick={() => handleScientificFunction("cos")}
            >
              cos
            </button>
          ) : (
            <button
              className="bg-gray-500 border-none rounded-none hidden md:block"
              onClick={() => handleScientificFunction("cos-1")}
            >
              cos-1
            </button>
          )}

          {switchbtn ? (
            <button
              className="bg-gray-500 border-none rounded-none hidden md:block"
              onClick={() => handleScientificFunction("tan")}
            >
              tan
            </button>
          ) : (
            <button
              className="bg-gray-500 border-none rounded-none hidden md:block"
              onClick={() => handleScientificFunction("tan-1")}
            >
              tan-1
            </button>
          )}
          <button
            className="bg-gray-500 border-none rounded-none hidden md:block"
            onClick={() => handleScientificFunction("e")}
          >
            e
          </button>
          <button
            className="bg-gray-500 border-none rounded-none hidden md:block"
            onClick={() => handleScientificFunction("EE")}
          >
            EE
          </button>
          <button
            className="bg-gray-400 border-none rounded-none"
            onClick={() => handleDigit("1")}
          >
            1
          </button>
          <button
            className="bg-gray-400 border-none rounded-none"
            onClick={() => handleDigit("2")}
          >
            2
          </button>
          <button
            className="bg-gray-400 border-none rounded-none"
            onClick={() => handleDigit("3")}
          >
            3
          </button>
          <button
            className="bg-orange-400 border-none rounded-none"
            onClick={() => handleOperator("+")}
          >
            +
          </button>
          {isRadians ? (
            <button
              className="bg-gray-500 border-none rounded-none hidden md:block"
              onClick={handleRadiansToggle}
            >
              deg
            </button>
          ) : (
            <button
              className="bg-gray-500 border-none rounded-none hidden md:block"
              onClick={handleRadiansToggle}
            >
              rad
            </button>
          )}

          {switchbtn ? (
            <button
              className="bg-gray-500 py-1.5 border-none rounded-none hidden md:block"
              onClick={() => handleScientificFunction("sinh")}
            >
              sinh
            </button>
          ) : (
            <button
              className="bg-gray-500 py-1.5 border-none rounded-none hidden md:block"
              onClick={() => handleScientificFunction("sinh")}
            >
              sinh-1
            </button>
          )}

          {switchbtn ? (
            <button
              className="bg-gray-500 border-none rounded-none hidden md:block"
              onClick={() => handleScientificFunction("cosh")}
            >
              cosh
            </button>
          ) : (
            <button
              className="bg-gray-500 border-none rounded-none hidden md:block"
              onClick={() => handleScientificFunction("cosh-1")}
            >
              cosh-1
            </button>
          )}
          {switchbtn ? (
            <button
              className="bg-gray-500 border-none rounded-none hidden md:block"
              onClick={() => handleScientificFunction("tanh")}
            >
              tanh
            </button>
          ) : (
            <button
              className="bg-gray-500 border-none rounded-none hidden md:block"
              onClick={() => handleScientificFunction("tanh-1")}
            >
              tanh-1
            </button>
          )}
          <button
            className="bg-gray-500 border-none rounded-none hidden md:block"
            onClick={() => handleScientificFunction("π")}
          >
            π
          </button>
          <button
            className="bg-gray-500 border-none rounded-none hidden md:block"
            onClick={() => handleScientificFunction("Rand")}
          >
            Rand
          </button>
          <button
            className="bg-gray-400 border-none col-span-2 rounded-bl-md md:rounded-none rounded-none"
            onClick={() => handleDigit("0")}
          >
            0
          </button>
          <button
            className="bg-gray-400 border-none rounded-none"
            onClick={() => handleDigit(".")}
          >
            .
          </button>
          <button
            className="bg-orange-400 border-none rounded-br-md rounded-none"
            onClick={handleEquals}
          >
            =
          </button>
        </div>
      </div>
    </>
  );
};

export default MacCalculator;

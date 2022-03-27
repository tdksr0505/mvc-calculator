"use strict";
const OPERATOR = {
    PLUS: "+",
    MINUS: "-",
    MULTIPLE: "x",
    DEVIDE: "/",
    EQUAL: "=",
};
const NUM = {
    ZERO: "0",
    ONE: "1",
    TWO: "2",
    THREE: "3",
    FOUR: "4",
    FIVE: "5",
    SIX: "6",
    SEVEN: "7",
    EIGHT: "8",
    NINE: "9",
    DOT: ".",
};
const AC_BTN = "ac";
class View {
    constructor() {
        this.btnMap = new Map();
        this.roundDecimal = (val, precision) => {
            return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
        };
        this.ansArea = document.getElementsByClassName("ans-area")[0];
        this.formulaArea = document.getElementsByClassName("formula-area")[0];
        this.initBtn();
    }
    initBtn() {
        this.btnMap.set(OPERATOR.PLUS, document.getElementById("plus"));
        this.btnMap.set(OPERATOR.MINUS, document.getElementById("minus"));
        this.btnMap.set(OPERATOR.MULTIPLE, document.getElementById("multiple"));
        this.btnMap.set(OPERATOR.DEVIDE, document.getElementById("divide"));
        this.btnMap.set(OPERATOR.EQUAL, document.getElementById("equal"));
        this.btnMap.set(NUM.ZERO, document.getElementById("numBtn0"));
        this.btnMap.set(NUM.ONE, document.getElementById("numBtn1"));
        this.btnMap.set(NUM.TWO, document.getElementById("numBtn2"));
        this.btnMap.set(NUM.THREE, document.getElementById("numBtn3"));
        this.btnMap.set(NUM.FOUR, document.getElementById("numBtn4"));
        this.btnMap.set(NUM.FIVE, document.getElementById("numBtn5"));
        this.btnMap.set(NUM.SIX, document.getElementById("numBtn6"));
        this.btnMap.set(NUM.SEVEN, document.getElementById("numBtn7"));
        this.btnMap.set(NUM.EIGHT, document.getElementById("numBtn8"));
        this.btnMap.set(NUM.NINE, document.getElementById("numBtn9"));
        this.btnMap.set(NUM.DOT, document.getElementById("numBtnDot"));
        this.btnMap.set(AC_BTN, document.getElementById("acBtn"));
    }
    getBtn(operator) {
        return this.btnMap.get(operator);
    }
    getAnsAreaValue() {
        return this.ansArea.innerText;
    }
    updateAns(ans) {
        this.ansArea.innerText = this.roundDecimal(parseFloat(ans), 5).toString();
    }
    updateFormula(formula) {
        let str = formula.join('');
        this.formulaArea.innerText = str;
    }
    clearDisplay() {
        this.ansArea.innerText = '0';
        this.formulaArea.innerText = '';
    }
    clearAns() {
        this.ansArea.innerText = '0';
    }
    clearFormula() {
        this.formulaArea.innerText = '';
    }
}
class Model {
    plus(a, b) {
        return (parseFloat(a) + parseFloat(b)).toString();
    }
    minus(a, b) {
        return (parseFloat(a) - parseFloat(b)).toString();
    }
    multiple(a, b) {
        return (parseFloat(a) * parseFloat(b)).toString();
    }
    divide(a, b) {
        return (parseFloat(a) / parseFloat(b)).toString();
    }
    resetFormula(formula, firstIdx, secondIdx) {
        formula[firstIdx] = '';
        formula[secondIdx] = '';
        return formula.filter(e => e);
    }
    calculateAns(formula) {
        console.log('inp');
        console.log(formula);
        let i = 0;
        while (formula.length > 1) {
            let firstIdx = 0;
            let secondIdx = 0;
            let operatorIdx = 0;
            while (formula.length > 1) {
                i++;
                operatorIdx = formula.indexOf(OPERATOR.MULTIPLE);
                if (operatorIdx !== -1) {
                    firstIdx = operatorIdx - 1;
                    secondIdx = operatorIdx + 1;
                    formula[operatorIdx] = this.multiple(formula[firstIdx], formula[secondIdx]);
                    formula = this.resetFormula(formula, firstIdx, secondIdx);
                    break;
                }
                operatorIdx = formula.indexOf(OPERATOR.DEVIDE);
                if (operatorIdx !== -1) {
                    firstIdx = operatorIdx - 1;
                    secondIdx = operatorIdx + 1;
                    formula[operatorIdx] = this.divide(formula[firstIdx], formula[secondIdx]);
                    formula = this.resetFormula(formula, firstIdx, secondIdx);
                    break;
                }
                for (let i = 0; i < formula.length; i++) {
                    if (formula[i] === OPERATOR.PLUS) {
                        firstIdx = i - 1;
                        secondIdx = i + 1;
                        console.log(firstIdx);
                        console.log(secondIdx);
                        formula[i] = this.plus(formula[firstIdx], formula[secondIdx]);
                        console.log(formula);
                        formula = this.resetFormula(formula, firstIdx, secondIdx);
                        i = -1;
                        break;
                    }
                    if (formula[i] === OPERATOR.MINUS) {
                        firstIdx = i - 1;
                        secondIdx = i + 1;
                        formula[i] = this.minus(formula[firstIdx], formula[secondIdx]);
                        console.log(firstIdx);
                        console.log(secondIdx);
                        formula = this.resetFormula(formula, firstIdx, secondIdx);
                        i = -1;
                        break;
                    }
                }
                console.log(formula);
            }
            console.log(formula);
        }
        console.log(i);
        return formula[0];
    }
}
class Controller {
    constructor() {
        this.isLastOperator = false;
        this.model = new Model();
        this.view = new View();
        this.formula = [];
        this.tmpNum = '';
        this.registerBtn();
    }
    getFormula() {
        return this.formula;
    }
    registerBtn() {
        var _a;
        Object.values(NUM).forEach((num) => {
            var _a;
            (_a = this.view.getBtn(num)) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
                this.clickNum(num);
            });
        });
        Object.values(OPERATOR).forEach((operator) => {
            var _a;
            (_a = this.view.getBtn(operator)) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
                this.clickOperator(operator, this.view.getAnsAreaValue());
            });
        });
        (_a = this.view.getBtn(AC_BTN)) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            this.clickAc();
        });
    }
    clickNum(num) {
        if (num === NUM.DOT) {
            if (this.tmpNum.indexOf(NUM.DOT) !== -1 || this.tmpNum === '') {
                return;
            }
        }
        this.tmpNum += num;
        this.view.updateAns(this.tmpNum);
        this.isLastOperator = false;
    }
    clickOperator(operator, FirstNum) {
        console.log(this.formula);
        console.log(this.formula[this.formula.length - 1]);
        if (this.isLastOperator) {
            this.formula.pop();
        }
        else {
            this.formula.push(FirstNum);
            this.tmpNum = '';
        }
        // this.formula.push(FirstNum);
        // this.tmpNum = '';
        if (operator === OPERATOR.EQUAL) {
            this.view.updateFormula(this.formula);
            let ans = this.model.calculateAns(this.formula);
            this.view.updateAns(ans);
            this.formula = [];
        }
        else {
            this.isLastOperator = true;
            this.formula.push(operator);
            this.view.updateFormula(this.formula);
        }
    }
    clickAc() {
        this.formula = [];
        this.tmpNum = '';
        this.view.clearDisplay();
        this.isLastOperator = false;
    }
}
let controller = new Controller();

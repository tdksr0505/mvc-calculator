const OPERATOR = {
    PLUS:"+",
    MINUS:"-",
    MULTIPLE:"x",
    DEVIDE:"/",
    EQUAL:"=",
}
const NUM = {
    ZERO:"0",
    ONE:"1",
    TWO:"2",
    THREE:"3",
    FOUR:"4",
    FIVE:"5",
    SIX:"6",
    SEVEN:"7",
    EIGHT:"8",
    NINE:"9",
    DOT:".",
}

const AC_BTN = "ac"
class View {
    private formulaArea: HTMLDivElement;
    private ansArea: HTMLDivElement;

    private btnMap: Map<string, HTMLButtonElement> = new Map();
    constructor(){
        this.ansArea = <HTMLDivElement>document.getElementsByClassName("ans-area")[0];
        this.formulaArea = <HTMLDivElement>document.getElementsByClassName("formula-area")[0];
        this.initBtn();
    }
    private initBtn(){
        this.btnMap.set(OPERATOR.PLUS, <HTMLButtonElement>document.getElementById("plus"));
        this.btnMap.set(OPERATOR.MINUS, <HTMLButtonElement>document.getElementById("minus"));
        this.btnMap.set(OPERATOR.MULTIPLE, <HTMLButtonElement>document.getElementById("multiple"));
        this.btnMap.set(OPERATOR.DEVIDE, <HTMLButtonElement>document.getElementById("divide"));
        this.btnMap.set(OPERATOR.EQUAL, <HTMLButtonElement>document.getElementById("equal"));

        this.btnMap.set(NUM.ZERO, <HTMLButtonElement>document.getElementById("numBtn0"));
        this.btnMap.set(NUM.ONE, <HTMLButtonElement>document.getElementById("numBtn1"));
        this.btnMap.set(NUM.TWO, <HTMLButtonElement>document.getElementById("numBtn2"));
        this.btnMap.set(NUM.THREE, <HTMLButtonElement>document.getElementById("numBtn3"));
        this.btnMap.set(NUM.FOUR, <HTMLButtonElement>document.getElementById("numBtn4"));
        this.btnMap.set(NUM.FIVE, <HTMLButtonElement>document.getElementById("numBtn5"));
        this.btnMap.set(NUM.SIX, <HTMLButtonElement>document.getElementById("numBtn6"));
        this.btnMap.set(NUM.SEVEN, <HTMLButtonElement>document.getElementById("numBtn7"));
        this.btnMap.set(NUM.EIGHT, <HTMLButtonElement>document.getElementById("numBtn8"));
        this.btnMap.set(NUM.NINE, <HTMLButtonElement>document.getElementById("numBtn9"));
        this.btnMap.set(NUM.DOT, <HTMLButtonElement>document.getElementById("numBtnDot"));

        this.btnMap.set(AC_BTN, <HTMLButtonElement>document.getElementById("acBtn"));
    }
    public getBtn(operator: string){
        return this.btnMap.get(operator);
    }
    public getAnsAreaValue(){
        return this.ansArea.innerText;
    }
    public updateAns(ans: string): void{
        this.ansArea.innerText = this.roundDecimal(parseFloat(ans), 5).toString();
    }
    public updateFormula(formula: string[]): void{
        let str = formula.join('');
        this.formulaArea.innerText = str;
        
    }
    public clearDisplay(){
        this.ansArea.innerText = '0';
        this.formulaArea.innerText = '';
    }
    public clearAns(){
        this.ansArea.innerText = '0';
    }
    public clearFormula(){
        this.formulaArea.innerText = '';
    }

    public roundDecimal = (val: number, precision: number) => {
        return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
    }
}

class Model {
    private plus(a: string, b: string): string{
        return (parseFloat(a)+parseFloat(b)).toString();
    }
    private minus(a: string, b: string): string{
        return (parseFloat(a)-parseFloat(b)).toString();
    }
    private multiple(a: string, b: string): string{
        return (parseFloat(a)*parseFloat(b)).toString();
    }
    private divide(a: string, b: string): string{
        return (parseFloat(a)/parseFloat(b)).toString();
    }

    private resetFormula(formula: string[], firstIdx: number, secondIdx: number){
        formula[firstIdx] = '';
        formula[secondIdx] = '';
        return formula.filter(e => e);
    }
    public calculateAns(formula: string[]): string{
        console.log('inp');
        console.log(formula);
        let i =0;
        
        while(formula.length>1){
            let firstIdx = 0;
            let secondIdx = 0;
            let operatorIdx = 0
            while(formula.length>1){
                i++;
                operatorIdx = formula.indexOf(OPERATOR.MULTIPLE);
                if(operatorIdx !== -1){
                    firstIdx = operatorIdx - 1;
                    secondIdx = operatorIdx + 1;
                    formula[operatorIdx] = this.multiple(formula[firstIdx], formula[secondIdx]);
                    formula = this.resetFormula(formula, firstIdx, secondIdx);
                    break;
                }

                operatorIdx = formula.indexOf(OPERATOR.DEVIDE);
                if(operatorIdx !== -1){
                    firstIdx = operatorIdx - 1;
                    secondIdx = operatorIdx + 1;
                    formula[operatorIdx] = this.divide(formula[firstIdx], formula[secondIdx]);
                    formula = this.resetFormula(formula, firstIdx, secondIdx);
                    break;
                }


                for(let i=0 ; i< formula.length; i++){
                    if(formula[i]===OPERATOR.PLUS){
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
                    if(formula[i]===OPERATOR.MINUS){
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
    private model: Model;
    private view: View;
    private formula: string[];
    private tmpNum: string;
    private isLastOperator = false;

    constructor(){
        this.model = new Model();
        this.view = new View();
        this.formula = [];
        this.tmpNum = '';
        this.registerBtn();
    }
    public getFormula(){
        return this.formula;
    }
    private registerBtn(){
        Object.values(NUM).forEach((num)=>{
            this.view.getBtn(num)?.addEventListener("click", ()=>{
                this.clickNum(num);
            });
        });
        Object.values(OPERATOR).forEach((operator)=>{
            this.view.getBtn(operator)?.addEventListener("click", ()=>{
                this.clickOperator(operator, this.view.getAnsAreaValue())
            });
        });

        this.view.getBtn(AC_BTN)?.addEventListener("click", ()=>{
            this.clickAc();
        });
    }
    
    private clickNum(num: string): void{
        if(num===NUM.DOT){
            if(this.tmpNum.indexOf(NUM.DOT)!==-1 || this.tmpNum===''){
                return;
            }
        }
        this.tmpNum += num;
        this.view.updateAns(this.tmpNum);
        this.isLastOperator = false;

    }

    private clickOperator(operator: string, FirstNum: string): void{
        console.log(this.formula);
        console.log(this.formula[this.formula.length-1]);
        if(this.isLastOperator){
            this.formula.pop();
        }else{
            this.formula.push(FirstNum);
            this.tmpNum = '';        
        }
        // this.formula.push(FirstNum);
        // this.tmpNum = '';
        
        if(operator===OPERATOR.EQUAL){
            this.view.updateFormula(this.formula);
            let ans = this.model.calculateAns(this.formula);
            this.view.updateAns(ans);
            this.formula = [];
        }else{
            this.isLastOperator = true;
            this.formula.push(operator);
            this.view.updateFormula(this.formula);
        }
    }

    private clickAc(): void{
        this.formula = [];
        this.tmpNum = '';
        this.view.clearDisplay();
        this.isLastOperator = false;

    }
}
let controller = new Controller();

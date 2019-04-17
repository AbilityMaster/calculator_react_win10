import React, { Component } from 'react';
import '../../scss/st.scss';
import { OPERATIONS, MESSAGES, CALC_MODES, MAX_LENGTH_DISPLAY } from '../../const';
import HistoryDisplay from '../HistoryDisplay';
import Display from '../Display';
import ButtonArea from '../ButtonArea';

export default class Calculator extends Component {
    constructor() {
        super();
        this.state = { displayValue: '0', isDisabled: false };
        this.maxLength = MAX_LENGTH_DISPLAY;
    }

    clear = () => {
        //  if (this.operationsDisabled) {
        //	this.display.$display.style.fontSize = STYLES.NORMAL;
        //	this.toggleVisualStateButtons();
        // }

        this.setState({ displayValue: '0', isDisabled: false });
        this.operationsDisabled = false;
        this.isResultPressed = false;
        this.isOperationPressed = false;
        this.isNeedValueForProgressive = false;
        this.isNeedNewValueToDisplay = false;
        this.valueForProgressive = null;
        this.typeOperation = '';
        this.currentValue = null;
    }

    handleChangeValue = (displayValue) => {

        if (this.operationsDisabled) {
            this.operationsDisabled = false;
            //	this.display.clear();
            //	this.toggleVisualStateButtons();
            this.typeOperation = null;
        }

        //this.updateSmallDisplay();
        this.isEnteredNewValue = true;
        //this.display.$display.style.fontSize = STYLES.NORMAL;
        this.isPressedSingleOperation = false;

        if ((this.state.displayValue === '0' || (this.isNeedNewValueInDisplay) || (this.isResultPressed && this.state.displayValue !== '0.') || this.state.displayValue === MESSAGES.DIVIDE_BY_ZERO)) {
            this.setState({ displayValue: `${displayValue}` });
            this.isNeedNewValueInDisplay = false;
            this.isResultPressed = false;

            return;
        }

        if (this.state.displayValue === '0.' && !this.isNeedNewValueInDisplay) {
            this.setState(state => ({ displayValue: `${state.displayValue}${displayValue}` }));
            this.isResultPressed = false;

            return;
        }

        if (String(this.state.displayValue).length >= this.maxLength) {
            return;
        }

        this.setState(state => ({ displayValue: `${state.displayValue}${displayValue}` }));

    }

    checkException(operation, result) {

        switch (operation) {
            case OPERATIONS.POW:
            case OPERATIONS.PLUS:
            case OPERATIONS.MINUS:
            case OPERATIONS.MULTIPLY:
            case OPERATIONS.NEGATE: {
                if (!isFinite(result)) {
                    //	this.toggleVisualStateButtons();
                    //	this.display.$display.style.fontSize = STYLES.SMALL;
                    this.setState({ displayValue: MESSAGES.OVERFLOW });
                    this.operationsDisabled = true;
                }

                break;
            }
            case OPERATIONS.DIVIDE: {
                if (this.valueForProgressive === 0 || parseFloat(this.display.text) === 0) {
                    this.operationsDisabled = true;
                    //	this.toggleVisualStateButtons();
                    //	this.display.$display.style.fontSize = STYLES.SMALL;
                    this.setState({ displayValue: MESSAGES.DIVIDE_BY_ZERO });
                }

                break;
            }
            case OPERATIONS.FRAC: {
                if (parseFloat(this.state.displayValue) === 0) {
                    this.operationsDisabled = true;
                    //	this.toggleVisualStateButtons();
                    //	this.display.$display.style.fontSize = STYLES.SMALL;
                    this.setState({ displayValue: MESSAGES.DIVIDE_BY_ZERO });
                }

                break;
            }
            case OPERATIONS.SQRT: {
                if (parseFloat(this.state.displayValue) < 0) {
                    //	this.toggleVisualStateButtons();
                    this.setState({ isDisabled: true });
                    //	this.display.$display.style.fontSize = STYLES.SMALL;
                    this.setState({ displayValue: MESSAGES.UNCORRECT_DATA });
                    this.operationsDisabled = true;
                }

                break;
            }
            default: {
                console.log(MESSAGES.EXCEPTIONS);
                break;
            }
        }
    }

    trimmer = (temp) => {
        temp = temp.toPrecision(6);
        temp = parseFloat(temp);

        if (String(temp).length > this.maxLength) {
            temp = temp.toPrecision(6);
        }

        return temp;
    }

    sendResult = (operation, result) => {
        this.checkException(operation, result);

        if (!this.operationsDisabled) {
            this.setState({ displayValue: this.trimmer(result) });

        }

        if (operation !== OPERATIONS.PERCENT) {
            this.currentValue = this.trimmer(result);
        }
    };

    operation = (operation) => {
        if (this.operationsDisabled) {
            return;
        }

        this.isNeedValueForProgressive = true;
        this.isNeedNewValueInDisplay = true;
        //this.display.sendToSmallDisplay(OPERATIONS.LABEL_DEFAULT_OPERATION, operation, this.isPressedSingleOperation, this.isEnteredNewValue, this.isResultPressed);
        this.isResultPressed = false;
        this.isPressedSingleOperation = false;

        if (this.isOperationPressed) {
            if (this.isEnteredNewValue) {
                if (this.isResultPressed) {
                    this.currentValue = this.sendOperation(this.typeOperation, this.currentValue, this.valueForProgressive);
                    this.sendResult(operation, this.currentValue);
                } else {
                    this.currentValue = this.sendOperation(this.typeOperation, this.currentValue, parseFloat(this.state.displayValue));
                    this.sendResult(operation, this.currentValue);
                }
            }

            this.isEnteredNewValue = false;
            this.typeOperation = operation;

            return;
        }

        this.currentValue = parseFloat(this.state.displayValue);
        this.typeOperation = operation;
        this.isOperationPressed = true;
        this.isEnteredNewValue = false;
    };

    singleOperation = (operation) => {
        if (this.operationsDisabled || (operation === OPERATIONS.PERCENT && this.currentValue === null)) {
            return;
        }

        this.isNeedNewValueInDisplay = true;
        //this.display.sendToSmallDisplay(OPERATIONS.LABEL_SINGLE_OPERATION, operation, this.isPressedSingleOperation);
        this.isPressedSingleOperation = true;

        if (this.currentValue === null) {
            this.currentValue = parseFloat(this.state.displayValue);
        }

        let result = this.sendOperation(operation, parseFloat(this.state.displayValue));
        this.sendResult(operation, result);
    }

    result = () => {
        if (this.operationsDisabled || this.typeOperation === null) {
            return;
        }


        //this.display.SDclear();
        this.isResultPressed = true;

        if (this.isEnteredNewValue && !this.isOperationPressed) {
            this.currentValue = parseFloat(this.state.displayValue);
        }

        this.isEnteredNewValue = false;
        this.isPressedSingleOperation = false;
        this.isOperationPressed = false;

        if (this.isNeedValueForProgressive) {
            this.valueForProgressive = parseFloat(this.state.displayValue);
            this.isNeedValueForProgressive = false;
        }


        if (this.isResultPressed && this.currentValue !== null) {
            let result = this.sendOperation(this.typeOperation, this.currentValue, this.valueForProgressive);
            this.sendResult(this.typeOperation, result);
        }
    }

    sendOperation = (operation, first, second) => {
        switch (operation) {
            case OPERATIONS.PLUS: {
                return first + second;
            }
            case OPERATIONS.MINUS: {
                return first - second;
            }
            case OPERATIONS.MULTIPLY: {
                return first * second;
            }
            case OPERATIONS.DIVIDE: {
                return first / second;
            }
            case OPERATIONS.POW: {
                return Math.pow(first, 2);
            }
            case OPERATIONS.FRAC: {
                return 1 / first;
            }
            case OPERATIONS.SQRT: {
                return Math.sqrt(first);
            }
            case OPERATIONS.NEGATE: {
                return first * -1;
            }
            case OPERATIONS.PERCENT: {
                return parseFloat(first / 100 * second);
            }
            default: {
                console.log(MESSAGES.ERROR.OPERATIONS);

                break;
            }

        }
        console.log(this.currentValue + this.valueForProgressive);
        return parseFloat(this.currentValue) + parseFloat(this.valueForProgressive);
    }

    calculatorDragAndDrop = (e) => {
        let $calculator = document.querySelector('.calculator');

        let moveAt = (e) => {
            if ((e.pageX - shiftX + $calculator.clientWidth) > window.innerWidth) {
                $calculator.style.left = `${(window.innerWidth - $calculator.clientWidth) / window.innerWidth * 100}%`;
            } else {
                $calculator.style.left = `${(e.pageX - shiftX) / window.innerWidth * 100}%`;
            }

            if ((e.pageY - shiftY + $calculator.clientHeight) > window.innerHeight) {
                $calculator.style.top = `${(window.innerHeight - $calculator.clientHeight) / window.innerHeight * 100}%`;
            } else {
                $calculator.style.top = `${(e.pageY - shiftY) / window.innerHeight * 100}%`;
            }

            if ((e.pageY - shiftY) <= 0) {
                $calculator.style.top = 0;
            }

            if ((e.pageX - shiftX) <= 0) {
                $calculator.style.left = 0;
            }

            //	this.sendToLocalStorage.x = $calculator.style.left;
            //	this.sendToLocalStorage.y = $calculator.style.top;

            //	if (this.localStorage.dataset.mode === CALC_MODES.DEFAULT) {
            //	this.sendToLocalStorage.mode = CALC_MODES.STANDART;
            //	}

            //	this.localStorage.dataset = this.sendToLocalStorage;
        };

        $calculator.style.position = 'absolute';
        $calculator.style.bottom = 'auto';
        $calculator.style.right = 'auto';
        document.body.appendChild($calculator);
        //this.tagForInsert.innerHTML = '';
        let shiftX = e.pageX - $calculator.offsetLeft;
        let shiftY = e.pageY - $calculator.offsetTop;
        moveAt(e);
        $calculator.style.zIndex = 1000;

        document.onmousemove = function (e) {
            if (window.innerWidth < 350) {
                return false;
            }
            moveAt(e);
        };

        $calculator.onmouseup = () => {
            document.onmousemove = null;
            $calculator.onmouseup = null;
        };
    };

    calculatorDragStart = () => {
        return false;
    };

    addPoint = () => {
        if (this.operationsDisabled) {
            return;
        }

        //this.updateSmallDisplay();

        if (this.isResultPressed ||
            (this.state.displayValue.indexOf('.') === -1 && this.isNeedNewValueInDisplay) ||
            (this.state.displayValue.indexOf('.') === -1 && this.isResultPressed) ||
            (this.state.displayValue.indexOf('.') !== -1 && this.isNeedNewValueInDisplay) ||
            (this.state.displayValue.indexOf('.') !== -1 && this.isResultPressed)) {



            this.setState({ displayValue: '0.' });

            this.isNeedNewValueInDisplay = false;

            return;
        }

        if (this.state.displayValue.indexOf('.') === -1) {

            this.setState(state => ({ displayValue: `${state.displayValue}.` }));
        }
    }

    backspace = () => {
        if ((!this.operationsDisabled && this.isResultPressed) || this.isOperationPressed) {
            return;
        }

        this.operationsDisabled = false;

        if (this.state.displayValue.indexOf('e') !== -1 || this.isPressedSingleOperation) {
            return;
        }

        if ((this.state.displayValue.length === 2 && this.state.displayValue[0] === '-') || this.state.displayValue.length === 1) {
            this.setState({ displayValue: '0' });

            return;
        }

        if (this.state.displayValue === MESSAGES.DIVIDE_BY_ZERO || this.state.displayValue === MESSAGES.OVERFLOW || this.state.displayValue === MESSAGES.UNCORRECT_DATA) {
            //this.display.text = '';
            //this.display.$display.style.fontSize = STYLES.NORMAL;
            this.setState({ displayValue: '0' });
            //this.updateStateDisabledButtons();

            return;
        }

        this.setState((state) => ({
            displayValue: state.displayValue.slice(0, state.displayValue.length - 1)
        }));
    };

    reverse = () => {
        if (this.operationsDisabled || isNaN(parseFloat(this.state.displayValue))) {
            return;
        }

        this.isPressedSingleOperation = true;
        this.valueForProgressive = this.sendOperation(OPERATIONS.NEGATE, this.state.displayValue);

        if (this.state.displayValue === '0' || this.isResultPressed) {
            this.isEnteredNewValue = true;
            this.isNeedNewValueInDisplay = true;
            //this.display.sendToSmallDisplay(OPERATIONS.LABEL_SINGLE_OPERATION, OPERATIONS.NEGATE);
        }

        if (this.state.displayValue === '0') {
            return;
        }

        if (this.state.displayValue.indexOf('-') === -1) {
            this.setState((state) => ({ displayValue: `-${state.displayValue}` }));

            return;
        }

        this.setState((state) => ({ displayValue: state.displayValue.substr(1, state.displayValue.length - 1) }));
    }

    percent = () => {
        if (this.operationsDisabled || this.currentValue === null) {
            return;
        }


        let result = this.sendOperation(OPERATIONS.PERCENT, this.currentValue, parseFloat(this.state.displayValue));
        console.log(result);
        this.sendResult(OPERATIONS.PERCENT, result);
        //this.display.sendToSmallDisplay(OPERATIONS.PERCENT, OPERATIONS.PERCENT, this.isPressedSingleOperation);
        this.isPressedSingleOperation = true;
        this.isNeedNewValueInDisplay = true;
    }

    render() {
        const { displayValue } = this.state;
        const { isDisabled } = this.state;

        return (
            <div onDragStart={this.calculatorDragStart} className="calculator js-calculator">
                <div className="index-menu">
                    <p onMouseDown={this.calculatorDragAndDrop} className="index-menu__title js-index-menu__title">Калькулятор</p>
                    <div className="index-menu__button index-menu__button_trey js-index-menu__button_trey">–</div>
                    <div className="index-menu__button index-menu__button_open js-index-menu__button_open">☐</div>
                    <div className="index-menu__button index-menu__button_close js-index-menu__button_close">✕</div>
                </div>
                <div className="option-menu js-option-menu">
                    <div className="option-menu__btn-menu">☰</div>
                    <p className="option-menu__title">Обычный</p>
                    <div className="option-menu__btn-journal"></div>
                </div>
                <HistoryDisplay />
                <Display value={displayValue} />
                <ButtonArea updateDisplayValue={this.handleChangeValue}
                    operation={this.operation}
                    result={this.result}
                    clear={this.clear}
                    addPoint={this.addPoint}
                    backspace={this.backspace}
                    reverse={this.reverse}
                    percent={this.percent}
                    singleOperation={this.singleOperation}
                    isDisabled = { isDisabled }
                />
            </div>
        )
    }
}

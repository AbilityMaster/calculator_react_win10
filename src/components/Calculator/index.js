import React, { Component } from 'react';
import '../../scss/st.scss';
import { OPERATIONS, MESSAGES, STYLES, MAX_WIDTH_DISPLAY, CALC_MODES, MAX_LENGTH_DISPLAY, NAME_FOR_DISPLAY } from '../../const';
import HistoryDisplay from '../HistoryDisplay';
import Display from '../Display';
import ButtonArea from '../ButtonArea';
import LocalStorage from '../localStorage';
import projectInfo from '../../../package.json';
import Memory from '../Memory';

export default class Calculator extends Component {
    constructor() {
        super();
        this.NAME = projectInfo.name;
        this.VERSION = projectInfo.version;
        this.localStorage = new LocalStorage(this.VERSION, this.NAME);
        this.memory = new Memory();
        this.state = { displayValue: '0', isDisabled: false, displayHistoryValue: '', displayHiddenHistoryvalue: '', mode: CALC_MODES.DEFAULT };
        this.maxLength = MAX_LENGTH_DISPLAY;
        this.values = [];
        this.smallDisplay = React.createRef();
        this.historyDisplay = React.createRef();
        this.display = React.createRef();
        this.$calculator = React.createRef();
        this.stateSettings = {};
        this.styleSettings = {};
    }

    clear = () => {
        if (this.operationsDisabled) {
            this.display.current.$display.current.style.fontSize = STYLES.NORMAL;
            this.toggleVisualStateButtons();
        }

        this.setState({ displayValue: '0', isDisabled: false, displayHistoryValue: '', displayHiddenHistoryvalue: '' });
        this.values = [];
        this.historyDisplay.current.$hiddenDisplay.current.style.width = '';
        this.historyDisplay.current.$smallDisplay.current.style.width = '';
        this.historyDisplay.current.$buttonMoveLeft.current.style.visibility = 'hidden';
        this.historyDisplay.current.$buttonMoveRight.current.style.visibility = 'hidden';
        this.operationsDisabled = false;
        this.isResultPressed = false;
        this.isOperationPressed = false;
        this.isNeedValueForProgressive = false;
        this.isNeedNewValueToDisplay = false;
        this.valueForProgressive = null;
        this.typeOperation = '';
        this.currentValue = null;

        this.test = '';
    }

    SDclear = () => {
        this.setState({ displayHistoryValue: '' });
        this.values = [];
        
        if ((this.historyDisplay.current.$smallDisplay.current.clientWidth) >= MAX_WIDTH_DISPLAY) {
            this.historyDisplay.current.$buttonMoveLeft.current.style.visibility = 'hidden';
            this.historyDisplay.current.$buttonMoveRight.current.style.visibility = 'hidden';
            this.historyDisplay.current.$smallDisplay.current.style.left = '';
            this.historyDisplay.current.$smallDisplay.current.style.width = '';
        }
    }

    SDclearLastValue = () => {
        this.setState({ displayHistoryValue: '' });
        this.values.pop();
        for (let i = 0; i < this.values.length; i++) {
            this.setState(state => ({
                displayHiddenHistoryvalue: state.displayHiddenHistoryvalue + this.values[i],
                displayHistoryValue: state.displayHistoryValue + this.values[i],
            }))
        }
    }

    updateWitdhDisplay = (type, isPressedSingleOperation, temp) => {
        if (type === OPERATIONS.LABEL_DEFAULT_OPERATION && !isPressedSingleOperation) {
            this.setState({ displayHiddenHistoryvalue: `${this.values[this.values.length - 2]}${this.values[this.values.length - 1]}` });
        } else {
            this.setState({ displayHiddenHistoryvalue: this.values[this.values.length - 1] });
        }

        if (temp) {
            this.setState({ displayHiddenHistoryvalue: this.variableForSingleOperationGetWidth });
        }

        let width = this.historyDisplay.current.$smallDisplay.current.clientWidth;

        if (this.values.length === 1) {
            width = 0;
        }

        if ((width + this.historyDisplay.current.$hiddenDisplay.current.clientWidth) >= MAX_WIDTH_DISPLAY) {
            this.historyDisplay.current.$buttonMoveLeft.current.style.visibility = 'visible';
            this.historyDisplay.current.$buttonMoveRight.current.style.visibility = 'visible';
            this.historyDisplay.current.$smallDisplay.current.style.left = '';
            this.historyDisplay.current.$smallDisplay.current.style.width = width + this.historyDisplay.current.$hiddenDisplay.current.clientWidth + 'px';
        }
    }

    updateSmallDisplay = () => {
        if (this.isPressedSingleOperation && !this.isOperationPressed) {
            this.SDclear();
        }

        if (this.isPressedSingleOperation && this.isOperationPressed) {
            this.SDclearLastValue();
        }
    }

    formatText = (data) => {
        if (String(data).indexOf(',') === -1 && String(data).indexOf('.') === -1 && !isNaN(data)) {
            let formatter = new Intl.NumberFormat('ru');
            return formatter.format(data);
        }

        return data;
    }

    getTextDisplay = () => {
        let data = this.formatText(this.state.displayValue);

        data = data.replace(/\&nbsp\;/g, "\xa0");
        data = data.replace(/\s+/g, '');
        data = data.replace(',', '.');

        return data;
    }

    handleChangeValue = (displayValue) => {
        if (this.operationsDisabled) {
            this.operationsDisabled = false;
            this.clear();
            this.toggleVisualStateButtons();
            this.typeOperation = null;
        }

        this.updateSmallDisplay();
        this.isEnteredNewValue = true;
        this.display.current.$display.current.style.fontSize = STYLES.NORMAL;
        this.isPressedSingleOperation = false;

        if ((this.state.displayValue === '0' || (this.isNeedNewValueInDisplay) || (this.isResultPressed && this.state.displayValue !== '0.') || this.state.displayValue === MESSAGES.DIVIDE_BY_ZERO)) {
            this.setState({ displayValue: `${this.formatText(displayValue)}` });
            this.isNeedNewValueInDisplay = false;
            this.isResultPressed = false;

            return;
        }

        if (this.state.displayValue === '0.' && !this.isNeedNewValueInDisplay) {
            this.setState(state => ({ displayValue: this.formatText(`${this.getTextDisplay()}${displayValue}`) }));
            this.isResultPressed = false;

            return;
        }

        if (String(this.state.displayValue).length >= this.maxLength) {
            return;
        }

        this.setState(() => ({ displayValue: this.formatText(`${this.getTextDisplay()}${displayValue}`) }));
    }

    checkException(operation, result) {
        switch (operation) {
            case OPERATIONS.POW:
            case OPERATIONS.PLUS:
            case OPERATIONS.MINUS:
            case OPERATIONS.MULTIPLY:
            case OPERATIONS.NEGATE: {
                if (!isFinite(result)) {
                    this.toggleVisualStateButtons();
                    this.display.current.$display.current.style.fontSize = STYLES.SMALL;
                    this.setState({ isDisabled: true });
                    this.setState({ displayValue: MESSAGES.OVERFLOW });
                    this.operationsDisabled = true;
                }

                break;
            }
            case OPERATIONS.DIVIDE: {
                if (this.valueForProgressive === 0 || parseFloat(this.display.text) === 0) {
                    this.operationsDisabled = true;
                    this.toggleVisualStateButtons();
                    this.display.current.$display.current.style.fontSize = STYLES.SMALL;
                    this.setState({ isDisabled: true });
                    this.setState({ displayValue: MESSAGES.DIVIDE_BY_ZERO });
                }

                break;
            }
            case OPERATIONS.FRAC: {
                if (parseFloat(this.state.displayValue) === 0) {
                    this.operationsDisabled = true;
                    this.toggleVisualStateButtons();
                    this.display.current.$display.current.style.fontSize = STYLES.SMALL;
                    this.setState({ isDisabled: true });
                    this.setState({ displayValue: MESSAGES.DIVIDE_BY_ZERO });
                }

                break;
            }
            case OPERATIONS.SQRT: {
                if (parseFloat(this.state.displayValue) < 0) {
                    this.toggleVisualStateButtons();
                    this.setState({ isDisabled: true });
                    this.display.current.$display.current.style.fontSize = STYLES.SMALL;
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
        if (String(temp).indexOf('.') !== -1 && temp > 1) {
            temp = temp.toPrecision(6);
        }
        temp = parseFloat(temp);

        if (String(temp).length > this.maxLength) {
            temp = temp.toPrecision(6);
        }

        return temp;
    }

    sendResult = (operation, result) => {
        this.checkException(operation, result);

        if (!this.operationsDisabled) {
            this.setState({
                displayValue: this.formatText(this.trimmer(result))
            });
        }

        if ((operation !== OPERATIONS.PERCENT) && (operation !== OPERATIONS.POW) &&
            (operation !== OPERATIONS.FRAC) && (operation !== OPERATIONS.SQRT)) {
            this.currentValue = this.trimmer(result);
        }
    };

    operation = (operation) => {
        if (this.operationsDisabled) {
            return;
        }

        this.isNeedValueForProgressive = true;
        this.isNeedNewValueInDisplay = true;
        this.sendToSmallDisplay(OPERATIONS.LABEL_DEFAULT_OPERATION, operation, this.isPressedSingleOperation, this.isEnteredNewValue, this.isResultPressed);
        this.isResultPressed = false;
        this.isPressedSingleOperation = false;

        if (this.isOperationPressed) {
            if (this.isEnteredNewValue) {
                if (this.isResultPressed) {
                    this.currentValue = this.sendOperation(this.typeOperation, this.currentValue, this.valueForProgressive);
                    this.sendResult(operation, this.currentValue);
                } else {
                    this.currentValue = this.sendOperation(this.typeOperation, this.currentValue, parseFloat(this.getTextDisplay()));
                    this.sendResult(operation, this.currentValue);
                }
            }

            this.isEnteredNewValue = false;
            this.typeOperation = operation;

            return;
        }

        this.currentValue = parseFloat(this.getTextDisplay());
        this.typeOperation = operation;
        this.isOperationPressed = true;
        this.isEnteredNewValue = false;
    };

    singleOperation = (operation) => {
        if (this.operationsDisabled || (operation === OPERATIONS.PERCENT && this.currentValue === null)) {
            return;
        }

        this.isNeedNewValueInDisplay = true;
        this.sendToSmallDisplay(OPERATIONS.LABEL_SINGLE_OPERATION, operation, this.isPressedSingleOperation);
        this.isPressedSingleOperation = true;

        if (this.currentValue === null) {
            this.currentValue = parseFloat(this.getTextDisplay());
        }

        let result = this.sendOperation(operation, parseFloat(this.getTextDisplay()));
        this.sendResult(operation, result);
    }

    result = () => {
        if (this.operationsDisabled || this.typeOperation === null) {
            return;
        }

        this.SDclear();
        this.isResultPressed = true;

        if (this.isEnteredNewValue && !this.isOperationPressed) {
            this.currentValue = parseFloat(this.getTextDisplay());
        }

        this.isEnteredNewValue = false;
        this.isPressedSingleOperation = false;
        this.isOperationPressed = false;

        if (this.isNeedValueForProgressive) {
            this.valueForProgressive = parseFloat(this.getTextDisplay());
            
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
    }

    sendData() {
        this.setState({ displayHistoryValue: '' })
        for (let i = 0; i < this.values.length; i++) {
            this.setState(state => ({ displayHistoryValue: state.displayHistoryValue + this.values[i] }));
        }
    }

    updateWitdhDisplay = (type, isPressedSingleOperation, temp) => {
        if (type === OPERATIONS.LABEL_SINGLE_OPERATION  && this.typeOperation === undefined) {
            this.setState({ displayHiddenHistoryvalue:  this.variableForSingleOperationGetWidth });
        }

        if (type === OPERATIONS.LABEL_DEFAULT_OPERATION && !isPressedSingleOperation) {            
            this.setState({ displayHiddenHistoryvalue: `${this.values[this.values.length - 2]}${this.values[this.values.length - 1]}` });
        }

        if (type === OPERATIONS.LABEL_SINGLE_OPERATION  && this.typeOperation !== undefined) {
           this.setState({ displayHiddenHistoryvalue: this.variableForSingleOperationGetWidth });
        }

        let width = this.historyDisplay.current.$smallDisplay.current.clientWidth;

        if ((this.values.length === 1) && type !== OPERATIONS.LABEL_SINGLE_OPERATION ) {
            width = 0;
        }

        if ((width + this.historyDisplay.current.$hiddenDisplay.current.clientWidth) >= MAX_WIDTH_DISPLAY) {
            this.historyDisplay.current.$buttonMoveLeft.current.style.visibility = 'visible';
            this.historyDisplay.current.$buttonMoveRight.current.style.visibility = 'visible';
            this.historyDisplay.current.$smallDisplay.current.style.left = '';
            this.historyDisplay.current.$smallDisplay.current.style.width = width + this.historyDisplay.current.$hiddenDisplay.current.clientWidth + 'px';
        }
    }

    sendToSmallDisplay = (type, operation, isPressedSingleOperation, isEnteredNewValue, isResultPressed) => {
        this.historyDisplay.current.$smallDisplay.current.style.removeProperty('left');
        this.historyDisplay.current.$smallDisplay.current.style.right = 0;
        this.historyDisplay.current.$smallDisplay.current.style.textAlign = 'right';

        switch (type) {
            case OPERATIONS.PERCENT: {
                if (!isPressedSingleOperation) {
                    this.values.push(parseFloat(this.getTextDisplay()));
                    this.updateWitdhDisplay(type, isPressedSingleOperation);
                    this.sendData();

                    return;
                }

                this.values[this.values.length - 1] = parseFloat(this.getTextDisplay());
                this.updateWitdhDisplay(type, isPressedSingleOperation);
                this.sendData();

                break;
            }
            case OPERATIONS.LABEL_SINGLE_OPERATION: {
                if (!isPressedSingleOperation) {
                    this.values.push(`${NAME_FOR_DISPLAY[operation]}(${this.getTextDisplay()})`);
                    this.variableForSingleOperationGetWidth = this.values[this.values.length - 1];
                    this.updateWitdhDisplay(type, isPressedSingleOperation);
                    this.sendData();

                    return;
                }

                this.values[this.values.length - 1] = `${NAME_FOR_DISPLAY[operation]}(${this.values[this.values.length - 1]})`;
                this.updateWitdhDisplay(type, isPressedSingleOperation, this.variableForSingleOperationGetWidth);
                this.sendData();

                break;
            }
            case OPERATIONS.LABEL_DEFAULT_OPERATION: {
                if (isPressedSingleOperation) {
                    this.values.push(` ${operation} `);
                    this.updateWitdhDisplay(type, isPressedSingleOperation);
                    this.sendData();

                    return;
                }

                if (isEnteredNewValue || isResultPressed) {
                    this.values.push(parseFloat(this.getTextDisplay()));
                    this.values.push(` ${operation} `);
                    this.updateWitdhDisplay(type, isPressedSingleOperation);
                    this.sendData();

                    return;
                }

                this.values[this.values.length - 1] = ` ${operation} `;
                this.updateWitdhDisplay(type, isPressedSingleOperation);
                this.sendData();

                break;
            }
            default:
                console.log(MESSAGES.ERROR.SMALL_DISPLAY);
                break;
        }
    }

    calculatorDragAndDrop = (e) => {
        let moveAt = (e) => {
            if ((e.pageX - shiftX + this.$calculator.current.clientWidth) > window.innerWidth) {
                this.$calculator.current.style.left = `${(window.innerWidth - this.$calculator.current.clientWidth) / window.innerWidth * 100}%`;
            } else {
                this.$calculator.current.style.left = `${(e.pageX - shiftX) / window.innerWidth * 100}%`;
            }

            if ((e.pageY - shiftY + this.$calculator.current.clientHeight) > window.innerHeight) {
                this.$calculator.current.style.top = `${(window.innerHeight - this.$calculator.current.clientHeight) / window.innerHeight * 100}%`;
            } else {
                this.$calculator.current.style.top = `${(e.pageY - shiftY) / window.innerHeight * 100}%`;
            }

            if ((e.pageY - shiftY) <= 0) {
                this.$calculator.current.style.top = 0;
            }

            if ((e.pageX - shiftX) <= 0) {
                this.$calculator.current.style.left = 0;
            }

            this.stateSettings.x = this.$calculator.current.style.left;
            this.stateSettings.y = this.$calculator.current.style.top;

            if (this.localStorage.dataset.mode === CALC_MODES.DEFAULT) {
                this.stateSettings.mode = CALC_MODES.STANDART;
            }

            this.localStorage.dataset = this.stateSettings;
        };

        this.$calculator.current.style.position = 'absolute';
        this.$calculator.current.style.bottom = 'auto';
        this.$calculator.current.style.right = 'auto';
        document.body.appendChild(this.$calculator.current);
        //this.tagForInsert.innerHTML = '';
        let shiftX = e.pageX -   this.$calculator.current.offsetLeft;
        let shiftY = e.pageY -   this.$calculator.current.offsetTop;
        moveAt(e);
          this.$calculator.current.style.zIndex = 1000;

        document.onmousemove = function (e) {
            if (window.innerWidth < 350) {
                return false;
            }
            moveAt(e);
        };

          this.$calculator.current.onmouseup = () => {
            document.onmousemove = null;
              this.$calculator.current.onmouseup = null;
        };
    };

    calculatorDragStart = () => {
        return false;
    };

    addPoint = () => {
        if (this.operationsDisabled) {
            return;
        }

        this.updateSmallDisplay();

        if (this.isResultPressed ||
            (this.getTextDisplay().indexOf('.') === -1 && this.isNeedNewValueInDisplay) ||
            (this.getTextDisplay().indexOf('.') === -1 && this.isResultPressed) ||
            (this.getTextDisplay().indexOf('.') !== -1 && this.isNeedNewValueInDisplay) ||
            (this.getTextDisplay().indexOf('.') !== -1 && this.isResultPressed)) {



            this.setState({ displayValue: '0.' });

            this.isNeedNewValueInDisplay = false;

            return;
        }

        if (this.getTextDisplay().indexOf('.') === -1) {

            this.setState(state => ({ displayValue: `${state.displayValue}.` }));
        }
    }

    backspace = () => {
        if ((!this.operationsDisabled && this.isResultPressed) || this.isOperationPressed) {
            return;
        }

        this.operationsDisabled = false;

        if (this.getTextDisplay().indexOf('e') !== -1 || this.isPressedSingleOperation) {
            return;
        }

        if ((this.getTextDisplay().length === 2 && this.getTextDisplay()[0] === '-') || this.state.displayValue.length === 1) {
            this.setState({ displayValue: '0' });

            return;
        }

        if (this.getTextDisplay() === MESSAGES.DIVIDE_BY_ZERO || this.getTextDisplay() === MESSAGES.OVERFLOW || this.getTextDisplay() === MESSAGES.UNCORRECT_DATA) {
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
        if (this.operationsDisabled || isNaN(parseFloat(this.getTextDisplay()))) {
            return;
        }

        this.isPressedSingleOperation = true;
        this.valueForProgressive = this.sendOperation(OPERATIONS.NEGATE, this.getTextDisplay());

        if (this.getTextDisplay() === '0' || this.isResultPressed) {
            this.isEnteredNewValue = true;
            this.isNeedNewValueInDisplay = true;
            //this.display.sendToSmallDisplay(OPERATIONS.LABEL_SINGLE_OPERATION, OPERATIONS.NEGATE);
        }

        if (this.getTextDisplay() === '0') {
            return;
        }

        if (this.getTextDisplay().indexOf('-') === -1) {
            this.setState((state) => ({ displayValue: `-${state.displayValue}` }));

            return;
        }

        this.setState((state) => ({ displayValue: state.displayValue.substr(1, state.displayValue.length - 1) }));
    }

    percent = () => {
        if (this.operationsDisabled || this.currentValue === null) {
            return;
        }


        let result = this.sendOperation(OPERATIONS.PERCENT, this.currentValue, parseFloat(this.getTextDisplay()));
        console.log(result);
        this.sendResult(OPERATIONS.PERCENT, result);
        //this.display.sendToSmallDisplay(OPERATIONS.PERCENT, OPERATIONS.PERCENT, this.isPressedSingleOperation);
        this.isPressedSingleOperation = true;
        this.isNeedNewValueInDisplay = true;
    }

    toggleVisualStateButtons = () => {
        this.setState({ isDisabled: false });
    }

    loadPosition() {
        this.defaultSettings = {
            mode: CALC_MODES.DEFAULT,
            x: `${(window.innerWidth - 320) / window.innerWidth * 100}%`,
            y: `${(window.innerHeight - 540) / window.innerHeight * 100}%`
        };

        let storage = this.localStorage.dataset;

        if (!storage) {
            // this.stateSettings = this.stateSettings;
            this.localStorage.dataset = this.defaultSettings;
        }

        for (let key in storage.memoryValues) {
            if (!storage.memoryValues.hasOwnProperty(key)) {
                continue;
            }

            //this.memory.addToMemory(storage.memoryValues[key]);
        }

        /*      if (storage.isActivatedMemoryButtons) {
                  this.memory.setVisual();
              } else {
                  this.memory.setDisabled();
              }
      
      */
        this.stateSettings.x = storage.x ? storage.x : this.defaultSettings.x;
        this.stateSettings.y = storage.y ? storage.y : this.defaultSettings.y;
        this.manage(storage.mode);
    }

    manage = (mode) => {
        switch (mode) {
            case CALC_MODES.STANDART: {
                this.styleSettings.optionMenu = 'flex';
                this.styleSettings.groupSmallDisplay = 'flex';
                this.styleSettings.display = 'block';
                this.styleSettings.buttonArea = 'block';
                this.styleSettings.calculatorHeight = '540px';

                break;
            }
            case CALC_MODES.MINIMIZED: {
                this.styleSettings.optionMenu = 'none';
                this.styleSettings.groupSmallDisplay = 'none';
                this.styleSettings.display = 'none';
                this.styleSettings.buttonArea = 'none';
                this.styleSettings.calculatorHeight = '32px';
                this.styleSettings.calculatorBottom = 'auto';

                break;
            }
            case CALC_MODES.CLOSED: {
                this.styleSettings.openCalcDisplay = 'block';
                this.styleSettings.calculatorDisplay = 'none';

                break;
            }
            case CALC_MODES.DEFAULT: {
                this.styleSettings.openCalcDisplay = 'none';
                this.styleSettings.optionMenu = 'flex';
                this.styleSettings.groupSmallDisplay = 'flex';
                this.styleSettings.display = 'block';
                this.styleSettings.buttonArea = 'block';
                this.styleSettings.calculatorHeight = '540px';
                this.styleSettings.calculatorDisplay = 'block'
                this.stateSettings.x = this.defaultSettings.x;
                this.stateSettings.y = this.defaultSettings.y;

                break;
            }
            default: {
                console.log(MESSAGES.ERROR.MODES);

                break;
            }
        }
    }

    buttonTrey = () => {
        this.setState({ mode: CALC_MODES.MINIMIZED });
        this.stateSettings.mode = CALC_MODES.MINIMIZED;
        this.localStorage.dataset = this.stateSettings;
        this.manage(CALC_MODES.MINIMIZED);
    };

    buttonOpen = () => {
        this.setState({ mode: CALC_MODES.STANDART });
        this.stateSettings.mode = CALC_MODES.STANDART;
        this.localStorage.dataset = this.stateSettings;
        this.manage(CALC_MODES.STANDART);
    };

    buttonClose = () => {
        this.setState({ mode: CALC_MODES.CLOSED });
        this.manage(CALC_MODES.CLOSED);
        this.stateSettings.mode = CALC_MODES.CLOSED;
        this.localStorage.dataset = this.stateSettings;
    };

    buttonOpenCalculator = () => {
        this.setState({ mode: CALC_MODES.DEFAULT });
        this.manage(CALC_MODES.DEFAULT);
        this.stateSettings.mode = CALC_MODES.DEFAULT;
        this.localStorage.dataset = this.stateSettings;
    };

    memoryPlus() {
        if (this.isOpenMemoryWindow || !isFinite(parseFloat(this.calc.getDisplayData()))) {
            return;
        }

        this.isActivatedMemoryButtons = true;
        this.storageMemoryData.isActivatedMemoryButtons = this.isActivatedMemoryButtons;
        this.calc.updateLSData(this.storageMemoryData);

        this.$buttonMemoryRead.classList.remove('calc-add__button_disabled');
        this.$buttonMemoryClear.classList.remove('calc-add__button_disabled');
        this.$buttonMemoryOpen.classList.remove('calc-add__button_disabled');

        if (this.isEmpty()) {
            this.addToMemory(this.calc.getDisplayData());
        } else {
            let memoryBlock = document.querySelector('.memory__block');

            let value = memoryBlock.childNodes[0].innerHTML;
            let displayValue = this.calc.getDisplayData();
            let position = memoryBlock.dataset.position;

            this.plus(value, displayValue, position);

            memoryBlock.childNodes[0].innerHTML = this.memoryValues[position];
        }

        this.storageMemoryData.memoryValues = this.memoryValues;
        this.calc.updateLSData(this.storageMemoryData);
    }

    render() {
        const { displayValue } = this.state;
        const { isDisabled } = this.state;
        const { displayHistoryValue } = this.state;
        const { displayHiddenHistoryvalue } = this.state;

        this.loadPosition();

        return (
            <React.Fragment>
                <div onClick={this.buttonOpenCalculator} style={{ 'display': this.styleSettings.openCalcDisplay }} className="open-calculator js-open-calculator">Open calc</div>
                <div ref={this.$calculator} onDragStart={this.calculatorDragStart} className="calculator js-calculator" style={{
                    'left': this.stateSettings.x,
                    'top': this.stateSettings.y,
                    'height': this.styleSettings.calculatorHeight,
                    'bottom': this.styleSettings.calculatorBottom,
                    'display': this.styleSettings.calculatorDisplay
                }}>
                    <div className="index-menu">
                        <p onMouseDown={this.calculatorDragAndDrop} className="index-menu__title js-index-menu__title">Калькулятор</p>
                        <div onClick={this.buttonTrey} className="index-menu__button index-menu__button_trey js-index-menu__button_trey">–</div>
                        <div onClick={this.buttonOpen} className="index-menu__button index-menu__button_open js-index-menu__button_open">☐</div>
                        <div onClick={this.buttonClose} className="index-menu__button index-menu__button_close js-index-menu__button_close">✕</div>
                    </div>
                    <div style={{ 'display': this.styleSettings.optionMenu }} className="option-menu js-option-menu">
                        <div className="option-menu__btn-menu">☰</div>
                        <p className="option-menu__title">Обычный</p>
                        <div className="option-menu__btn-journal"></div>
                    </div>
                    <HistoryDisplay ref={this.historyDisplay} styleSettings={this.styleSettings.groupSmallDisplay} value={displayHistoryValue} displayHiddenHistoryvalue={displayHiddenHistoryvalue} />
                    <Display ref={this.display} styleDisplay={this.styleSettings.display} value={displayValue} />
                    <ButtonArea ref={this.buttonArea} styleDisplay={this.styleSettings.buttonArea}
                        updateDisplayValue={this.handleChangeValue}
                        operation={this.operation}
                        result={this.result}
                        clear={this.clear}
                        addPoint={this.addPoint}
                        backspace={this.backspace}
                        reverse={this.reverse}
                        percent={this.percent}
                        singleOperation={this.singleOperation}
                        isDisabled={isDisabled}
                        memoryPlus={this.memoryPlus}
                    />
                </div>
            </React.Fragment>
        )
    }
}

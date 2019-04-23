import React, { Component } from 'react';
import '../../scss/st.scss';
import { OPERATIONS, MESSAGES, STYLES, CALC_MODES, MAX_LENGTH_DISPLAY, NAME_FOR_DISPLAY } from '../../const';
import HistoryDisplay from '../HistoryDisplay';
import Display from '../Display';
import Button from '../Button';
import LocalStorage from '../localStorage';
import projectInfo from '../../../package.json';
import Memory from '../Memory';
import nanoid from 'nanoid';

export default class Calculator extends Component {
    constructor() {
        super();
        this.NAME = projectInfo.name;
        this.VERSION = projectInfo.version;
        this.localStorage = new LocalStorage(this.VERSION, this.NAME);
        this.memory = new Memory();
        this.state = {
            valuesHistoryDisplay: [],
            displayValue: '0',
            isDisabled: false,
            displayHistoryValue: '',
            displayHiddenHistoryvalue: '',
            displayFontSize: STYLES.NORMAL,
            mode: (this.localStorage.isEmpty) ? CALC_MODES.DEFAULT : this.localStorage.dataset.isDisabledMemoryButtons,
            positionAttribute: (this.localStorage.isEmpty) ? 0 : this.localStorage.dataset.positionAttribute,
            isOpenMemoryWindow: false,
            isDisabledMemoryButtons: (this.localStorage.isEmpty) ? true : this.localStorage.dataset.isDisabledMemoryButtons,
            memoryValues: (this.localStorage.isEmpty) ? [] : this.localStorage.dataset.memoryValues,
        };
        this.maxLength = MAX_LENGTH_DISPLAY;
        this.values = [];
        this.smallDisplay = React.createRef();
        this.$calculator = React.createRef();
        this.$calculatorBody = React.createRef();
        this.stateSettings = {};
        this.styleSettings = {};
        this.memoryValues = {};
        this.positionAttribute = 0;
        this.typeOperation = null;
        this.currentValue = null;
        this.memoryArrayOfValues = [];
        this.isOpenMemoryWindow = false;
    }

    clear = () => {
        if (this.operationsDisabled) {
            this.setState({ displayFontSize: STYLES.NORMAL });
            this.toggleVisualStateButtons();
        }

        this.values = [];
        this.setState({
            displayValue: '0',
            isDisabled: false,
            displayHistoryValue: ''
        });
        this.operationsDisabled = false;
        this.isResultPressed = false;
        this.isOperationPressed = false;
        this.isNeedValueForProgressive = false;
        this.isNeedNewValueToDisplay = false;
        this.valueForProgressive = null;
        this.typeOperation = '';
        this.currentValue = null;
        this.typeOperation = null;
    }

    SDclear = () => {
        this.setState({ displayHistoryValue: '' });
        this.values = [];
    }

    SDclearLastValue = () => {
        let displayHistoryValue = ''
        let displayHiddenHistoryValue = '';

        this.values.pop();
        for (let i = 0; i < this.values.length; i++) {
            displayHiddenHistoryValue += this.values[i];
            displayHistoryValue += this.values[i];
        }
        
        this.setState({
            displayHiddenHistoryValue: displayHiddenHistoryValue,
            displayHistoryValue: displayHistoryValue,
        });
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
        let data = this.formatText(String(this.state.displayValue));

        if ((data === MESSAGES.OVERFLOW) || (data === MESSAGES.DIVIDE_BY_ZERO) || (data === MESSAGES.UNCORRECT_DATA)) {
            return data;
        } 
        
        // eslint-disable-next-line
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
            this.setState({ displayFontSize: STYLES.NORMAL });
        }

        this.updateSmallDisplay();
        this.isEnteredNewValue = true;
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
            case OPERATIONS.PERCENT:
            case OPERATIONS.NEGATE: {
                if (!isFinite(result)) {                    
                    this.operationsDisabled = true;
                    this.toggleVisualStateButtons();
                    this.setState({
                        displayFontSize: STYLES.SMALL,
                        isDisabled: true,
                        displayValue: MESSAGES.OVERFLOW
                    });
                }

                break;
            }
            case OPERATIONS.DIVIDE: {
                if (this.valueForProgressive === 0 || parseFloat(this.getTextDisplay()) === 0) {
                    this.operationsDisabled = true;
                    this.toggleVisualStateButtons();
                    this.setState({
                        displayFontSize: STYLES.SMALL,
                        isDisabled: true,
                        displayValue: MESSAGES.DIVIDE_BY_ZERO
                    });
                }

                break;
            }
            case OPERATIONS.FRAC: {
                if (parseFloat(this.state.displayValue) === 0) {
                    this.operationsDisabled = true;
                    this.toggleVisualStateButtons();
                    this.setState({
                        displayFontSize: STYLES.SMALL,
                        isDisabled: true,
                        displayValue: MESSAGES.DIVIDE_BY_ZERO
                    });
                }

                break;
            }
            case OPERATIONS.SQRT: {
                if (parseFloat(this.state.displayValue) < 0) {
                    this.operationsDisabled = true;
                    this.toggleVisualStateButtons();
                    this.setState({
                        displayFontSize: STYLES.SMALL,
                        isDisabled: true,
                        displayValue: MESSAGES.UNCORRECT_DATA
                    });
                }

                break;
            }
            default: {
                console.log(MESSAGES.ERRROR.EXCEPTIONS);
                break;
            }
        }
    }

    trimmer = (temp) => {
        if ((String(temp).indexOf('.') !== -1 && temp > 1) || (temp < 1 && String(temp).length > this.maxLength)) {
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
                displayValue: String(this.formatText(this.trimmer(result)))
            });
        }

        if ((operation !== OPERATIONS.PERCENT) && (operation !== OPERATIONS.POW) &&
            (operation !== OPERATIONS.FRAC) && (operation !== OPERATIONS.SQRT)) {
            this.currentValue = this.trimmer(result);
        }
    };

    sendData() {
        let textData = '';

        for (let i = 0; i < this.values.length; i++) {
            textData += this.values[i];
        }

        this.setState({ displayHistoryValue: textData });
    }

    sendToHistoryDisplay = (type, operation, result, isPressedSingleOperation, isEnteredNewValue, isResultPressed) => {
        switch (type) {
            case OPERATIONS.PERCENT: {
                if (!isPressedSingleOperation) {
                    this.values.push(parseFloat(result));
                    this.sendData();

                    return;
                }

                this.values[this.values.length - 1] = parseFloat(result);
                this.sendData();

                break;
            }
            case OPERATIONS.LABEL_SINGLE_OPERATION: {
                if (!isPressedSingleOperation) {
                    this.values.push(`${NAME_FOR_DISPLAY[operation]}(${parseFloat(this.getTextDisplay())})`);
                    this.variableForSingleOperationGetWidth = this.values[this.values.length - 1];
                    this.sendData();

                    return;
                }

                this.values[this.values.length - 1] = `${NAME_FOR_DISPLAY[operation]}(${this.values[this.values.length - 1]})`;
                this.sendData();

                break;
            }
            case OPERATIONS.LABEL_DEFAULT_OPERATION: {
                if (isPressedSingleOperation) {
                    this.values.push(` ${operation} `);
                    this.sendData();

                    return;
                }

                if (isEnteredNewValue || isResultPressed) {
                    this.values.push(parseFloat(this.getTextDisplay()));
                    this.values.push(` ${operation} `);
                    this.sendData();

                    return;
                }

                this.values[this.values.length - 1] = ` ${operation} `;
                this.sendData();

                break;
            }
            default:
                console.log(MESSAGES.ERROR.SMALL_DISPLAY);
                break;
        }
    }

    operation = (operation) => {
        if (this.operationsDisabled) {
            return;
        }

        if (this.currentValue === null) {
            this.currentValue = 0;
            this.isEnteredNewValue = true;
        }

        this.isNeedValueForProgressive = true;
        this.isNeedNewValueInDisplay = true;
        this.sendToHistoryDisplay(OPERATIONS.LABEL_DEFAULT_OPERATION, operation, this.currentValue, this.isPressedSingleOperation, this.isEnteredNewValue, this.isResultPressed);
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
        // eslint-disable-next-line
        this.sendToHistoryDisplay(OPERATIONS.LABEL_SINGLE_OPERATION, operation, result, this.isPressedSingleOperation);
        this.isPressedSingleOperation = true;

        if (this.currentValue === null) {
            this.currentValue = parseFloat(this.getTextDisplay());
        }

        console.log(this.getTextDisplay());
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
        let shiftX = e.pageX - this.$calculator.current.offsetLeft;
        let shiftY = e.pageY - this.$calculator.current.offsetTop;
        moveAt(e);
        this.$calculator.current.style.zIndex = 1000;

        let documentMouseMove = (e) => {
            if (window.innerWidth < 350) {
                return false;
            }
            moveAt(e);
        };

        document.addEventListener('mousemove', documentMouseMove);

        let calcMouseUp = () => {
            document.removeEventListener('mousemove', documentMouseMove);
            this.$calculator.current.removeEventListener('mouseup', calcMouseUp);
        }

        this.$calculator.current.addEventListener('mouseup', calcMouseUp);
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

        this.typeOperation = null;
        this.operationsDisabled = false;

        if (this.getTextDisplay().indexOf('e') !== -1 || this.isPressedSingleOperation) {
            return;
        }

        if ((this.getTextDisplay().length === 2 && this.getTextDisplay()[0] === '-') || this.state.displayValue.length === 1) {
            this.setState({ 
                displayValue: '0' 
            });

            return;
        }

        if (this.getTextDisplay() === MESSAGES.DIVIDE_BY_ZERO || this.getTextDisplay() === MESSAGES.OVERFLOW || this.getTextDisplay() === MESSAGES.UNCORRECT_DATA) {
            this.setState({
                displayFontSize: STYLES.NORMAL,
                displayValue: '0'
            });
            this.toggleVisualStateButtons();

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

        this.valueForProgressive = this.sendOperation(OPERATIONS.NEGATE, this.getTextDisplay());

        if (this.getTextDisplay() === '0' || this.isResultPressed) {
            this.isEnteredNewValue = true;
            this.isNeedNewValueInDisplay = true;
            this.sendToHistoryDisplay(OPERATIONS.LABEL_SINGLE_OPERATION, OPERATIONS.NEGATE, this.valueForProgressive, this.isPressedSingleOperation);
        }

        this.isPressedSingleOperation = true;

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
        this.sendResult(OPERATIONS.PERCENT, result);
        this.sendToHistoryDisplay(OPERATIONS.PERCENT, OPERATIONS.PERCENT, this.trimmer(result), this.isPressedSingleOperation);
        this.isPressedSingleOperation = true;
        this.isNeedNewValueInDisplay = true;
    }

    toggleVisualStateButtons = () => {
        this.setState({ isDisabled: false });
        this.stateSettings.isDisabledMemoryButtons = false;
    }

    manage = (mode) => {
        switch (mode) {
            case CALC_MODES.STANDART: {
                this.styleSettings.visible = 'block';
                this.styleSettings.calculatorHeight = '540px';

                break;
            }
            case CALC_MODES.MINIMIZED: {
                this.styleSettings.visible = 'none';
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
                this.styleSettings.visible = 'block';
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

    isEmpty() {
        return (Object.keys(this.stateSettings.memoryValues).length === 0);
    }

    loadStateFromLocalStorage() {
        this.defaultSettings = {
            mode: CALC_MODES.DEFAULT,
            x: `${(window.innerWidth - 320) / window.innerWidth * 100}%`,
            y: `${(window.innerHeight - 540) / window.innerHeight * 100}%`,
            isDisabledMemoryButtons: true,
            positionAttribute: 0,
            memoryValues: []
        };

        if (this.localStorage.isEmpty) {
            this.localStorage.dataset = this.defaultSettings;
        }

        this.stateSettings = this.localStorage.dataset;
        this.manage(this.stateSettings.mode);
    }

    addToMemory = (data) => {
        let tempObj = {
            id: nanoid(7),
            data: data,
            position: this.positionAttribute
        }

        this.stateSettings.memoryValues.unshift(tempObj);
        this.positionAttribute++;
        this.stateSettings.positionAttribute = this.positionAttribute;
    }

    memorySave = () => {
        if (this.state.isOpenMemoryWindow || !isFinite(parseFloat(this.getTextDisplay()))) {
            return;
        }

        this.isNeedNewValueInDisplay = true;

        if (this.stateSettings.isDisabledMemoryButtons) {
            this.setState({ isDisabledMemoryButtons: false });
            this.stateSettings.isDisabledMemoryButtons = false;
        }

        this.isDisabledMemoryButtons = false;
        this.stateSettings.isDisabledMemoryButtons = this.isDisabledMemoryButtons;
        this.positionAttribute = this.stateSettings.positionAttribute;
        this.addToMemory(this.getTextDisplay());
        this.localStorage.dataset = this.stateSettings;
    };

    memoryOpen = () => {
        if (this.stateSettings.isDisabledMemoryButtons && !this.isOpenMemoryWindow) {
            return;
        }

        if (!this.state.isOpenMemoryWindow) {
            this.setState({ isOpenMemoryWindow: true });
        } else {
            this.setState({ isOpenMemoryWindow: false });
        }
    }

    memoryClear = () => {
        if (this.state.isOpenMemoryWindow || this.stateSettings.isDisabledMemoryButtons) {
            return;
        }

        this.stateSettings.isDisabledMemoryButtons = true;
        this.stateSettings.positionAttribute = 0;
        this.stateSettings.memoryValues = [];
        this.localStorage.dataset = this.stateSettings;
        this.setState({ isDisabledMemoryButtons: true, memoryValues: [] });
    }

    memoryRead = () => {
        if (this.stateSettings.isDisabledMemoryButtons || this.state.isOpenMemoryWindow) {
            return;
        }

        let position = this.stateSettings.memoryValues[this.stateSettings.memoryValues.length - 1].position;
        this.setState({ displayValue: this.stateSettings.memoryValues[position].data });
        this.isEnteredNewValue = true;
    }

    memoryPlus = () => {
        if (this.state.isOpenMemoryWindow || !isFinite(parseFloat(this.getTextDisplay()))) {
            return;
        }

        if (this.stateSettings.isDisabledMemoryButtons) {
            this.setState({ isDisabledMemoryButtons: false });
            this.stateSettings.isDisabledMemoryButtons = false;
        }

        if (this.isEmpty()) {
            this.addToMemory(this.state.displayValue);
        } else {
            let value = this.stateSettings.memoryValues[0].data;
            let displayValue = this.state.displayValue;

            this.stateSettings.memoryValues[0].data = String(parseFloat(value) + parseFloat(displayValue));
        }
        // desctruct
        
        this.localStorage.dataset = {
            memoryValues: this.state.memoryValues
        } //this.stateSettings;
    }

    memoryMinus = () => {
        if (this.state.isOpenMemoryWindow) {
            return;
        }

        if (this.stateSettings.isDisabledMemoryButtons) {
            this.setState({ isDisabledMemoryButtons: false });
            this.stateSettings.isDisabledMemoryButtons = false;
        }

        if (this.isEmpty()) {
            this.addToMemory(this.state.displayValue);
        } else {
            let value = this.stateSettings.memoryValues[0].data;
            let displayValue = this.state.displayValue;

            this.stateSettings.memoryValues[0].data = String(parseFloat(value) - parseFloat(displayValue));
        }

        this.localStorage.dataset = this.stateSettings;
    }

    updateLocalStorage = (data) => {
        for (let i = 0; i < this.stateSettings.memoryValues.length; i++) {
            if (this.stateSettings.memoryValues[i].id === data.id) {
                this.stateSettings.memoryValues[i].data = data.data;
            }
        }

        this.localStorage.dataset = this.stateSettings;
    }

    onClearMemoryItem = (data) => {
        /* let deleteMemoryItem = (currentValue, index, arr) => {
            if (currentValue.id === data.id) {
                return currentValue;
            }
        }
        console.log(this.stateSettings.memoryValues.find(deleteMemoryItem)); */

        for (let i = 0; i < this.stateSettings.memoryValues.length; i++) {
            if (this.stateSettings.memoryValues[i].id === data.id) {
                this.stateSettings.memoryValues.splice(i, 1);
            }
        }        

        if (this.stateSettings.memoryValues.length === 0) {
            this.stateSettings.isDisabledMemoryButtons = true;
            this.memoryOpen();
            this.isOpenMemoryWindow = false;
        }

        this.localStorage.dataset = this.stateSettings;
        this.setState({ memoryValues: this.stateSettings.memoryValues });
    }

    btnSettings = {
        memoryClearButton: {
            style: 'calc-add__button calc-add__button_memory-clear js-calc-add__button_memory-clear',
            dataAttribute: OPERATIONS.ADDITIONAL.MCLEAR
        },
        memoryReadButton: {
            style: 'calc-add__button calc-add__button_read js-calc-add__button_read',
            dataAttribute: OPERATIONS.ADDITIONAL.MREAD
        },
        memoryPlusButton: {
            style: 'calc-add__button calc-add__button_plus js-calc-add__button_plus',
            dataAttribute: OPERATIONS.ADDITIONAL.MPLUS
        },
        memoryMinusButton: {
            style: 'calc-add__button calc-add__button_minus js-calc-add__button_minus',
            dataAttribute: OPERATIONS.ADDITIONAL.MMINUS
        },
        memorySaveButton: {
            style: 'calc-add__button calc-add__button_ms js-calc-add__button_ms',
            dataAttribute: OPERATIONS.ADDITIONAL.MSAVE
        },
        memoryOpenButton: {
            style: 'calc-add__button calc-add__button_memory js-calc-add__button_memory',
            dataAttribute: OPERATIONS.ADDITIONAL.MEMORY
        },
        percentBtn: {
            style: 'calc__button calc__button_percent js-calc__button_percent',
            dataAttribute: OPERATIONS.ADDITIONAL.PERCENT,
            percent: this.percent
        },
        sqrtBtn: {
            style: 'calc__button calc__button_sqrt js-calc__button_sqrt',
            dataAttribute: OPERATIONS.ADDITIONAL.SQRT,
            singleOperation: this.singleOperation
        },
        powBtn: {
            style: 'calc__button calc__button_pow js-calc__button_pow',
            dataAttribute: OPERATIONS.ADDITIONAL.POW,
            singleOperation: this.singleOperation
        },
        fracBtn: {
            style: 'calc__button calc__button_frac js-calc__button_frac',
            dataAttribute: OPERATIONS.ADDITIONAL.FRAC,
            singleOperation: this.singleOperation
        },
        ceBtn: {
            style: 'calc__button calc__button_disabled',
            dataAttribute: ''
        },
        clearBtn: {
            style: 'calc__button calc__button_clear js-calc__button_clear',
            dataAttribute: OPERATIONS.ADDITIONAL.CLEAR
        },
        backspaceBtn: {
            style: 'calc__button calc__button_backspace js-calc__button_backspace',
            dataAttribute: OPERATIONS.ADDITIONAL.BACKSPACE
        },
        operationBtn: {
            style: 'calc__button calc__button_operation js-calc__button_operation',
            dataAttribute: OPERATIONS.ADDITIONAL.DIVIDE
        },
        number: {
            style: 'calc__button calc__button_number js-calc__button_number',
            dataAttribute: 'number',
            updateDisplayValue: this.handleChangeValue
        },
        operation: {
            style: 'calc__button calc__button_operation js-calc__button_operation',
            dataAttribute: 'operation',
            operation: this.operation
        },
        reverseBtn: {
            style: 'calc__button calc__button_reverse js-calc__button_reverse',
            dataAttribute: OPERATIONS.ADDITIONAL.REVERSE
        },
        addPointBtn: {
            style: 'calc__button calc__button_add-point js-calc__button_add-point',
            dataAttribute: OPERATIONS.ADDITIONAL.POINT
        },
        resultBtn: {
            style: 'calc__button calc__button_get-result js-calc__button_get-result',
            dataAttribute: OPERATIONS.ADDITIONAL.RESULT
        }
    }

    render() {
        const { displayValue, isOpenMemoryWindow, isDisabled, displayHistoryValue, displayFontSize } = this.state;

        this.loadStateFromLocalStorage();

        return (
            <React.Fragment>
                <div onClick={this.buttonOpenCalculator} style={{ 'display': this.styleSettings.openCalcDisplay }} className="open-calculator js-open-calculator">Open calc</div>
                <div ref={this.$calculator} onDragStart={this.calculatorDragStart} className="calculator js-calculator" style={{
                    left: this.stateSettings.x,
                    top: this.stateSettings.y,
                    height: this.styleSettings.calculatorHeight,
                    bottom: this.styleSettings.calculatorBottom,
                    display: this.styleSettings.calculatorDisplay
                }}>
                    <div className="index-menu">
                        <p onMouseDown={this.calculatorDragAndDrop} className="index-menu__title js-index-menu__title">Калькулятор</p>
                        <div onClick={this.buttonTrey} className="index-menu__button index-menu__button_trey js-index-menu__button_trey">–</div>
                        <div onClick={this.buttonOpen} className="index-menu__button index-menu__button_open js-index-menu__button_open">☐</div>
                        <div onClick={this.buttonClose} className="index-menu__button index-menu__button_close js-index-menu__button_close">✕</div>
                    </div>
                    <div ref={this.$calculatorBody} style={{ display: this.styleSettings.visible }} className="calculator-body">
                        <div className="option-menu js-option-menu">
                            <div className="option-menu__btn-menu">☰</div>
                            <p className="option-menu__title">Обычный</p>
                            <div className="option-menu__btn-journal" />
                        </div>
                        <HistoryDisplay
                            displayHistoryValue={displayHistoryValue}
                        />
                        <Display
                            displayFontSize={displayFontSize}
                            value={displayValue}
                        />
                        <div className="button-area js-button-area">
                            <div className="calc calc-add">
                                <Button
                                    isOpenMemoryWindow={isOpenMemoryWindow}
                                    isDisabledMemoryButtons={this.stateSettings.isDisabledMemoryButtons}
                                    btnSettings={this.btnSettings.memoryClearButton}
                                    memoryClear={this.memoryClear}
                                >MC</Button>
                                <Button isOpenMemoryWindow={isOpenMemoryWindow} memoryRead={this.memoryRead} isDisabledMemoryButtons={this.stateSettings.isDisabledMemoryButtons} btnSettings={this.btnSettings.memoryReadButton}>MR</Button>
                                <Button isOpenMemoryWindow={isOpenMemoryWindow} memoryPlus={this.memoryPlus} btnSettings={this.btnSettings.memoryPlusButton}>M<span>+</span></Button>
                                <Button isOpenMemoryWindow={isOpenMemoryWindow} memoryMinus={this.memoryMinus} btnSettings={this.btnSettings.memoryMinusButton}>M<span>-</span></Button>
                                <Button isOpenMemoryWindow={isOpenMemoryWindow} memorySave={this.memorySave} btnSettings={this.btnSettings.memorySaveButton}>MS</Button>
                                <Button isDisabledMemoryButtons={this.stateSettings.isDisabledMemoryButtons} memoryOpen={this.memoryOpen} btnSettings={this.btnSettings.memoryOpenButton}>M</Button>
                            </div>
                            <div className="calc">
                                <Button isDisabled={isDisabled} percent={this.percent} btnSettings={this.btnSettings.percentBtn}>%</Button>
                                <Button isDisabled={isDisabled} btnSettings={this.btnSettings.sqrtBtn}>√</Button>
                                <Button isDisabled={isDisabled} btnSettings={this.btnSettings.powBtn}><span className="span">x</span></Button>
                                <Button isDisabled={isDisabled} btnSettings={this.btnSettings.fracBtn}><span className="span">/</span></Button>
                            </div>
                            <div className="calc">
                                <Button btnSettings={this.btnSettings.ceBtn}>CE</Button>
                                <Button btnSettings={this.btnSettings.clearBtn} clear={this.clear}>C</Button>
                                <Button btnSettings={this.btnSettings.backspaceBtn} backspace={this.backspace}>{`<-`}</Button>
                                <Button isDisabled={isDisabled} btnSettings={this.btnSettings.operation}>÷</Button>
                            </div>
                            <div className="calc">
                                <Button btnSettings={this.btnSettings.number}>7</Button>
                                <Button btnSettings={this.btnSettings.number}>8</Button>
                                <Button btnSettings={this.btnSettings.number}>9</Button>
                                <Button isDisabled={isDisabled} btnSettings={this.btnSettings.operation}>*</Button>
                            </div>
                            <div className="calc">
                                <Button btnSettings={this.btnSettings.number}>4</Button>
                                <Button btnSettings={this.btnSettings.number}>5</Button>
                                <Button btnSettings={this.btnSettings.number}>6</Button>
                                <Button isDisabled={isDisabled} btnSettings={this.btnSettings.operation}>-</Button>
                            </div>
                            <div className="calc">
                                <Button btnSettings={this.btnSettings.number}>1</Button>
                                <Button btnSettings={this.btnSettings.number}>2</Button>
                                <Button btnSettings={this.btnSettings.number}>3</Button>
                                <Button isDisabled={isDisabled} btnSettings={this.btnSettings.operation}>+</Button>
                            </div>
                            <div className="calc">
                                <Button isDisabled={isDisabled} reverse={this.reverse} btnSettings={this.btnSettings.reverseBtn}>±</Button>
                                <Button btnSettings={this.btnSettings.number}>0</Button>
                                <Button isDisabled={isDisabled} addPoint={this.addPoint} btnSettings={this.btnSettings.addPointBtn}>,</Button>
                                <Button isDisabled={isDisabled} result={this.result} btnSettings={this.btnSettings.resultBtn}>=</Button>
                            </div>
                            <Memory
                                onClearMemoryItem={this.onClearMemoryItem}
                                updateLocalStorage={this.updateLocalStorage}
                                displayValue={displayValue}
                                isOpenMemoryWindow={this.state.isOpenMemoryWindow}
                                memoryValues={this.stateSettings.memoryValues}
                            />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

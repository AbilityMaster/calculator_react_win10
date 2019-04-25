import React, { Component } from 'react';
import nanoid from 'nanoid';
import { OPERATIONS, MESSAGES, STYLES, CALC_MODES, MAX_LENGTH_DISPLAY, NAME_FOR_DISPLAY } from '../../const';
import HistoryDisplay from '../HistoryDisplay';
import Display from '../Display';
import Button from '../Button';
import LocalStorage from '../localStorage';
import Memory from '../Memory';
import projectInfo from '../../../package.json';
import '../../scss/st.scss';

export default class Calculator extends Component {
    constructor() {
        super();
        this.localStorage = new LocalStorage(projectInfo.version, projectInfo.name);
        this.defaultSettings = {
            mode: CALC_MODES.DEFAULT,
            x: `${(window.innerWidth - 320) / window.innerWidth * 100}%`,
            y: `${(window.innerHeight - 540) / window.innerHeight * 100}%`,
            isDisabledMemoryButtons: true,
            positionAttribute: 0,
            memoryValues: []
        }
        this.localStorage.dataset = this.localStorage.isEmpty ? this.defaultSettings : false;
        this.state = {
            isDisabledOperations: false,
            isResultPressed: false,
            isOperationPressed: false,
            isEnteredNewValue: true,
            isNeedValueForProgressive: false,
            isNeedNewValueInDisplay: false,
            isPressedSingleOperation: false,
            valueForProgressive: null,
            currentValue: null,
            typeOperation: null,
            displayValue: '0',
            isDisabled: false,
            displayHistoryValue: '',
            displayFontSize: STYLES.NORMAL,
            isOpenMemoryWindow: false,
            historyValues: [],
            isDisabledMemoryButtonsAll: false,
            isDisabledMemoryButtons: (this.localStorage.isEmpty) ? true : this.localStorage.dataset.isDisabledMemoryButtons,
            memoryValues: (this.localStorage.isEmpty) ? [] : this.localStorage.dataset.memoryValues,
            mode: (this.localStorage.isEmpty) ? CALC_MODES.DEFAULT : this.localStorage.dataset.mode,
            positionAttribute: (this.localStorage.isEmpty) ? 0 : this.localStorage.dataset.positionAttribute,
        };
        this.coords = {
            x: (this.localStorage.isEmpty) ? this.defaultSettings.x : this.localStorage.dataset.x,
            y: (this.localStorage.isEmpty) ? this.defaultSettings.y : this.localStorage.dataset.y
        };
        this.$calculator = React.createRef();
    }

    clear = () => {
        const { isDisabledOperations } = this.state;

        if (isDisabledOperations) {
            this.setState({ displayFontSize: STYLES.NORMAL });
            this.toggleVisualStateButtons();
        }

        this.setState({
            isPressedSingleOperation: false,
            displayValue: '0',
            isDisabled: false,
            displayHistoryValue: '',
            isDisabledOperations: false,
            isResultPressed: false,
            isOperationPressed: false,
            isNeedValueForProgressive: false,
            isNeedNewValueInDisplay: false,
            valueForProgressive: null,
            currentValue: null,
            typeOperation: null,
            isEnteredNewValue: true,
            historyValues: []
        });
    }

    SDclear = () => {
        this.setState({ displayHistoryValue: '', historyValues: [] });
    }

    SDclearLastValue = () => {
        const { historyValues } = this.state;
        let displayHistoryValue = '';

        historyValues.pop()
        this.setState({
            historyValues
        });

        for (let i = 0; i < historyValues.length; i++) {
            displayHistoryValue += historyValues[i];
        }

        this.setState({
            displayHistoryValue
        });
    }

    updateSmallDisplay = () => {
        const { isPressedSingleOperation, isOperationPressed } = this.state;

        if (isPressedSingleOperation) {
            isOperationPressed ? this.SDclearLastValue() : this.SDclear();
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
        const { displayValue } = this.state;
        let data = this.formatText(String(displayValue));

        if ((data === MESSAGES.OVERFLOW) || (data === MESSAGES.DIVIDE_BY_ZERO) || (data === MESSAGES.UNCORRECT_DATA)) {
            return data;
        }

        // eslint-disable-next-line
        data = data.replace(/\&nbsp\;/g, "\xa0");
        data = data.replace(/\s+/g, '');
        data = data.replace(',', '.');

        return data;
    }

    handleChangeValue = (number) => {
        const { isDisabledOperations, isNeedNewValueInDisplay, isResultPressed, displayValue } = this.state;

        if (isDisabledOperations) {
            this.clear();
            this.toggleVisualStateButtons();
            this.setState({ displayFontSize: STYLES.NORMAL });
        }

        this.updateSmallDisplay();
        this.setState({
            isEnteredNewValue: true,
            isPressedSingleOperation: false
        });

        if ((displayValue === '0' || (isNeedNewValueInDisplay) || (isResultPressed && displayValue !== '0.') || displayValue === MESSAGES.DIVIDE_BY_ZERO)) {
            this.setState({
                displayValue: `${this.formatText(number)}`,
                isResultPressed: false,
                isNeedNewValueInDisplay: false
            });

            return;
        }

        if (displayValue === '0.' && !isNeedNewValueInDisplay) {
            this.setState({
                displayValue: this.formatText(`${this.getTextDisplay()}${number}`),
                isResultPressed: false
            });

            return;
        }

        if (String(displayValue).length >= MAX_LENGTH_DISPLAY) {
            return;
        }

        this.setState(() => ({ displayValue: this.formatText(`${this.getTextDisplay()}${number}`) }));
    }

    isValueCorrect(operation, result) {
        switch (operation) {
            case OPERATIONS.POW:
            case OPERATIONS.PLUS:
            case OPERATIONS.MINUS:
            case OPERATIONS.MULTIPLY:
            case OPERATIONS.PERCENT:
            case OPERATIONS.NEGATE: {
                if (!isFinite(result)) {
                    this.setState({
                        isDisabledOperations: true,
                        displayFontSize: STYLES.SMALL,
                        isDisabled: true,
                        displayValue: MESSAGES.OVERFLOW,
                        isDisabledMemoryButtonsAll: true
                    });

                    return false;
                }

                return true;
            }
            case OPERATIONS.DIVIDE: {
                const { valueForProgressive } = this.state;

                if (valueForProgressive === 0 || parseFloat(this.getTextDisplay()) === 0) {
                    this.setState({
                        isDisabledOperations: true,
                        displayFontSize: STYLES.SMALL,
                        isDisabled: true,
                        displayValue: MESSAGES.DIVIDE_BY_ZERO,
                        isDisabledMemoryButtonsAll: true
                    });

                    return false;
                }

                return true;
            }
            case OPERATIONS.FRAC: {
                const { displayValue } = this.state;

                if (parseFloat(displayValue) === 0) {
                    this.setState({
                        isDisabledOperations: true,
                        displayFontSize: STYLES.SMALL,
                        isDisabled: true,
                        displayValue: MESSAGES.DIVIDE_BY_ZERO,
                        isDisabledMemoryButtonsAll: true
                    });

                    return false;
                }

                return true;
            }
            case OPERATIONS.SQRT: {
                const { displayValue } = this.state;

                if (parseFloat(displayValue) < 0) {
                    this.setState({
                        isDisabledOperations: true,
                        displayFontSize: STYLES.SMALL,
                        isDisabled: true,
                        displayValue: MESSAGES.UNCORRECT_DATA,
                        isDisabledMemoryButtonsAll: true
                    });

                    return false;
                }

                return true;
            }
            default: {
                console.log(MESSAGES.ERRROR.EXCEPTIONS);
                break;
            }
        }
    }

    trimmer = (temp) => {
        if ((String(temp).indexOf('.') !== -1 && temp > 1) || (temp < 1 && String(temp).length > MAX_LENGTH_DISPLAY)) {
            temp = temp.toPrecision(6);
        }

        temp = parseFloat(temp);

        if (String(temp).length > MAX_LENGTH_DISPLAY) {
            temp = temp.toPrecision(6);
        }

        return temp;
    }

    sendResult = (operation, result) => {
        if (this.isValueCorrect(operation, result)) {
            this.setState({
                displayValue: String(this.formatText(this.trimmer(result)))
            });
        }

        if ((operation !== OPERATIONS.PERCENT) && (operation !== OPERATIONS.POW) &&
            (operation !== OPERATIONS.FRAC) && (operation !== OPERATIONS.SQRT)) {
            this.setState({ currentValue: this.trimmer(result) });
        }
    };

    sendData() {
        const { historyValues } = this.state;
        let textData = '';

        for (let i = 0; i < historyValues.length; i++) {
            textData += historyValues[i];
        }

        this.setState({ displayHistoryValue: textData });
    }

    sendToHistoryDisplay = (type, operation, result, isPressedSingleOperation, isEnteredNewValue, isResultPressed) => {
        const { historyValues } = this.state;

        switch (type) {
            case OPERATIONS.PERCENT: {
                if (!isPressedSingleOperation) {
                    historyValues.push(result)
                    this.setState({
                        historyValues
                    });
                    this.sendData();

                    return;
                }

                historyValues[historyValues.length - 1] = parseFloat(result);
                this.setState({
                    historyValues
                });
                this.sendData();

                break;
            }
            case OPERATIONS.LABEL_SINGLE_OPERATION: {
                if (!isPressedSingleOperation) {
                    historyValues.push(`${NAME_FOR_DISPLAY[operation]}(${parseFloat(this.getTextDisplay())})`);
                    this.setState({
                        historyValues
                    });
                    this.sendData();

                    return;
                }

                historyValues[historyValues.length - 1] = `${NAME_FOR_DISPLAY[operation]}(${historyValues[historyValues.length - 1]})`;
                this.setState({
                    historyValues
                });
                this.sendData();

                break;
            }
            case OPERATIONS.LABEL_DEFAULT_OPERATION: {
                if (isPressedSingleOperation) {
                    historyValues.push(` ${operation} `);
                    this.setState({
                        historyValues
                    });
                    this.sendData();

                    return;
                }

                if (isEnteredNewValue || isResultPressed) {
                    historyValues.push(parseFloat(this.getTextDisplay()), ` ${operation} `);
                    this.setState({
                        historyValues
                    });
                    this.sendData()

                    return;
                }

                historyValues[historyValues.length - 1] = ` ${operation} `;
                this.setState({
                    historyValues
                });
                this.sendData();

                break;
            }
            default:
                console.log(MESSAGES.ERROR.SMALL_DISPLAY);
                break;
        }
    }

    operation = (operation) => {
        const { isDisabledOperations, currentValue, isPressedSingleOperation, isEnteredNewValue,
            isOperationPressed, isResultPressed, valueForProgressive, typeOperation } = this.state;

        if (isDisabledOperations) {
            return;
        }

        if (currentValue === null) {
            this.setState({
                isEnteredNewValue: true,
                currentValue: 0
            });
        }

        this.setState({
            isNeedValueForProgressive: true,
            isNeedNewValueInDisplay: true
        });
        this.sendToHistoryDisplay(OPERATIONS.LABEL_DEFAULT_OPERATION, operation, currentValue, isPressedSingleOperation, isEnteredNewValue, isResultPressed);
        this.setState({
            isResultPressed: false,
            isPressedSingleOperation: false
        });

        if (isOperationPressed) {
            if (isEnteredNewValue) {
                if (isResultPressed) {
                    let result = this.sendOperation(typeOperation, currentValue, valueForProgressive);
                    this.sendResult(operation, result);
                } else {
                    let result = this.sendOperation(typeOperation, currentValue, parseFloat(this.getTextDisplay()));
                    this.sendResult(operation, result);
                }
            }

            this.setState({
                isEnteredNewValue: false,
                typeOperation: operation
            });

            return;
        }

        this.setState({
            currentValue: parseFloat(this.getTextDisplay()),
            typeOperation: operation,
            isEnteredNewValue: false,
            isOperationPressed: true
        });
    };

    singleOperation = (operation) => {
        const { isDisabledOperations, currentValue } = this.state;

        if (isDisabledOperations || (operation === OPERATIONS.PERCENT && currentValue === null)) {
            return;
        }

        this.setState({ isNeedNewValueInDisplay: true });
        // eslint-disable-next-line
        this.sendToHistoryDisplay(OPERATIONS.LABEL_SINGLE_OPERATION, operation, result, this.state.isPressedSingleOperation);
        this.setState({ isPressedSingleOperation: true });

        if (currentValue === null) {
           this.setState({ currentValue: parseFloat(this.getTextDisplay()) });
        }

        let result = this.sendOperation(operation, parseFloat(this.getTextDisplay()));
        this.sendResult(operation, result);
    }

    result = () => {
        const { isDisabledOperations, typeOperation, isEnteredNewValue, isOperationPressed, currentValue, isNeedValueForProgressive, valueForProgressive } = this.state;

        if (isDisabledOperations || typeOperation === null) {
            return;
        }

        this.SDclear();
        this.setState({ isResultPressed: true });

        if (isEnteredNewValue && !isOperationPressed) {
            this.setState({ currentValue: parseFloat(this.getTextDisplay()) });
        }

        this.setState({
            isEnteredNewValue: false,
            isOperationPressed: false,
            isPressedSingleOperation: false
        });

        if (currentValue !== null) {
            if (isNeedValueForProgressive) {
                this.setState({
                    valueForProgressive: parseFloat(this.getTextDisplay()),
                    isNeedValueForProgressive: false
                });

                let result = this.sendOperation(typeOperation, currentValue, parseFloat(this.getTextDisplay()));
                this.sendResult(typeOperation, result);
            } else {
                let result = this.sendOperation(typeOperation, currentValue, valueForProgressive);
                this.sendResult(typeOperation, result);
            }
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

            this.coords.x = this.$calculator.current.style.left;
            this.coords.y = this.$calculator.current.style.top;

            if (this.localStorage.isEmpty || this.localStorage.dataset.mode === CALC_MODES.DEFAULT) {
                this.localStorage.dataset = {
                    mode: CALC_MODES.STANDART
                }
            }

            this.localStorage.dataset = {
                x: this.coords.x,
                y: this.coords.y
            }
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
        const { isDisabledOperations, isResultPressed, isNeedNewValueInDisplay } = this.state;

        if (isDisabledOperations) {
            return;
        }

        this.updateSmallDisplay();

        if (isResultPressed ||
            (this.getTextDisplay().indexOf('.') === -1 && isNeedNewValueInDisplay) ||
            (this.getTextDisplay().indexOf('.') === -1 && isResultPressed) ||
            (this.getTextDisplay().indexOf('.') !== -1 && isNeedNewValueInDisplay) ||
            (this.getTextDisplay().indexOf('.') !== -1 && isResultPressed)) {

            this.setState({
                displayValue: '0.',
                isNeedNewValueInDisplay: false
            });

            return;
        }

        if (this.getTextDisplay().indexOf('.') === -1) {
            this.setState(state => ({ displayValue: `${state.displayValue}.` }));
        }
    }

    backspace = () => {
        const { isDisabledOperations, isResultPressed, isOperationPressed, isPressedSingleOperation, displayValue } = this.state;

        if ((!isDisabledOperations && isResultPressed) || isOperationPressed) {
            return;
        }

        this.setState({
            typeOperation: null,
            isDisabledOperations: false
        });

        if (this.getTextDisplay().indexOf('e') !== -1 || isPressedSingleOperation) {
            return;
        }

        if ((this.getTextDisplay().length === 2 && this.getTextDisplay()[0] === '-') || displayValue.length === 1) {
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
        const { isDisabledOperations, isResultPressed, valueForProgressive, isPressedSingleOperation } = this.state;

        if (isDisabledOperations || isNaN(parseFloat(this.getTextDisplay()))) {
            return;
        }

        this.setState({ valueForProgressive: this.sendOperation(OPERATIONS.NEGATE, this.getTextDisplay()) });

        if (this.getTextDisplay() === '0' || isResultPressed) {
            this.setState({
                isEnteredNewValue: true,
                isNeedNewValueInDisplay: true
            });
            this.sendToHistoryDisplay(OPERATIONS.LABEL_SINGLE_OPERATION, OPERATIONS.NEGATE, valueForProgressive, isPressedSingleOperation);
        }

        this.setState({ isPressedSingleOperation: true });

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
        const { isDisabledOperations, currentValue, isPressedSingleOperation } = this.state;

        if (isDisabledOperations || currentValue === null) {
            return;
        }

        let result = this.sendOperation(OPERATIONS.PERCENT, currentValue, parseFloat(this.getTextDisplay()));
        this.sendResult(OPERATIONS.PERCENT, result);
        this.sendToHistoryDisplay(OPERATIONS.PERCENT, OPERATIONS.PERCENT, this.trimmer(result), isPressedSingleOperation);
        this.setState({
            isPressedSingleOperation: true,
            isNeedNewValueInDisplay: true
        });
    }

    toggleVisualStateButtons = () => {
        this.setState({
            isDisabledOperations: false,
            isDisabled: false,
            isDisabledMemoryButtonsAll: false,
            isDisabledMemoryButtons: false
        });
    }

    get classNames() {
        const { mode } = this.state;
        const classNames = ['calculator'];

        switch (mode) {
            case CALC_MODES.STANDART: {
                classNames.push('standart');

                return {
                    calcBody: 'calculator-body displayBlock',
                    calc: classNames.join(' '),
                    button: 'open-calculator'
                }
            }
            case CALC_MODES.MINIMIZED: {
                classNames.push('minimized');

                return {
                    calcBody: 'calculator-body closed',
                    calc: classNames.join(' '),
                    button: 'open-calculator'
                }
            }
            case CALC_MODES.CLOSED: {
                classNames.push('closed');

                return {
                    calcBody: 'calculator-body',
                    calc: classNames.join(' '),
                    button: 'open-calculator displayBlock'
                }
            }
            case CALC_MODES.DEFAULT: {
                classNames.push('standart');
                this.coords.x = `${(window.innerWidth - 320) / window.innerWidth * 100}%`;
                this.coords.y = `${(window.innerHeight - 540) / window.innerHeight * 100}%`;

                return {
                    calcBody: 'calculator-body displayBlock',
                    calc: classNames.join(' '),
                    button: 'open-calculator'
                }
            }
            default: {
                return console.log(MESSAGES.ERROR.MODES);
            }
        }
    }

    buttonTrey = () => {
        this.setState({ mode: CALC_MODES.MINIMIZED });
        this.localStorage.dataset = {
            mode: CALC_MODES.MINIMIZED,
            x: this.coords.x,
            y: this.coords.y
        }
    };

    buttonOpen = () => {
        this.setState({ mode: CALC_MODES.STANDART });
        this.localStorage.dataset = {
            mode: CALC_MODES.STANDART,
            x: this.coords.x,
            y: this.coords.y
        }
    };

    buttonClose = () => {
        this.setState({ mode: CALC_MODES.CLOSED });
        this.localStorage.dataset = {
            mode: CALC_MODES.CLOSED
        }
    };

    buttonOpenCalculator = () => {
        this.setState({ mode: CALC_MODES.DEFAULT });
        this.localStorage.dataset = {
            mode: CALC_MODES.DEFAULT
        }
    };

    isEmpty() {
        const { memoryValues } = this.state;

        return (Object.keys(memoryValues).length === 0);
    }

    addToMemory = (data) => {
        const { memoryValues, positionAttribute } = this.state;

        memoryValues.unshift({
            id: nanoid(7),
            data: data,
            position: positionAttribute
        });

        this.setState((state) => ({
            positionAttribute: state.positionAttribute + 1,
            memoryValues: memoryValues
        }));
    }

    memorySave = () => {
        const { isOpenMemoryWindow, isDisabledOperations, isDisabledMemoryButtons, positionAttribute, memoryValues } = this.state;
        
        if (isOpenMemoryWindow || isDisabledOperations) {
            return;
        }

        this.setState({ isNeedNewValueInDisplay: true });

        if (isDisabledMemoryButtons) {
            this.setState({ isDisabledMemoryButtons: false });
        }

        this.addToMemory(this.getTextDisplay());
        
        this.localStorage.dataset = {
            memoryValues: memoryValues,
            positionAttribute: positionAttribute + 1,
            isDisabledMemoryButtons: false
        }
    };

    memoryOpen = () => {
        const { isDisabledMemoryButtons, isOpenMemoryWindow, isDisabledOperations } = this.state;

        if ((isDisabledMemoryButtons && !isOpenMemoryWindow) || isDisabledOperations) {
            return;
        }

        if (!isOpenMemoryWindow) {
            this.setState({ isOpenMemoryWindow: true });
        } else {
            this.setState({ isOpenMemoryWindow: false });
        }
    }

    memoryClear = () => {
        const { isOpenMemoryWindow, isDisabledMemoryButtons, isDisabledOperations } = this.state;

        if (isOpenMemoryWindow || isDisabledMemoryButtons || isDisabledOperations) {
            return;
        }

        this.setState({
            isDisabledMemoryButtons: true,
            memoryValues: [],
            positionAttribute: 0
        });

        this.localStorage.dataset = {
            isDisabledMemoryButtons: true,
            memoryValues: [],
            positionAttribute: 0
        }
    }

    memoryRead = () => {
        const { isDisabledMemoryButtons, isOpenMemoryWindow, isDisabledOperations, memoryValues } = this.state;

        if (isDisabledMemoryButtons || isOpenMemoryWindow || isDisabledOperations) {
            return;
        }

        let position = memoryValues[memoryValues.length - 1].position;
        this.setState({
            displayValue: memoryValues[position].data,
            isEnteredNewValue: true
        });
    }

    memoryPlus = () => {
        const { isOpenMemoryWindow, isDisabledMemoryButtons, displayValue, memoryValues, positionAttribute, isDisabledOperations } = this.state;

        if (isOpenMemoryWindow || isDisabledOperations) {
            return;
        }

        if (isDisabledMemoryButtons) {
            this.setState({ isDisabledMemoryButtons: false });
        }

        if (this.isEmpty()) {
            this.addToMemory(displayValue);
        } else {
            let firstValueMemory = memoryValues[0].data;

            memoryValues[0].data = String(parseFloat(firstValueMemory) + parseFloat(displayValue));
            this.setState({ memoryValues: memoryValues });
        }

        this.localStorage.dataset = {
            isDisabledMemoryButtons: false,
            memoryValues: memoryValues,
            positionAttribute: positionAttribute + 1
        }
    }

    memoryMinus = () => {
        const { isOpenMemoryWindow, isDisabledMemoryButtons, displayValue, memoryValues, positionAttribute, isDisabledOperations } = this.state;

        if (isOpenMemoryWindow || isDisabledOperations) {
            return;
        }

        if (isDisabledMemoryButtons) {
            this.setState({ isDisabledMemoryButtons: false });
        }

        if (this.isEmpty()) {
            this.addToMemory(displayValue);
        } else {
            let firstValueMemory = memoryValues[0].data;

            memoryValues[0].data = String(parseFloat(firstValueMemory) - parseFloat(displayValue));
        }

        this.localStorage.dataset = {
            isDisabledMemoryButtons: false,
            memoryValues: memoryValues,
            positionAttribute: positionAttribute + 1
        }
    }

    updateLocalStorage = (data) => {
        const { memoryValues } = this.state;

        for (let i = 0; i < memoryValues.length; i++) {
            if (memoryValues[i].id === data.id) {
                memoryValues[i].data = data.data;
            }
        }

        this.setState({ memoryValues: memoryValues });
        this.localStorage.dataset = {
            memoryValues: memoryValues
        }
    }

    onClearMemoryItem = (data) => {
        const { memoryValues } = this.state;

        for (let i = 0; i < memoryValues.length; i++) {
            if (memoryValues[i].id === data.id) {
                memoryValues.splice(i, 1);
                break;
            }
        }

        if (memoryValues.length === 0) {
            this.setState({
                isDisabledMemoryButtons: true,
                isOpenMemoryWindow: false,
                positionAttribute: 0
            });
            this.localStorage.dataset = {
                isDisabledMemoryButtons: true,
                positionAttribute: 0
            }
        }

        this.localStorage.dataset = {
            memoryValues: memoryValues
        }
        this.setState({ memoryValues: memoryValues });
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
        const { memoryValues, displayValue, isOpenMemoryWindow, isDisabled, displayHistoryValue, displayFontSize, isDisabledMemoryButtons, isDisabledMemoryButtonsAll } = this.state;

        return (
            <React.Fragment>
                <div
                    onClick={this.buttonOpenCalculator}
                    className={this.classNames.button}
                >Open calc</div>
                <div
                    ref={this.$calculator}
                    onDragStart={this.calculatorDragStart}
                    className={this.classNames.calc}
                    style={{
                        left: this.coords.x,
                        top: this.coords.y
                    }}>
                    <div className="index-menu">
                        <p onMouseDown={this.calculatorDragAndDrop} className="index-menu__title">Калькулятор</p>
                        <div onClick={this.buttonTrey} className="index-menu__button index-menu__button_trey">–</div>
                        <div onClick={this.buttonOpen} className="index-menu__button index-menu__button_open">☐</div>
                        <div onClick={this.buttonClose} className="index-menu__button index-menu__button_close">✕</div>
                    </div>
                    <div className={this.classNames.calcBody}>
                        <div className="option-menu">
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
                        <div className="button-area">
                            <div className="calc calc-add">
                                <Button
                                    isDisabledMemoryButtonsAll={isDisabledMemoryButtonsAll}
                                    isOpenMemoryWindow={isOpenMemoryWindow}
                                    isDisabledMemoryButtons={isDisabledMemoryButtons}
                                    btnSettings={this.btnSettings.memoryClearButton}
                                    memoryClear={this.memoryClear}
                                >MC</Button>
                                <Button
                                    isDisabledMemoryButtonsAll={isDisabledMemoryButtonsAll}
                                    isOpenMemoryWindow={isOpenMemoryWindow}
                                    memoryRead={this.memoryRead}
                                    isDisabledMemoryButtons={isDisabledMemoryButtons}
                                    btnSettings={this.btnSettings.memoryReadButton}
                                >MR</Button>
                                <Button
                                    isDisabledMemoryButtonsAll={isDisabledMemoryButtonsAll}
                                    isOpenMemoryWindow={isOpenMemoryWindow}
                                    memoryPlus={this.memoryPlus}
                                    btnSettings={this.btnSettings.memoryPlusButton}
                                >M<span>+</span></Button>
                                <Button
                                    isDisabledMemoryButtonsAll={isDisabledMemoryButtonsAll}
                                    isOpenMemoryWindow={isOpenMemoryWindow}
                                    memoryMinus={this.memoryMinus}
                                    btnSettings={this.btnSettings.memoryMinusButton}
                                >M<span>-</span></Button>
                                <Button
                                    isDisabledMemoryButtonsAll={isDisabledMemoryButtonsAll}
                                    isOpenMemoryWindow={isOpenMemoryWindow}
                                    memorySave={this.memorySave}
                                    btnSettings={this.btnSettings.memorySaveButton}
                                >MS</Button>
                                <Button
                                    isDisabledMemoryButtonsAll={isDisabledMemoryButtonsAll}
                                    isDisabledMemoryButtons={isDisabledMemoryButtons}
                                    memoryOpen={this.memoryOpen}
                                    btnSettings={this.btnSettings.memoryOpenButton}
                                >M</Button>
                            </div>
                            <div className="calc">
                                <Button
                                    isDisabled={isDisabled}
                                    percent={this.percent}
                                    btnSettings={this.btnSettings.percentBtn}
                                >%</Button>
                                <Button
                                    isDisabled={isDisabled}
                                    btnSettings={this.btnSettings.sqrtBtn}
                                >√</Button>
                                <Button
                                    isDisabled={isDisabled}
                                    btnSettings={this.btnSettings.powBtn}
                                ><span className="span">x</span></Button>
                                <Button
                                    isDisabled={isDisabled}
                                    btnSettings={this.btnSettings.fracBtn}
                                ><span className="span">/</span></Button>
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
                                <Button
                                    isDisabled={isDisabled}
                                    reverse={this.reverse}
                                    btnSettings={this.btnSettings.reverseBtn}
                                >±</Button>
                                <Button btnSettings={this.btnSettings.number}>0</Button>
                                <Button
                                    isDisabled={isDisabled}
                                    addPoint={this.addPoint}
                                    btnSettings={this.btnSettings.addPointBtn}>,</Button>
                                <Button
                                    isDisabled={isDisabled}
                                    result={this.result}
                                    btnSettings={this.btnSettings.resultBtn}
                                >=</Button>
                            </div>
                            <Memory
                                onClearMemoryItem={this.onClearMemoryItem}
                                updateLocalStorage={this.updateLocalStorage}
                                displayValue={displayValue}
                                isOpenMemoryWindow={isOpenMemoryWindow}
                                memoryValues={memoryValues}
                            />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

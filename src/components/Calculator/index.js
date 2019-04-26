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
        this.localStorage.dataset = this.localStorage.isEmpty ? this.defaultSettings : false;
        const { isDisabledMemoryButtons, memoryValues, mode, positionAttribute, x, y } = this.localStorage.dataset;
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
            isDisabledMemoryButtons,
            memoryValues,
            mode,
            positionAttribute,
        };
        this.coords = {
            x,
            y
        };
        this.$calculator = React.createRef();
    }

    get defaultSettings() {
        return {
            mode: CALC_MODES.DEFAULT,
            x: `${(window.innerWidth - 320) / window.innerWidth * 100}%`,
            y: `${(window.innerHeight - 540) / window.innerHeight * 100}%`,
            isDisabledMemoryButtons: true,
            positionAttribute: 0,
            memoryValues: []
        }
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
            isDisabledMemoryButtons: true,
            valueForProgressive: null,
            currentValue: null,
            typeOperation: null,
            isEnteredNewValue: true,
            historyValues: []
        });
    };

    SDclear = () => {
        this.setState({ 
            displayHistoryValue: '',
            historyValues: [] 
        });
    };

    SDclearLastValue = () => {
        const { historyValues } = this.state;

        historyValues.pop()

        this.setState({
            displayHistoryValue: historyValues.join('')
        });
    };

    updateSmallDisplay = () => {
        const { isPressedSingleOperation, isOperationPressed } = this.state;

        if (isPressedSingleOperation) {
            isOperationPressed ? this.SDclearLastValue() : this.SDclear();
        }
    };

    formatText = (data) => {
        if (String(data).indexOf(',') === -1 && String(data).indexOf('.') === -1 && !isNaN(data)) {
            let formatter = new Intl.NumberFormat('ru');
            return formatter.format(data);
        }

        return data;
    }

    get textDisplay() {
        const { displayValue } = this.state;
        let data = this.formatText(String(displayValue));

        if ((data === MESSAGES.OVERFLOW) || (data === MESSAGES.DIVIDE_BY_ZERO) || (data === MESSAGES.UNCORRECT_DATA)) {
            return data;
        }

        // eslint-disable-next-line
        data = data.replace(/\&nbsp\;/g, '\xa0');
        data = data.replace(/\s+/g, '');
        data = data.replace(',', '.');

        return data;
    };

    handleChangeValue = (event) => {
        const number = event.target.innerHTML;
        const { isDisabledOperations, isNeedNewValueInDisplay, isResultPressed, displayValue } = this.state;

        if (isDisabledOperations) {
            this.clear();
            this.toggleVisualStateButtons();
            this.setState({
                displayFontSize: STYLES.NORMAL,
                isDisabledMemoryButtons: true,
            });
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
                displayValue: this.formatText(`${this.textDisplay}${number}`),
                isResultPressed: false
            });

            return;
        }

        if (String(displayValue).length >= MAX_LENGTH_DISPLAY) {
            return;
        }

        this.setState(() => ({ displayValue: this.formatText(`${this.textDisplay}${number}`) }));
    };

    isValueCorrect = (operation, result) => {
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

                if (valueForProgressive === 0 || parseFloat(this.textDisplay) === 0) {
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
    };

    trimmer = (temp) => {
        if (((String(temp).indexOf('.') !== -1 && temp > 1) || (temp < 1 && String(temp).length > MAX_LENGTH_DISPLAY)) && String(temp).indexOf('e') === -1) {
            temp = temp.toPrecision(6);
        }

        temp = parseFloat(temp);

        if (String(temp).length > MAX_LENGTH_DISPLAY) {
            temp = temp.toPrecision(6);
        }

        return temp;
    };

    sendResult = (operation, result) => {
        if (this.isValueCorrect(operation, result)) {
            this.setState({
                displayValue: String(this.formatText(this.trimmer(result)))
            });
        }

        if ((operation !== OPERATIONS.PERCENT) && (operation !== OPERATIONS.POW) &&
            (operation !== OPERATIONS.FRAC) && (operation !== OPERATIONS.SQRT)) {
            this.setState({ currentValue: parseFloat(this.trimmer(result)) });
        }
    };

    sendData = () => {
        const { historyValues } = this.state;

        this.setState({ displayHistoryValue: historyValues.join('') });
    };

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
                    historyValues.push(`${NAME_FOR_DISPLAY[operation]}(${parseFloat(this.textDisplay)})`);
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
                    historyValues.push(parseFloat(this.textDisplay), ` ${operation} `);
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
    };

    operation = (event) => {
        const operation = event.target.innerHTML;
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
                    let result = this.sendOperation(typeOperation, currentValue, parseFloat(this.textDisplay));
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
            currentValue: parseFloat(this.textDisplay),
            typeOperation: operation,
            isEnteredNewValue: false,
            isOperationPressed: true
        });
    };

    singleOperation = (event) => {
        const operation = event.target.dataset.type;
        const { isDisabledOperations, currentValue } = this.state;

        if (isDisabledOperations || (operation === OPERATIONS.PERCENT && currentValue === null)) {
            return;
        }

        this.setState({ isNeedNewValueInDisplay: true });
        // eslint-disable-next-line
        this.sendToHistoryDisplay(OPERATIONS.LABEL_SINGLE_OPERATION, operation, result, this.state.isPressedSingleOperation);
        this.setState({ isPressedSingleOperation: true });

        if (currentValue === null) {
            this.setState({ currentValue: parseFloat(this.textDisplay) });
        }

        let result = this.sendOperation(operation, parseFloat(this.textDisplay));
        this.sendResult(operation, result);
    };

    result = () => {
        const { isDisabledOperations, typeOperation, isEnteredNewValue, isOperationPressed, currentValue, isNeedValueForProgressive, valueForProgressive } = this.state;
        let result = 0;

        if (isDisabledOperations || typeOperation === null) {
            return;
        }

        this.SDclear();
        this.setState({
            isResultPressed: true,
            isEnteredNewValue: false,
            isOperationPressed: false,
            isPressedSingleOperation: false
        });

        if (currentValue !== null) {
            if (isNeedValueForProgressive) {
                this.setState({
                    valueForProgressive: parseFloat(this.textDisplay),
                    isNeedValueForProgressive: false
                });

                result = this.sendOperation(typeOperation, currentValue, parseFloat(this.textDisplay));
                this.sendResult(typeOperation, result);

                return;
            }

            if (isEnteredNewValue && !isOperationPressed) {
                result = this.sendOperation(typeOperation, parseFloat(this.textDisplay), valueForProgressive);
                this.sendResult(typeOperation, result);

                return;
            }
            result = this.sendOperation(typeOperation, currentValue, valueForProgressive);
            this.sendResult(typeOperation, result);
        }
    };

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
    };

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
            (this.textDisplay.indexOf('.') === -1 && isNeedNewValueInDisplay) ||
            (this.textDisplay.indexOf('.') === -1 && isResultPressed) ||
            (this.textDisplay.indexOf('.') !== -1 && isNeedNewValueInDisplay) ||
            (this.textDisplay.indexOf('.') !== -1 && isResultPressed)) {

            this.setState({
                displayValue: '0.',
                isNeedNewValueInDisplay: false
            });

            return;
        }

        if (this.textDisplay.indexOf('.') === -1) {
            this.setState(state => ({ displayValue: `${state.displayValue}.` }));
        }
    };

    backspace = () => {
        const { isDisabledOperations, isResultPressed, isOperationPressed, isPressedSingleOperation, displayValue } = this.state;

        if ((!isDisabledOperations && isResultPressed) || isOperationPressed || isDisabledOperations) {
            return;
        }

        this.setState({
            typeOperation: null,
            isDisabledOperations: false
        });

        if (this.textDisplay.indexOf('e') !== -1 || isPressedSingleOperation) {
            return;
        }

        if ((this.textDisplay.length === 2 && this.textDisplay[0] === '-') || displayValue.length === 1) {
            this.setState({
                displayValue: '0'
            });

            return;
        }

        if (this.textDisplay === MESSAGES.DIVIDE_BY_ZERO || this.textDisplay === MESSAGES.OVERFLOW || this.textDisplay === MESSAGES.UNCORRECT_DATA) {
            this.setState({
                displayFontSize: STYLES.NORMAL,
                displayValue: '0'
            });
            this.toggleVisualStateButtons();

            return;
        }

        this.setState((state) => ({
            displayValue: this.textDisplay.slice(0, this.textDisplay.length - 1)
        }));
    };

    reverse = () => {
        const { isDisabledOperations, isResultPressed, valueForProgressive, isPressedSingleOperation } = this.state;

        if (isDisabledOperations || isNaN(parseFloat(this.textDisplay))) {
            return;
        }

        this.setState({ valueForProgressive: this.sendOperation(OPERATIONS.NEGATE, this.textDisplay) });

        if (this.textDisplay === '0' || isResultPressed) {
            this.setState({
                isEnteredNewValue: true,
                isNeedNewValueInDisplay: true
            });
            this.sendToHistoryDisplay(OPERATIONS.LABEL_SINGLE_OPERATION, OPERATIONS.NEGATE, valueForProgressive, isPressedSingleOperation);
        }

        this.setState({ isPressedSingleOperation: true });

        if (this.textDisplay === '0') {
            return;
        }

        if (this.textDisplay.indexOf('-') === -1) {
            this.setState((state) => ({ displayValue: `-${state.displayValue}` }));

            return;
        }

        this.setState((state) => ({ displayValue: state.displayValue.substr(1, state.displayValue.length - 1) }));
    };

    percent = () => {
        const { isDisabledOperations, currentValue, isPressedSingleOperation } = this.state;

        if (isDisabledOperations || currentValue === null) {
            return;
        }

        let result = this.sendOperation(OPERATIONS.PERCENT, currentValue, parseFloat(this.textDisplay));
        this.sendResult(OPERATIONS.PERCENT, result);
        this.sendToHistoryDisplay(OPERATIONS.PERCENT, OPERATIONS.PERCENT, this.trimmer(result), isPressedSingleOperation);
        this.setState({
            isPressedSingleOperation: true,
            isNeedNewValueInDisplay: true
        });
    };

    toggleVisualStateButtons = () => {
        this.setState({
            isDisabledOperations: false,
            isDisabled: false,
            isDisabledMemoryButtonsAll: false,
            isDisabledMemoryButtons: false
        });
    };

    get classForState() {
        const { mode } = this.state;

        const classNames = {
            calc: ['calculator'],
            calcBody: ['calculator__body'],
            openCalcButton: ['open-calculator']
        }

        switch (mode) {
            case CALC_MODES.STANDART: {
                return {
                    calc: classNames.calc.join(' '),
                    calcBody: classNames.calcBody.join(' '),
                    openCalcButton: classNames.openCalcButton.join(' '),
                }
            }
            case CALC_MODES.MINIMIZED: {
                classNames.calc.push('calculator_minimized');
                classNames.calcBody.push('calculator__body_hidden');

                return {
                    calc: classNames.calc.join(' '),
                    calcBody: classNames.calcBody.join(' '),
                    openCalcButton: classNames.openCalcButton.join(' '),
                }
            }
            case CALC_MODES.CLOSED: {
                classNames.calc.push('calculator_closed');
                classNames.openCalcButton.push('open-calculator_visible');

                return {
                    calc: classNames.calc.join(' '),
                    calcBody: classNames.calcBody.join(' '),
                    openCalcButton: classNames.openCalcButton.join(' '),
                }
            }
            case CALC_MODES.DEFAULT: {
                this.coords.x = `${(window.innerWidth - 320) / window.innerWidth * 100}%`;
                this.coords.y = `${(window.innerHeight - 540) / window.innerHeight * 100}%`;

                return {
                    calc: classNames.calc.join(' '),
                    calcBody: classNames.calcBody.join(' '),
                    openCalcButton: classNames.openCalcButton.join(' '),
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

    isEmpty = () => {
        const { memoryValues } = this.state;

        return (Object.keys(memoryValues).length === 0);
    };

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

        this.addToMemory(this.textDisplay);

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
    };

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
    };

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
    };

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
    };

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
    };

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
    };

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
    };

    get classNames() {
        const { isDisabled, isDisabledMemoryButtons, isOpenMemoryWindow, isDisabledMemoryButtonsAll } = this.state;

        let button = {
            buttonsCanBeDisabled: {
                default: ['calculator__button'],
                pow: ['calculator__button calculator__button_pow'],
                frac: ['calculator__button calculator__button_frac']
            },
            memoryButtonsDefaultDisabled: {
                mClear: ['calculator__memory-button'],
                mRead: ['calculator__memory-button'],
                mOpen: ['calculator__memory-button']
            },
            memoryButtonsDefaultUnDisabled: {
                mPlus: ['calculator__memory-button'],
                mMinus: ['calculator__memory-button'],
                mSave: ['calculator__memory-button']
            }
        }

        if (isDisabled) {
            button.buttonsCanBeDisabled.default.push('calculator__button_disabled');
            button.buttonsCanBeDisabled.pow.push('calculator__button_disabled');
            button.buttonsCanBeDisabled.frac.push('calculator__button_disabled');
        }
        if (isDisabledMemoryButtons) {
            button.memoryButtonsDefaultDisabled.mClear.push('calculator__memory-button_disabled');
            button.memoryButtonsDefaultDisabled.mRead.push('calculator__memory-button_disabled');
            button.memoryButtonsDefaultDisabled.mOpen.push('calculator__memory-button_disabled');
        }
        if (isDisabledMemoryButtonsAll) {
            button.memoryButtonsDefaultDisabled.mClear.push('calculator__memory-button_disabled');
            button.memoryButtonsDefaultDisabled.mRead.push('calculator__memory-button_disabled');
            button.memoryButtonsDefaultDisabled.mOpen.push('calculator__memory-button_disabled');
            button.memoryButtonsDefaultUnDisabled.mPlus.push('calculator__memory-button_disabled');
            button.memoryButtonsDefaultUnDisabled.mMinus.push('calculator__memory-button_disabled');
            button.memoryButtonsDefaultUnDisabled.mSave.push('calculator__memory-button_disabled');
        }
        if (isOpenMemoryWindow) {
            button.memoryButtonsDefaultDisabled.mClear.push('calculator__memory-button_disabled');
            button.memoryButtonsDefaultDisabled.mRead.push('calculator__memory-button_disabled');
            button.memoryButtonsDefaultUnDisabled.mPlus.push('calculator__memory-button_disabled');
            button.memoryButtonsDefaultUnDisabled.mMinus.push('calculator__memory-button_disabled');
            button.memoryButtonsDefaultUnDisabled.mSave.push('calculator__memory-button_disabled');
        }

        return {
            buttonsCanBeDisabled: {
                default: button.buttonsCanBeDisabled.default.join(' '),
                pow: button.buttonsCanBeDisabled.pow.join(' '),
                frac: button.buttonsCanBeDisabled.frac.join(' '),
            },
            memoryButtonsDefaultDisabled: {
                mClear: button.memoryButtonsDefaultDisabled.mClear.join(' '),
                mRead: button.memoryButtonsDefaultDisabled.mRead.join(' '),
                mOpen: button.memoryButtonsDefaultDisabled.mOpen.join(' '),
            },
            memoryButtonsDefaultUnDisabled: {
                mPlus: button.memoryButtonsDefaultUnDisabled.mPlus.join(' '),
                mMinus: button.memoryButtonsDefaultUnDisabled.mPlus.join(' '),
                mSave: button.memoryButtonsDefaultUnDisabled.mPlus.join(' '),
            },
            numberButton: 'calculator__button calculator__button_number',
            ceButton: 'calculator__button calculator__button_disabled',
            default: 'calculator__button'
        }
    }

    get dataAttributes() {
        return {
            pow: {
                'data-type': OPERATIONS.POW 
            },
            sqrt: {
                'data-type': OPERATIONS.SQRT
            },
            frac: {
                'data-type': OPERATIONS.FRAC,
            }
        }
    }

    render() {
        const { memoryValues, displayValue, isOpenMemoryWindow, displayHistoryValue, displayFontSize } = this.state;

        return (
            <React.Fragment>
                <div
                    onClick={this.buttonOpenCalculator}
                    className={this.classForState.openCalcButton}
                >Open calc</div>
                <div
                    ref={this.$calculator}
                    onDragStart={this.calculatorDragStart}
                    className={this.classForState.calc}
                    style={{
                        left: this.coords.x,
                        top: this.coords.y
                    }}>
                    <div className='calculator__header-menu'>
                        <p onMouseDown={this.calculatorDragAndDrop} className='calculator__title'>Калькулятор</p>
                        <div onClick={this.buttonTrey} className='calculator__header-button calculator__header-button_trey'>–</div>
                        <div onClick={this.buttonOpen} className='calculator__header-button calculator__header-button_open'>☐</div>
                        <div onClick={this.buttonClose} className='calculator__header-button calculator__header-button_close'>✕</div>
                    </div>
                    <div className={this.classForState.calcBody}>
                        <div className='calculator__option-menu'>
                            <div className='calculator__option-button'>☰</div>
                            <p className='calculator__option-title'>Обычный</p>
                        </div>
                        <HistoryDisplay
                            displayHistoryValue={displayHistoryValue}
                        />
                        <Display
                            displayFontSize={displayFontSize}
                            value={displayValue}
                        />
                        <div className='calculator__button-area'>
                            <div className='calculator__row'>
                                <Button
                                    className={this.classNames.memoryButtonsDefaultDisabled.mClear}
                                    onClick={this.memoryClear}
                                >MC</Button>
                                <Button
                                    onClick={this.memoryRead}
                                    className={this.classNames.memoryButtonsDefaultDisabled.mRead}
                                >MR</Button>
                                <Button
                                    onClick={this.memoryPlus}
                                    className={this.classNames.memoryButtonsDefaultUnDisabled.mPlus}
                                >M<span>+</span></Button>
                                <Button
                                    onClick={this.memoryMinus}
                                    className={this.classNames.memoryButtonsDefaultUnDisabled.mMinus}
                                >M<span>-</span></Button>
                                <Button
                                    onClick={this.memorySave}
                                    className={this.classNames.memoryButtonsDefaultUnDisabled.mSave}
                                >MS</Button>
                                <Button
                                    onClick={this.memoryOpen}
                                    className={this.classNames.memoryButtonsDefaultDisabled.mOpen}
                                >M</Button>
                            </div>
                            <div className='calculator__row'>
                                <Button
                                    onClick={this.percent}
                                    className={this.classNames.buttonsCanBeDisabled.default}
                                >%</Button>
                                <Button
                                    className={this.classNames.buttonsCanBeDisabled.default}
                                    onClick={this.singleOperation}
                                    dataAttributes={this.dataAttributes.sqrt}
                                >√</Button>
                                <Button
                                    className={this.classNames.buttonsCanBeDisabled.pow}
                                    onClick={this.singleOperation}
                                    dataAttributes={this.dataAttributes.pow}
                                >
                                    <span className='span'>x</span>
                                </Button>
                                <Button
                                    className={this.classNames.buttonsCanBeDisabled.frac}
                                    onClick={this.singleOperation}
                                    dataAttributes={this.dataAttributes.frac}
                                >
                                    <span className='span'>/</span>
                                </Button>
                            </div>
                            <div className='calculator__row'>
                                <Button className={this.classNames.ceButton}>CE</Button>
                                <Button
                                    className={this.classNames.default}
                                    onClick={this.clear}
                                >C</Button>
                                <Button
                                    className={this.classNames.default}
                                    onClick={this.backspace}
                                >{`<-`}</Button>
                                <Button
                                    className={this.classNames.buttonsCanBeDisabled.default}
                                    onClick={this.operation}
                                >÷</Button>
                            </div>
                            <div className='calculator__row'>
                                <Button
                                    className={this.classNames.numberButton}
                                    onClick={this.handleChangeValue}
                                >7</Button>
                                <Button
                                    className={this.classNames.numberButton}
                                    onClick={this.handleChangeValue}
                                >8</Button>
                                <Button
                                    className={this.classNames.numberButton}
                                    onClick={this.handleChangeValue}
                                >9</Button>
                                <Button
                                    className={this.classNames.buttonsCanBeDisabled.default}
                                    onClick={this.operation}>*</Button>
                            </div>
                            <div className='calculator__row'>
                                <Button
                                    className={this.classNames.numberButton}
                                    onClick={this.handleChangeValue}
                                >4</Button>
                                <Button
                                    className={this.classNames.numberButton}
                                    onClick={this.handleChangeValue}
                                >5</Button>
                                <Button
                                    className={this.classNames.numberButton}
                                    onClick={this.handleChangeValue}
                                >6</Button>
                                <Button
                                    className={this.classNames.buttonsCanBeDisabled.default}
                                    onClick={this.operation}
                                >-</Button>
                            </div>
                            <div className='calculator__row'>
                                <Button
                                    className={this.classNames.numberButton}
                                    onClick={this.handleChangeValue}
                                >1</Button>
                                <Button
                                    className={this.classNames.numberButton}
                                    onClick={this.handleChangeValue}
                                >2</Button>
                                <Button
                                    className={this.classNames.numberButton}
                                    onClick={this.handleChangeValue}
                                >3</Button>
                                <Button
                                    className={this.classNames.buttonsCanBeDisabled.default}
                                    onClick={this.operation}
                                >+</Button>
                            </div>
                            <div className='calculator__row'>
                                <Button
                                    onClick={this.reverse}
                                    className={this.classNames.buttonsCanBeDisabled.default}
                                >±</Button>
                                <Button
                                    className={this.classNames.numberButton}
                                    onClick={this.handleChangeValue}
                                >0</Button>
                                <Button
                                    onClick={this.addPoint}
                                    className={this.classNames.buttonsCanBeDisabled.default}>,</Button>
                                <Button
                                    onClick={this.result}
                                    className={this.classNames.buttonsCanBeDisabled.default}
                                >=</Button>
                            </div>
                            <Memory
                                getTextDisplay={this.textDisplay}
                                onClearMemoryItem={this.onClearMemoryItem}
                                updateLocalStorage={this.updateLocalStorage}
                                displayValue={displayValue}
                                isOpen={isOpenMemoryWindow}
                                values={memoryValues}
                            />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { OPERATIONS, MESSAGES } from '../../const';

export default class Button extends Component {
    static propTypes = {
        isOpenMemoryWindow: PropTypes.bool,
        isDisabledMemoryButtons: PropTypes.bool,
        isDisabledMemoryButtonsAll: PropTypes.bool,
        btnSettings: PropTypes.object,
        isDisabled: PropTypes.bool,
        memoryClear: PropTypes.func,
        memoryRead: PropTypes.func,
        memoryPlus: PropTypes.func,
        memoryMinus: PropTypes.func,
        memorySave: PropTypes.func,
        memoryOpen: PropTypes.func,
        percent: PropTypes.func,
        clear: PropTypes.func,
        backspace: PropTypes.func,
        reverse: PropTypes.func,
        addPoint: PropTypes.func,
        result: PropTypes.func,
    }

    static defaultProps = {
        isOpenMemoryWindow: false,
        isDisabledMemoryButtons: false,
        btnSettings: {},
        isDisabled: false,
        isDisabledMemoryButtonsAll: false,
        memoryClear: () => {},
        memoryRead: () => {},
        memoryPlus: () => {},
        memoryMinus: () => {},
        memorySave: () => {},
        memoryOpen: () => {},
        percent: () => {},
        clear: () => {},
        backspace: () => {},
        reverse: () => {},
        addPoint: () => {},
        result: () => {},
    }

    switcherEvents = (event) => {
        const { updateDisplayValue, operation, singleOperation } = this.props.btnSettings;
        const { result, clear, addPoint, backspace, reverse, percent, memoryClear, memoryRead, memoryPlus, memoryMinus, memorySave, memoryOpen } = this.props;

        switch (event.target.dataset.type) {
            case OPERATIONS.ADDITIONAL.NUMBER: {
                updateDisplayValue(event.target.innerHTML);

                break;
            }
            case OPERATIONS.ADDITIONAL.OPERATION: {
                operation(event.target.innerHTML);

                break;
            }
            case OPERATIONS.ADDITIONAL.RESULT: {
                result();

                break;
            }
            case OPERATIONS.ADDITIONAL.CLEAR: {
                clear();

                break;
            }
            case OPERATIONS.ADDITIONAL.POINT: {
                addPoint();

                break;
            }
            case OPERATIONS.ADDITIONAL.BACKSPACE: {
                backspace();

                break;
            }
            case OPERATIONS.ADDITIONAL.REVERSE: {
                reverse();

                break;
            }
            case OPERATIONS.ADDITIONAL.PERCENT: {
                percent();

                break;
            }
            case OPERATIONS.ADDITIONAL.SQRT: {
                singleOperation(OPERATIONS.SQRT);

                break;
            }
            case OPERATIONS.ADDITIONAL.POW: {
                singleOperation(OPERATIONS.POW);

                break;
            }
            case OPERATIONS.ADDITIONAL.FRAC: {
                singleOperation(OPERATIONS.FRAC);

                break;
            }
            case OPERATIONS.ADDITIONAL.MCLEAR: {
                memoryClear();

                break;
            }
            case OPERATIONS.ADDITIONAL.MREAD: {
                memoryRead();
                
                break;
            }
            case OPERATIONS.ADDITIONAL.MPLUS: {
                memoryPlus();

                break;
            }
            case OPERATIONS.ADDITIONAL.MMINUS: {
                memoryMinus();

                break;
            }
            case OPERATIONS.ADDITIONAL.MSAVE: {
                memorySave();

                break;
            }
            case OPERATIONS.ADDITIONAL.MEMORY: {
                memoryOpen();

                break;
            }
            default: {
                console.log(MESSAGES.ERROR.EVENTS);

                break;
            }
        }
    }

    get className() {
        const { isDisabled, isDisabledMemoryButtons, isOpenMemoryWindow, isDisabledMemoryButtonsAll } = this.props;
        const { style } = this.props.btnSettings;
        const classNames = [style];

        if (isDisabledMemoryButtonsAll) { 
            classNames.push('calc-add__button_disabled');
        }
        
        if (isDisabledMemoryButtons) {
            classNames.push('calc-add__button_disabled');
        }

        if (isDisabled) {
            classNames.push('calc__button_disabled');
        }

        if (isOpenMemoryWindow) {
            classNames.push('calc-add__button_disabled');
        }

        return classNames.join(' ');
    }

    render() {        
        const { dataAttribute } = this.props.btnSettings;

        return (
            <div
                onClick={this.switcherEvents}
                className={this.className}
                data-type={dataAttribute}
            >{this.props.children}</div>
        )
    }
}
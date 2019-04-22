import React, { Component } from 'react';
import { OPERATIONS } from '../../const';

export default class Button extends Component {

    switcherEvents = (event) => {
        const { updateDisplayValue } = this.props.btnSettings;
        const { operation } = this.props.btnSettings;
        const { result } = this.props;
        const { clear } = this.props;
        const { addPoint } = this.props;
        const { backspace } = this.props;
        const { reverse } = this.props;
        const { percent } = this.props;
        const { singleOperation } = this.props.btnSettings;
        const { memoryClear } = this.props;
        const { memoryRead } = this.props;
        const { memoryPlus } = this.props;
        const { memoryMinus } = this.props;
        const { memorySave } = this.props;
        const { memoryOpen } = this.props;

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
            case OPERATIONS.ADDITIONAL.SQRT:
                singleOperation(OPERATIONS.SQRT);
                break;
            case OPERATIONS.ADDITIONAL.POW:
                singleOperation(OPERATIONS.POW);
                break;
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
                console.log('Error in events');

                break;
            }
        }
    }

    render() {
        let { style } = this.props.btnSettings;
        let { dataAttribute } = this.props.btnSettings;
        const { isDisabled } = this.props;
        const { isDisabledMemoryButtons } = this.props;
        const { isOpenMemoryWindow } = this.props; 

        if (isDisabledMemoryButtons) {
            style += ' calc-add__button_disabled';
        }
        
        if (isDisabled) {
            style += ' calc__button_disabled';
        }
        
        if (isOpenMemoryWindow) {
            style += ' calc-add__button_disabled';
        }

        return (
            <div onClick={this.switcherEvents} className={style} data-type={dataAttribute}>{this.props.children}</div>
        )
    }
}
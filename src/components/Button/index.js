import React, { Component } from 'react';
import { OPERATIONS } from '../../const';

export default class Button extends Component {

    switcherEvents = (event) => {
        const { updateDisplayValue } = this.props.btnSettings;
        const { operation } = this.props.btnSettings;
        const { result } = this.props.btnSettings;
        const { clear } = this.props.btnSettings;
        const { addPoint } = this.props.btnSettings;
        const { backspace } = this.props.btnSettings;
        const { reverse } = this.props.btnSettings;
        const { percent } = this.props.btnSettings;
        const { singleOperation } = this.props.btnSettings;
        const { memoryClear } = this.props.btnSettings;
        const { memoryRead } = this.props.btnSettings;
        const { memoryPlus } = this.props.btnSettings;
        const { memoryMinus } = this.props.btnSettings;
        const { memorySave } = this.props.btnSettings;
        const { memoryOpen } = this.props.btnSettings;

        switch (event.target.dataset.type) {
            case 'number': {
                updateDisplayValue(event.target.innerHTML);

                break;
            }
            case 'operation': {
                operation(event.target.innerHTML);

                break;
            }
            case 'result': {
                result();
                break;
            }
            case 'clear': {
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
            console.log('+');
            style += ' calc-add__button_disabled';
        }
        
        if (isDisabled) {
            console.log('+');
            style += ' calc__button_disabled';
        }
        
        if (isOpenMemoryWindow) {
            console.log('+');
            style += ' calc-add__button_disabled';
        }

        return (
            <div onClick={this.switcherEvents} className={style} data-type={dataAttribute}>{this.props.children}</div>
        )
    }
}
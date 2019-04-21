import React, { Component } from 'react';
import Button from '../Button';
import { OPERATIONS } from '../../const';
import Memory from '../Memory';

export default class ButtonArea extends Component {
    btnSettings = {
        memoryClearButton: {
            style: 'calc-add__button calc-add__button_memory-clear js-calc-add__button_memory-clear',
            dataAttribute: OPERATIONS.ADDITIONAL.MCLEAR,
            memoryClear: () => {
                const { memoryClear } = this.props;
                memoryClear();
            }
        },
        memoryReadButton: {
            style: 'calc-add__button calc-add__button_read js-calc-add__button_read',
            dataAttribute: OPERATIONS.ADDITIONAL.MREAD,
            memoryRead: () => {
                const { memoryRead } = this.props;
                memoryRead();
            }
        },
        memoryPlusButton: {
            style: 'calc-add__button calc-add__button_plus js-calc-add__button_plus',
            dataAttribute: OPERATIONS.ADDITIONAL.MPLUS,
            memoryPlus: () => {
                const { memoryPlus } = this.props;
                memoryPlus();
            }
        },
        memoryMinusButton: {
            style: 'calc-add__button calc-add__button_minus js-calc-add__button_minus',
            dataAttribute: OPERATIONS.ADDITIONAL.MMINUS,
            memoryMinus: () => {
                const { memoryMinus } = this.props;
                memoryMinus();
            }
        },
        memorySaveButton: {
            style: 'calc-add__button calc-add__button_ms js-calc-add__button_ms',
            dataAttribute: OPERATIONS.ADDITIONAL.MSAVE,
            memorySave: () => {
                const { memorySave } = this.props;
                memorySave();
            }
        },
        memoryOpenButton: {
            style: 'calc-add__button calc-add__button_memory js-calc-add__button_memory',
            dataAttribute: OPERATIONS.ADDITIONAL.MEMORY,
            memoryOpen: () => {
                const { memoryOpen } = this.props;
                memoryOpen();
            }
        },
        percentBtn: {
            style: 'calc__button calc__button_percent js-calc__button_percent',
            dataAttribute: OPERATIONS.ADDITIONAL.PERCENT,
            percent: () => {
                const { percent } = this.props;
                percent();
            }
        },
        sqrtBtn: {
            style: 'calc__button calc__button_sqrt js-calc__button_sqrt',
            dataAttribute: OPERATIONS.ADDITIONAL.SQRT,
            singleOperation: (data) => {
                const { singleOperation } = this.props;
                singleOperation(data);
            }
        },
        powBtn: {
            style: 'calc__button calc__button_pow js-calc__button_pow',
            dataAttribute: OPERATIONS.ADDITIONAL.POW,
            singleOperation: (data) => {
                const { singleOperation } = this.props;
                singleOperation(data);
            }
        },
        fracBtn: {
            style: 'calc__button calc__button_frac js-calc__button_frac',
            dataAttribute: OPERATIONS.ADDITIONAL.FRAC,
            singleOperation: (data) => {
                const { singleOperation } = this.props;
                singleOperation(data);
            }
        },
        ceBtn: {
            style: 'calc__button calc__button_disabled',
            dataAttribute: ''
        },
        clearBtn: {
            style: 'calc__button calc__button_clear js-calc__button_clear',
            dataAttribute: OPERATIONS.ADDITIONAL.CLEAR,
            clear: () => {
                const { clear } = this.props;
                clear();
            }
        },
        backspaceBtn: {
            style: 'calc__button calc__button_backspace js-calc__button_backspace',
            dataAttribute: OPERATIONS.ADDITIONAL.BACKSPACE,
            backspace: () => {
                const { backspace } = this.props;
                backspace();
            }
        },
        operationBtn: {
            style: 'calc__button calc__button_operation js-calc__button_operation',
            dataAttribute: OPERATIONS.ADDITIONAL.DIVIDE
        },
        number: {
            style: 'calc__button calc__button_number js-calc__button_number',
            dataAttribute: 'number',
            updateDisplayValue: value => {
                const { updateDisplayValue } = this.props;
                updateDisplayValue(value);
            }
        },
        operation: {
            style: 'calc__button calc__button_operation js-calc__button_operation',
            dataAttribute: 'operation',
            operation: typeOperation => {
                const { operation } = this.props;
                operation(typeOperation);
            }
        },
        reverseBtn: {
            style: 'calc__button calc__button_reverse js-calc__button_reverse',
            dataAttribute: OPERATIONS.ADDITIONAL.REVERSE,
            reverse: () => {
                const { reverse } = this.props;
                reverse();
            }
        },
        addPointBtn: {
            style: 'calc__button calc__button_add-point js-calc__button_add-point',
            dataAttribute: OPERATIONS.ADDITIONAL.POINT,
            addPoint: () => {
                const { addPoint } = this.props;
                addPoint();
            }
        },
        resultBtn: {
            style: 'calc__button calc__button_get-result js-calc__button_get-result',
            dataAttribute: OPERATIONS.ADDITIONAL.RESULT,
            result: () => {
                const { result } = this.props;
                result();
            }
        }
    }

    render() {
        const { isDisabled } = this.props;
        const { isDisabledMemoryButtons } = this.props;
        const { memoryValues } = this.props;
        const { isVisualMemoryBoard } = this.props;
        const { isOpenMemoryWindow } = this.props;

        console.log(memoryValues);
        return (
            <div className="button-area js-button-area">
                <div className="calc calc-add">
                    <Button
                        isOpenMemoryWindow={isOpenMemoryWindow}
                        isDisabledMemoryButtons={isDisabledMemoryButtons}
                        btnSettings={this.btnSettings.memoryClearButton}
                    >MC</Button>
                    <Button isOpenMemoryWindow={isOpenMemoryWindow} isDisabledMemoryButtons={isDisabledMemoryButtons} btnSettings={this.btnSettings.memoryReadButton}>MR</Button>
                    <Button isOpenMemoryWindow={isOpenMemoryWindow} btnSettings={this.btnSettings.memoryPlusButton}>M<span>+</span></Button>
                    <Button isOpenMemoryWindow={isOpenMemoryWindow} btnSettings={this.btnSettings.memoryMinusButton}>M<span>-</span></Button>
                    <Button isOpenMemoryWindow={isOpenMemoryWindow} btnSettings={this.btnSettings.memorySaveButton}>MS</Button>
                    <Button isDisabledMemoryButtons={isDisabledMemoryButtons} btnSettings={this.btnSettings.memoryOpenButton}>M</Button>
                </div>
                <div className="calc">
                    <Button isDisabled={isDisabled} btnSettings={this.btnSettings.percentBtn}>%</Button>
                    <Button isDisabled={isDisabled} btnSettings={this.btnSettings.sqrtBtn}>√</Button>
                    <Button isDisabled={isDisabled} btnSettings={this.btnSettings.powBtn}><span className="span">x</span></Button>
                    <Button isDisabled={isDisabled} btnSettings={this.btnSettings.fracBtn}><span className="span">/</span></Button>
                </div>
                <div className="calc">
                    <Button btnSettings={this.btnSettings.ceBtn}>CE</Button>
                    <Button btnSettings={this.btnSettings.clearBtn}>C</Button>
                    <Button btnSettings={this.btnSettings.backspaceBtn}>{`<-`}</Button>
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
                    <Button isDisabled={isDisabled} btnSettings={this.btnSettings.reverseBtn}>±</Button>
                    <Button btnSettings={this.btnSettings.number}>0</Button>
                    <Button isDisabled={isDisabled} btnSettings={this.btnSettings.addPointBtn}>,</Button>
                    <Button isDisabled={isDisabled} btnSettings={this.btnSettings.resultBtn}>=</Button>
                </div>
                <Memory isVisualMemoryBoard={isVisualMemoryBoard} memoryValues={memoryValues} />
            </div>
        )
    }
}
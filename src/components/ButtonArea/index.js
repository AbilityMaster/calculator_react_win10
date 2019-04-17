import React, { Component } from 'react';
import Button from '../Button';
import { OPERATIONS } from '../../const';

export default class ButtonArea extends Component {
    btnSettings = {
        memoryClearButton: {
            style: 'calc-add__button calc-add__button_memory-clear js-calc-add__button_memory-clear calc-add__button_disabled',
            dataAttribute: OPERATIONS.ADDITIONAL.MCLEAR
        },
        memoryReadButton: {
            style: 'calc-add__button calc-add__button_read js-calc-add__button_read calc-add__button_disabled',
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
            style: 'calc-add__button calc-add__button_memory js-calc-add__button_memory calc-add__button_disabled',
            dataAttribute: OPERATIONS.ADDITIONAL.MEMORY
        },
        percentBtn: {
            style: 'calc__button calc__button_percent js-calc__button_percent',
            dataAttribute: OPERATIONS.ADDITIONAL.PERCENT
        },
        sqrtBtn: {
            style: 'calc__button calc__button_sqrt js-calc__button_sqrt',
            dataAttribute: OPERATIONS.ADDITIONAL.SQRT
        },
        powBtn: {
            style: 'calc__button calc__button_pow js-calc__button_pow',
            dataAttribute: OPERATIONS.ADDITIONAL.POW
        },
        fracBtn: {
            style: 'calc__button calc__button_frac js-calc__button_frac',
            dataAttribute: OPERATIONS.ADDITIONAL.FRAC
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
            type: 'number',
            style: 'calc__button calc__button_number js-calc__button_number',
            dataAttribute: 'number'
        },
        operation: {
            type: 'operation',
            style: 'calc__button calc__button_operation js-calc__button_operation',
            dataAttribute: ''
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
        return (
            <div className="button-area js-button-area">
            <div className="calc calc-add">
                <Button btnSettings={this.btnSettings.memoryClearButton}>MC</Button>
                <Button btnSettings={this.btnSettings.memoryReadButton}>MR</Button>
                <Button btnSettings={this.btnSettings.memoryPlusButton}>M<span>+</span></Button>
                <Button btnSettings={this.btnSettings.memoryMinusButton}>M<span>-</span></Button>
                <Button btnSettings={this.btnSettings.memorySaveButton}>MS</Button>
                <Button btnSettings={this.btnSettings.memoryOpenButton}>M</Button>
            </div>
            <div className="calc">
                <Button btnSettings={this.btnSettings.percentBtn}>%</Button>
                <Button btnSettings={this.btnSettings.sqrtBtn}>√</Button>
                <Button btnSettings={this.btnSettings.powBtn}><span className="span">x</span></Button>
                <Button btnSettings={this.btnSettings.fracBtn}><span className="span">/</span></Button>
            </div>
            <div className="calc">
                <Button btnSettings={this.btnSettings.ceBtn}>CE</Button>
                <Button btnSettings={this.btnSettings.clearBtn}>C</Button>
                <Button btnSettings={this.btnSettings.backspaceBtn}>{`<-`}</Button>
                <Button btnSettings={this.btnSettings.operationBtn}>÷</Button>
            </div>
            <div className="calc">
                <Button btnSettings={this.btnSettings.number}>7</Button>
                <Button btnSettings={this.btnSettings.number}>8</Button>
                <Button btnSettings={this.btnSettings.number}>9</Button>
                <Button btnSettings={this.btnSettings.operation}>*</Button>
            </div>
            <div className="calc">
                <Button btnSettings={this.btnSettings.number}>4</Button>
                <Button btnSettings={this.btnSettings.number}>5</Button>
                <Button btnSettings={this.btnSettings.number}>6</Button>
                <Button btnSettings={this.btnSettings.operation}>-</Button>
            </div>
            <div className="calc">
                <Button btnSettings={this.btnSettings.number}>1</Button>
                <Button btnSettings={this.btnSettings.number}>2</Button>
                <Button btnSettings={this.btnSettings.number}>3</Button>
                <Button btnSettings={this.btnSettings.operation}>+</Button>
            </div>
            <div className="calc">
            <Button btnSettings={this.btnSettings.addPointBtn}>±</Button>
                <Button btnSettings={this.btnSettings.number}>0</Button>
                <Button btnSettings={this.btnSettings.addPointBtn}>,</Button>
                <Button btnSettings={this.btnSettings.resultBtn}>=</Button>
            </div>
            <div className="memory js-memory">
            </div>
        </div>
        )
    }
}
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class MemoryBlock extends Component {
    static propTypes = {
        clearItemFromMemoryBoard: PropTypes.func,
        updateLocalStorage: PropTypes.func,
        displayValue: PropTypes.string,
        memory: PropTypes.object
    }

    static defaultProps = {
        clearItemFromMemoryBoard: () => {},
        updateLocalStorage: () => {},
        displayValue: '',
        memory: {}
    }

    constructor() {
        super();
        this.mouseOver = false;
        this.state = { mouseOverMemoryItem: false };
    }

    handleMouseOver = () => {
        this.setState({ mouseOverMemoryItem: true });
    }

    handleMouseOut = () => {
        this.setState({ mouseOverMemoryItem: false });
    }

    plus = () => {
        const { updateLocalStorage, displayValue, memory } = this.props;

        memory.data = parseFloat(memory.data) + parseFloat(displayValue);
        updateLocalStorage(memory);
        this.setState({ memoryData: memory.data});        
    }

    minus = () => {
        const { updateLocalStorage, displayValue, memory } = this.props;

        memory.data = parseFloat(memory.data) - parseFloat(displayValue);
        updateLocalStorage(memory);
        this.setState({ memoryData: memory.data});    
    }

    clear = () => {
        const { onClearMemoryItem, memory } = this.props;

        onClearMemoryItem(memory);
    }

    get classNames() {
        if (this.state.mouseOverMemoryItem) {
            return {
                btnMC: "memory__btn memory__btn_mc visible",
                btnMPlus: "memory__btn memory__btn_m_plus visible",
                btnMinus: "memory__btn memory__btn_m_minus visible"
            }
        }
        return {
            btnMC: "memory__btn memory__btn_mc",
            btnMPlus: "memory__btn memory__btn_m_plus",
            btnMinus: "memory__btn memory__btn_m_minus"
        }
    }

    render() {
        const { memory } = this.props;

        return (
            <div onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} className="memory__block" data-position={memory.position}>
                <div className="memory__data">{memory.data}</div>
                <div onClick={this.clear} className={this.classNames.btnMC}>MC</div>
                <div onClick={this.plus} className={this.classNames.btnMPlus}>M+</div>
                <div onClick={this.minus} className={this.classNames.btnMinus}>M-</div>
            </div>
        )
    }
}

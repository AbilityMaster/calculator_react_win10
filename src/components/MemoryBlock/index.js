import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';

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
        this.state = {
            mouseOverMemoryItem: false
        }
    }

    shouldComponentUpdate() {
        return true;
    }

    handleMouseOver = () => {
        this.setState({ mouseOverMemoryItem: true });
    }

    handleMouseOut = () => {
        this.setState({ mouseOverMemoryItem: false });
    }

    plus = () => {
        const { updateLocalStorage, memory, getTextDisplay } = this.props;

        memory.data = parseFloat(memory.data) + parseFloat(getTextDisplay);
        updateLocalStorage(memory);
        this.setState({ memoryData: memory.data});        
    }

    minus = () => {
        const { updateLocalStorage, memory, getTextDisplay} = this.props;

        memory.data = parseFloat(memory.data) - parseFloat(getTextDisplay);
        updateLocalStorage(memory);
        this.setState({ memoryData: memory.data });    
    }

    clear = () => {
        const { onClearMemoryItem, memory } = this.props;

        onClearMemoryItem(memory);
    }

    get classNames() {
        if (this.state.mouseOverMemoryItem) {
            return {
                btnMC: "calculator__memory-board-btn calculator__memory-board-btn_visible",
                btnMPlus: "calculator__memory-board-btn calculator__memory-board-btn_visible",
                btnMinus: "calculator__memory-board-btn calculator__memory-board-btn_visible"
            }
        }
        return {
            btnMC: "calculator__memory-board-btn",
            btnMPlus: "calculator__memory-board-btn",
            btnMinus: "calculator__memory-board-btn"
        }
    }

    render() {
        const { memory } = this.props;

        return (
            <div onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} className="calculator__memory-item" data-position={memory.position}>
                <div className="calculator__memory-data">{memory.data}</div>
                <Button onClick={this.clear} className={this.classNames.btnMC}>MC</Button>
                <Button onClick={this.plus}  className={this.classNames.btnMPlus}>M+</Button>
                <Button onClick={this.minus} className={this.classNames.btnMinus}>M-</Button>              
            </div>
        )
    }
}

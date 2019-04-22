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
        this.$btnMemoryClear = React.createRef();
        this.$btnMemoryPlus = React.createRef();
        this.$btnMemoryMinus = React.createRef();
    }

    handleMouseOver = () => {
        this.$btnMemoryClear.current.style.opacity = '1';
        this.$btnMemoryClear.current.style.cursor = 'pointer';
        this.$btnMemoryPlus.current.style.opacity = '1';
        this.$btnMemoryPlus.current.style.cursor = 'pointer';
        this.$btnMemoryMinus.current.style.opacity = '1';
        this.$btnMemoryMinus.current.style.cursor = 'pointer';
    }

    handleMouseOut = () => {
        this.$btnMemoryClear.current.style.opacity = '0';
        this.$btnMemoryPlus.current.style.opacity = '0';
        this.$btnMemoryMinus.current.style.opacity = '0';
    }

    plus = () => {
        const { updateLocalStorage } = this.props;
        const { displayValue } = this.props;
        const { memory } = this.props;

        memory.data = parseFloat(memory.data) + parseFloat(displayValue);
        updateLocalStorage(memory);
        this.setState({ memoryData: memory.data});        
    }

    minus = () => {
        const { updateLocalStorage } = this.props;
        const { displayValue } = this.props;
        const { memory } = this.props;

        memory.data = parseFloat(memory.data) - parseFloat(displayValue);
        updateLocalStorage(memory);
        this.setState({ memoryData: memory.data});    
    }

    clear = () => {
        const { clearItemFromMemoryBoard } = this.props;
        const { memory } = this.props;

        clearItemFromMemoryBoard(memory);
    }


    render() {
        const { memory } = this.props;

        return (
            <div onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} className="memory__block" data-position={memory.position}>
                <div className="memory__data">{memory.data}</div>
                <div ref={this.$btnMemoryClear} onClick={this.clear} className="memory__btn memory__btn_mc" style={{ 'opacity': '0', 'cursor': 'pointer' }}>MC</div>
                <div ref={this.$btnMemoryPlus} onClick={this.plus} className="memory__btn memory__btn_m_plus" style={{ 'opacity': '0', 'cursor': 'pointer' }}>M+</div>
                <div ref={this.$btnMemoryMinus} onClick={this.minus} className="memory__btn memory__btn_m_minus" style={{ 'opacity': '0', 'cursor': 'pointer' }}>M-</div>
            </div>
        )
    }
}

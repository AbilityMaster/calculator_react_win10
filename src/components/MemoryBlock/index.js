import React, { Component } from 'react';

export default class MemoryBlock extends Component {
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

    render() {
        const { memory } = this.props;
     //   console.log(memory);


        return (
            <div onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} className="memory__block" data-position={memory.position}>
                <div className="memory__data">{memory.data}</div>
                <div ref={this.$btnMemoryClear} className="memory__btn memory__btn_mc" style={{ 'opacity': '0', 'cursor': 'pointer' }}>MC</div>
                <div ref={this.$btnMemoryPlus} className="memory__btn memory__btn_m_plus" style={{ 'opacity': '0', 'cursor': 'pointer' }}>M+</div>
                <div ref={this.$btnMemoryMinus} className="memory__btn memory__btn_m_minus" style={{ 'opacity': '0', 'cursor': 'pointer' }}>M-</div>
            </div>
        )
    }
}

import React, { Component } from 'react';
import { MAX_WIDTH_DISPLAY } from '../../const';

export default class HistoryDisplay extends Component {
    constructor() {
        super();
        this.$smallDisplay = React.createRef();
        this.$hiddenDisplay = React.createRef();
        this.$buttonMoveLeft = React.createRef();
        this.$buttonMoveRight = React.createRef();
    }

   btnMoveLeft = () => {
        if (this.$smallDisplay.current.clientWidth > MAX_WIDTH_DISPLAY) {
            this.$smallDisplay.current.style.removeProperty('right');
            this.$smallDisplay.current.style.left = 0;
            this.$smallDisplay.current.style.textAlign = 'left';
          }
    }
    
   btnMoveRight = () => {
    if (this.$smallDisplay.current.clientWidth > MAX_WIDTH_DISPLAY) {
        this.$smallDisplay.current.style.removeProperty('left');
        this.$smallDisplay.current.style.right = 0;
        this.$smallDisplay.current.style.textAlign = 'right';
      }
    }

    render() {
        const { value } = this.props;
        const { displayHiddenHistoryvalue } = this.props;
        const { styleSettings } = this.props;

        return (
            <div style={{ 'display': styleSettings}} className="group-small-display js-group-small-display">
                <div onClick={this.btnMoveLeft} ref={this.$buttonMoveLeft} className="small-display__button small-display__button_left js-small-display__button_left"></div>
                <div className="small-display">
                    <div ref={this.$smallDisplay} className="small-display__block js-small-display__block">{value}</div>
                    <div ref={this.$hiddenDisplay} className="small-display__add js-small-display__add">{displayHiddenHistoryvalue}</div>
                </div>
                <div onClick={this.btnMoveRight} ref={this.$buttonMoveRight} className="small-display__button small-display__button_right js-small-display__button_right"></div>
            </div>
        )
    }
}
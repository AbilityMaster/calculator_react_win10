import React, { Component } from 'react';

export default class HistoryDisplay extends Component {
    render() {
        return (
            <div className="group-small-display js-group-small-display">
                <div className="small-display__button small-display__button_left js-small-display__button_left"></div>
                <div className="small-display">
                    <div className="small-display__block js-small-display__block"></div>
                    <div className="small-display__add js-small-display__add"></div>
                </div>
                <div className="small-display__button small-display__button_right js-small-display__button_right"></div>
            </div>
        )
    }
}
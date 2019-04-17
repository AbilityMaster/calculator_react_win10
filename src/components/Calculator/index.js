import React, { Component } from 'react';
import '../../scss/st.scss';
import HistoryDisplay from '../HistoryDisplay';
import Display from '../Display';
import ButtonArea from '../ButtonArea';

export default class Calculator extends Component {
    render() {
        return (
            <div className="calculator js-calculator">
                <div className="index-menu">
                    <p className="index-menu__title js-index-menu__title">Калькулятор</p>
                    <div className="index-menu__button index-menu__button_trey js-index-menu__button_trey">–</div>
                    <div className="index-menu__button index-menu__button_open js-index-menu__button_open">☐</div>
                    <div className="index-menu__button index-menu__button_close js-index-menu__button_close">✕</div>
                </div>
                <div className="option-menu js-option-menu">
                    <div className="option-menu__btn-menu">☰</div>
                    <p className="option-menu__title">Обычный</p>
                    <div className="option-menu__btn-journal"></div>
                </div>
                <HistoryDisplay />
                <Display />
                <ButtonArea />
            </div>
        )
    }
}

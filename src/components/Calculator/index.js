import React, { Component } from 'react';
import '../../scss/st.scss';
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
                <div className="group-small-display js-group-small-display">
                    <div className="small-display__button small-display__button_left js-small-display__button_left"></div>
                    <div className="small-display">
                        <div className="small-display__block js-small-display__block"></div>
                        <div className="small-display__add js-small-display__add"></div>
                    </div>
                    <div className="small-display__button small-display__button_right js-small-display__button_right"></div>
                </div>
                <div className="display js-display">0</div>
                <ButtonArea />
            </div>
        )
    }
}

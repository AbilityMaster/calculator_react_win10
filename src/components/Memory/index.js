import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MemoryBlock from '../MemoryBlock';

export default class Memory extends Component {
    static propTypes = {
        clearItemFromMemoryBoard: PropTypes.func,
        updateLocalStorage: PropTypes.func,
        displayValue: PropTypes.string,
        isOpen: PropTypes.bool,
        values: PropTypes.array
    }

    static defailtProps = {
        clearItemFromMemoryBoard: () => { },
        updateLocalStorage: () => { },
        displayValue: '',
        isOpen: false,
        values: []
    }

    get classNames() {
        const { isOpen } = this.props;
        const classNames = ['calculator__memory-board'];

        if (isOpen) {
            classNames.push('calculator__memory-board_visible');

            return classNames.join(' ');
        }

        return classNames.join(' ');
    }

    renderMemoryItems() {
        const { values, displayValue, updateLocalStorage, onClearMemoryItem } = this.props;

        const memoryElements = values.map((memory) =>
            <MemoryBlock
                onClearMemoryItem={onClearMemoryItem}
                updateLocalStorage={updateLocalStorage}
                displayValue={displayValue}
                key={memory.id}
                memory={memory}
            />
        );

        return memoryElements;
    }

    render() {
        return (
            <div className={this.classNames}>
                {this.renderMemoryItems()}
            </div>
        )
    }
}
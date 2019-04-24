import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MemoryBlock from '../MemoryBlock';

export default class Memory extends Component {
    static propTypes = {
        clearItemFromMemoryBoard: PropTypes.func,
        updateLocalStorage: PropTypes.func,
        displayValue: PropTypes.string,
        isOpenMemoryWindow: PropTypes.bool,
        memoryValues: PropTypes.array
    }

    static defailtProps = {
        clearItemFromMemoryBoard: () => { },
        updateLocalStorage: () => { },
        displayValue: '',
        isOpenMemoryWindow: false,
        memoryValues: []
    }

    get classNames() {
        const { isOpenMemoryWindow } = this.props;
        const classNames = ['memory'];

        if (isOpenMemoryWindow) {
            classNames.push('visibility');

            return classNames.join(' ');
        }

        return classNames.join(' ');
    }

    renderMemoryItems() {
        const { memoryValues, displayValue, updateLocalStorage, onClearMemoryItem } = this.props;

        const memoryElements = memoryValues.map((memory) =>
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
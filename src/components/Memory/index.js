import React, { Component } from 'react';
import MemoryBlock from '../MemoryBlock';


export default class Memory extends Component {




    render() {
        const { memoryValues } = this.props;
        const { isVisualMemoryBoard } = this.props;
        let classProperties = "memory js-memory";

       const memoryElements = memoryValues.map((memory) =>
            <MemoryBlock key={memory.id} memory={memory} />
        );

        if (isVisualMemoryBoard) {
            classProperties += ` visibility`
        } else {
            classProperties = "memory js-memory";
        }
        
        return (
            <div className={classProperties}>
              {memoryElements}
            </div>
        )
    }
}
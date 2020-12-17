import React, { Component } from 'react'
import {render} from 'react-dom'
import 'rsuite/dist/styles/rsuite-default.css'
import Reg from './Reg'
import 'draft-js/dist/Draft.css';
import "./style.css" 

export default class App extends Component {
    
    render() {
        return (
            <div>
                <Reg></Reg>
            </div>
        )
    }
}

render(<App/>,document.querySelector("#root"))
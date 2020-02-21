// Bootstrapping for entire application
import * as React from 'react'
import { render } from 'react-dom'
import { App } from './app/app'
import "./index.css"

render(<App/>, document.getElementById('app'))

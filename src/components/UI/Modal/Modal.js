import { Component } from 'react'

import classes from './Modal.module.css'
import Aux from '../../../hoc/Auxiliary/Auxiliary'
import Backdrop from '../Backdrop/Backdrop'

class Modal extends Component {
  // NOTE: Checks if the the state of the BurgerBuild has changed in order to prevent render
  // when only Ingredients are changed -> it also prevents render on OrderSummary (Which is a wrapped by Modal)
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return nextProps.show !== this.props.show || nextProps.children !== this.props.children
  }

  render() {
    return (
      <Aux>
        <Backdrop
          show={this.props.show}
          clicked={this.props.modalClosed}
        ></Backdrop>
        <div
          style={{
            transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: this.props.show ? '1' : '0',
          }}
          className={classes.Modal}
        >
          {this.props.children}
        </div>
      </Aux>
    )
  }
}

export default Modal

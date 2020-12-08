import { Component } from 'react'
import { Route } from 'react-router-dom'

import ContactData from './ContactData/ContactData'
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'

class Checkout extends Component {
  state = {
    ingredients: [],
    price: 0,
  }

  componentDidMount() {
    const search = this.props.location.search
    const params = new URLSearchParams(search)
    const ingredients = {}
    let price = 0
    for (let param of params.entries()) {
      if (param[0] === 'price') {
        price = param[1]
      } else {
        ingredients[param[0]] = +param[1]
      }
    }
    this.setState({
      ingredients: ingredients,
      price: +price,
    })
  }

  checkoutCancelledHandler = () => {
    this.props.history.goBack()
  }

  checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data')
  }

  render() {
    return (
      <div>
        <CheckoutSummary
          ingredients={this.state.ingredients}
          checkoutCancelled={this.checkoutCancelledHandler}
          checkoutContinued={this.checkoutContinuedHandler}
        />
        <Route
          path={`${this.props.match.path}/contact-data`}
          render={(props) => (
            <ContactData
              {...props}
              ingredients={this.state.ingredients}
              price={this.state.price}
            />
          )}
        />
      </div>
    )
  }
}
export default Checkout

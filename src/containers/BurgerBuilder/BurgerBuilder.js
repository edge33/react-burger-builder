import { Component } from 'react'
import Aux from '../../hoc/Auxiliary/Auxiliary'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios-orders'

const INGREDIENTS_PRICE = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
}

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    error: false,
  }

  componentDidMount() {
    axios
      .get('/ingredients.json')
      .then((response) => {
        this.setState({ ingredients: response.data })
      })
      .catch((_) => this.setState({ error: true }))
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map((igKey) => ingredients[igKey])
      .reduce((acc, curr) => acc + curr, 0)
    this.setState({ purchasable: sum })
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type]
    const updatedCount = oldCount + 1
    const updatedIngredients = { ...this.state.ingredients }
    updatedIngredients[type] = updatedCount
    const priceAddition = INGREDIENTS_PRICE[type]
    const oldPrice = this.state.totalPrice
    const newPrice = oldPrice + priceAddition
    this.setState({ ingredients: updatedIngredients, totalPrice: newPrice })
    this.updatePurchaseState(updatedIngredients)
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type]
    if (oldCount === 0) {
      return
    }
    const updatedCount = oldCount - 1
    const updatedIngredients = { ...this.state.ingredients }
    updatedIngredients[type] = updatedCount
    const priceDeduction = INGREDIENTS_PRICE[type]
    const oldPrice = this.state.totalPrice
    const newPrice = oldPrice - priceDeduction
    this.setState({ ingredients: updatedIngredients, totalPrice: newPrice })
    this.updatePurchaseState(updatedIngredients)
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true })
  }

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false })
  }

  purchaseContinueHandler = () => {
    const queryParams = []
    for (const i in this.state.ingredients) {
      queryParams.push(
        `${encodeURIComponent(i)}=${encodeURIComponent(
          this.state.ingredients[i],
        )}`,
      )
    }
    queryParams.push(`price=${this.state.totalPrice}`)
    const queryString = queryParams.join('&')
    this.props.history.push({
      pathname: '/checkout',
      search: `?${queryString}`,
    })
  }

  render() {
    const disabledInfo = {
      ...this.state.ingredients,
    }
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }
    let orderSummary = null
    let burger = this.state.error ? (
      <p>Ingredients can't be loaded!</p>
    ) : (
      <Spinner />
    )
    if (this.state.ingredients) {
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disabledInfo}
            price={this.state.totalPrice}
            ordered={this.purchaseHandler}
            purchasable={this.state.purchasable}
          />
        </Aux>
      )
      orderSummary = (
        <OrderSummary
          ingredients={this.state.ingredients}
          purchaseCanceled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          price={this.state.totalPrice}
        />
      )
    }

    return (
      <Aux>
        {/* NOTE: Changing ingredients cause the OrderSummary to render, but due to the ShouldComponentUpdate
        hander in Modal, it will cause its sub components to re-render only if the show props is changed*/}
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    )
  }
}

export default withErrorHandler(BurgerBuilder, axios)

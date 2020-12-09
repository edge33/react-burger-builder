import { Component } from 'react'
import Aux from '../../hoc/Auxiliary/Auxiliary'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios-orders'
import { connect } from 'react-redux'
import * as actions from '../../store/actions'

class BurgerBuilder extends Component {
  state = {
    purchasing: false,
    error: false,
  }

  componentDidMount() {
    // axios
    //   .get('/ingredients.json')
    //   .then((response) => {
    //     this.setState({ ingredients: response.data })
    //   })
    //   .catch((_) => this.setState({ error: true }))
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true })
  }

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false })
  }

  purchaseContinueHandler = () => {
    this.props.history.push('/checkout')
  }

  render() {
    const disabledInfo = {
      ...this.props.ingredients,
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
    if (this.props.ingredients) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ingredients} />
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            price={this.props.totalPrice}
            ordered={this.purchaseHandler}
            ingredients={this.props.ingredients}
          />
        </Aux>
      )
      orderSummary = (
        <OrderSummary
          ingredients={this.props.ingredients}
          purchaseCanceled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          price={this.props.totalPrice}
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

const mapsStateToProps = (state) => {
  return {
    ingredients: state.ingredients,
    totalPrice: state.totalPrice,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (name) =>
      dispatch({ type: actions.ADD_INGREDIENT, ingredientName: name }),
    onIngredientRemoved: (name) =>
      dispatch({ type: actions.REMOVE_INGREDIENT, ingredientName: name }),
  }
}

export default connect(
  mapsStateToProps,
  mapDispatchToProps,
)(withErrorHandler(BurgerBuilder, axios))

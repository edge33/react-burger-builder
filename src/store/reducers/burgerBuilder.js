 import * as actions from '../actions/actionTypes'
import { updateObject } from '../utility'

const INGREDIENTS_PRICE = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
}

const initialState = {
  ingredients: null,
  totalPrice: 4,
  error: false,
  building: false
}

const addIngredient = (state, action) => {
  const updatedIngredient = updateObject({
    [action.ingredientName]: state.ingredients[action.ingredientName] + 1,
  })
  const updatedIngredients = updateObject(state.ingredients, updatedIngredient)
  const updatedState = {
    ingredients: updatedIngredients,
    totalPrice: state.totalPrice + INGREDIENTS_PRICE[action.ingredientName],
    building: true
  }
  return updatedState
}

const removeIngredient = (state, action) => {
  const updatedIng = updateObject({
    [action.ingredientName]: state.ingredients[action.ingredientName] - 1,
  })
  const updatedIngs = updateObject(state.ingredients, updatedIng)
  const updatedSt = {
    ingredients: updatedIngs,
    totalPrice: state.totalPrice + INGREDIENTS_PRICE[action.ingredientName],
    building: false
  }
  return updateObject(state, updatedSt)
}

const setIngredients = (state, action) => {
  return updateObject(state, {
    ingredients: action.ingredients,
    error: false,
    totalPrice: 4,
    building: false
  })
}

const fetchIngredientsFailed = (state, action) => {
  return updateObject(state, { error: true })
}

const burgerBuilder = (state = initialState, action) => {
  switch (action.type) {
    case actions.ADD_INGREDIENT:
      return addIngredient(state, action)
    case actions.REMOVE_INGREDIENT:
      return removeIngredient(state, action)
    case actions.SET_INGREDIENTS:
      return setIngredients(state, action)
    case actions.FETCH_INGREDIENTS_FAILED:
      return fetchIngredientsFailed(state, action)
    default:
      return state
  }
}

export default burgerBuilder

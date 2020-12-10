import * as actionTypes from './actionTypes'
import axios from '../../axios-orders'

export const addIngredient = (ingredient) => {
  return {
    type: actionTypes.ADD_INGREDIENT,
    ingredientName: ingredient,
  }
}

export const removeIngredient = (ingredient) => {
  return {
    type: actionTypes.REMOVE_INGREDIENT,
    ingredientName: ingredient,
  }
}

export const setIngredients = (ingredients) => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    ingredients,
  }
}

export const fetchIngredientsFailed = () => {
  return {
    type: actionTypes.FETCH_INGREDIENTS_FAILED,
  }
}

export const initIngredients = () => {
  return (dispatch, getState, extra) => {
    axios
      .get('/ingredients.json')
      .then((response) => dispatch(setIngredients(response.data)))
      .catch((_) => dispatch(fetchIngredientsFailed()))
    setTimeout(() => {}, 2500)
  }
}

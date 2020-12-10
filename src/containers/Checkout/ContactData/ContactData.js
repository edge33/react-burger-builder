import { Component } from 'react'
import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.module.css'
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../../axios-orders'
import { connect } from 'react-redux'
import * as actions from '../../../store/actions/index'

const VALIDATION_MESSAGES = {
  required: 'The field is required',
  minLength: 'The field must be at least % characters long',
  maxLength: 'The field must be at most % characters long',
}

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: { type: 'text', placeholder: 'Name' },
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        errorMessage: '',
      },
      street: {
        elementType: 'input',
        elementConfig: { type: 'text', placeholder: 'Street' },
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        errorMessage: '',
      },
      zipCode: {
        elementType: 'input',
        elementConfig: { type: 'text', placeholder: 'ZipCode' },
        value: '',
        validation: {
          required: true,
          minLength: 5,
          maxLength: 5,
        },
        valid: false,
        touched: false,
        errorMessage: '',
      },
      country: {
        elementType: 'input',
        elementConfig: { type: 'text', placeholder: 'Country' },
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        errorMessage: '',
      },
      email: {
        elementType: 'input',
        elementConfig: { type: 'email', placeholder: 'Email' },
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        errorMessage: '',
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            { value: 'fastest', displayValue: 'Fastest' },
            { value: 'cheapest', displayValue: 'Cheapest' },
          ],
        },
        value: 'fastest',
        validation: {},
        valid: true,
      },
    },
    formIsValid: false,
  }

  orderHandler = (event) => {
    event.preventDefault()
    const formData = {}
    for (const formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[
        formElementIdentifier
      ].value
    }

    const order = {
      ingredients: { ...this.props.ingredients },
      price: this.props.totalPrice,
      orderData: formData,
    }
    this.props.purchaseBurger(order)
  }

  checkValidity = (value, rules) => {
    let isValid = true
    if (rules.required) {
      isValid = value.trim() !== '' && isValid
      if (!isValid) {
        return { isValid: false, errorMessage: VALIDATION_MESSAGES.required }
      }
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid
      if (!isValid) {
        return {
          isValid: false,
          errorMessage: VALIDATION_MESSAGES.minLength.replace(
            '%',
            rules.minLength,
          ),
        }
      }
    }
    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid

      if (!isValid) {
        return {
          isValid: false,
          errorMessage: VALIDATION_MESSAGES.maxLength.replace(
            '%',
            rules.maxLength,
          ),
        }
      }
    }
    return { isValid: true, errorMessage: '' }
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm,
    }
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier],
    }
    updatedFormElement.value = event.target.value
    const formElementValidity = this.checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation,
    )
    updatedFormElement.valid = formElementValidity.isValid
    updatedFormElement.errorMessage = formElementValidity.errorMessage
    updatedFormElement.touched = true
    updatedOrderForm[inputIdentifier] = updatedFormElement

    let formIsValid = true
    for (const inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid
    }
    this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid })
  }

  render() {
    const formElements = []
    for (const element in this.state.orderForm) {
      formElements.push({
        id: element,
        config: this.state.orderForm[element],
      })
    }

    let form = (
      <form onSubmit={this.orderHandler}>
        {formElements.map((formElement) => (
          <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            touched={formElement.config.touched}
            errorMessage={formElement.config.errorMessage}
            shouldValidate={formElement.config.validation}
            changed={(event) => this.inputChangedHandler(event, formElement.id)}
          />
        ))}
        <Button disabled={!this.state.formIsValid} btnType="Success">
          ORDER
        </Button>
      </form>
    )
    if (this.props.loading) {
      form = <Spinner />
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    purchaseBurger: (orderData) => dispatch(actions.purchaseBurger(orderData)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withErrorHandler(ContactData, axios))

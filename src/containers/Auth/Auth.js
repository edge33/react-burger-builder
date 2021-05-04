import { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import Spinner from '../../components/UI/Spinner/Spinner'
import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import classes from './Auth.module.css'
import * as actions from '../../store/actions/index'

const VALIDATION_MESSAGES = {
  required: 'The field is required',
  isEmail: 'The field must contain a valid e-mail address',
  minLength: 'The field must be at least % characters long',
  maxLength: 'The field must be at most % characters long',
}

//TODO: HANDLE WHOLE FORM VALIDITY
class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: 'input',
        elementConfig: { type: 'email', placeholder: 'Mail Address' },
        value: '',
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        touched: false,
        errorMessage: '',
      },
      password: {
        elementType: 'input',
        elementConfig: { type: 'password', placeholder: 'Password' },
        value: '',
        validation: {
          required: true,
          minLength: 6,
        },
        valid: false,
        touched: false,
        errorMessage: '',
      },
    },
    isSignup: true,
  }

  componentDidMount() {
    if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
      this.props.onSetAuthRedirectPath('/');
    }
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
          errorMessage: VALIDATION_MESSAGES.minLength.replace('%', rules.minLength),
        }
      }
    }
    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid

      if (!isValid) {
        return {
          isValid: false,
          errorMessage: VALIDATION_MESSAGES.maxLength.replace('%', rules.maxLength),
        }
      }
    }

    if (rules.isEmail) {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      isValid = pattern.test(value) && isValid
      if (!isValid) {
        return {
          isValid: false,
          errorMessage: VALIDATION_MESSAGES.isEmail,
        }
      }
    }
    return { isValid: true, errorMessage: '' }
  }

  inputChangedHandler = (event, controlName) => {
    const fieldValidity = this.checkValidity(event.target.value, this.state.controls[controlName].validation)
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: fieldValidity.isValid,
        errorMessage: fieldValidity.errorMessage,
        touched: true,
      },
    }
    this.setState({ controls: updatedControls })
  }

  submitHandler = (event) => {
    event.preventDefault()

    this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup)
  }

  swithAuthModeHandler = () => {
    this.setState((prevState) => {
      return { isSignup: !prevState.isSignup }
    })
  }

  render() {
    const formElements = []
    for (const element in this.state.controls) {
      formElements.push({
        id: element,
        config: this.state.controls[element],
      })
    }

    let form = formElements.map((formElement) => (
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
    ))
    let errorMessage = null
    if (this.props.error) {
      errorMessage = <p>{this.props.error.message}</p>
    }

    if (this.props.loading) {
      form = <Spinner />
    }

    if (this.props.isAuthenticated) {
      return <Redirect to={this.props.authRedirectPath} />
    }


    return (
      <div className={classes.Auth}>
        {errorMessage}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType='Success'>SUBMIT</Button>
        </form>
        <Button clicked={this.swithAuthModeHandler} btnType='Danger'>
          SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}
        </Button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)

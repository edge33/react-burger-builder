import { Component } from 'react'
import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.module.css'
import Spinner from '../../../components/UI/Spinner/Spinner'
import axios from '../../../axios-orders'

class ContactData extends Component {
  state = {
    name: '',
    email: '',
    address: {
      street: '',
      postalCode: '',
    },
    loading: false,
  }

  orderHandler = (event) => {
    event.preventDefault()
    const order = {
      ingredients: { ...this.props.ingredients },
      price: this.props.price,
      customerData: {
        name: 'Name',
        address: {
          street: 'TestStreet 1',
          zipCode: '20129',
          country: 'UK',
        },
        email: 'test@test.com',
      },
    }
    this.setState({ loading: true })
    axios
      .post('/orders.json', order)
      .then((response) => {
        this.setState({ loading: false })
        this.props.history.push('/')
      })
      .catch((error) => console.log(error))
  }

  render() {
    let form = (
      <form>
        <input
          className={classes.Input}
          type="text"
          name="name"
          placeholder="Your Name"
        />
        <input
          className={classes.Input}
          type="email"
          name="email"
          placeholder="Your Email"
        />
        <input
          className={classes.Input}
          type="text"
          name="street"
          placeholder="Street"
        />
        <input
          className={classes.Input}
          type="text"
          name="postal"
          placeholder="Postal Code"
        />
        <Button btnType="Success" clicked={this.orderHandler}>
          ORDER
        </Button>
      </form>
    )
    if (this.state.loading) {
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

export default ContactData

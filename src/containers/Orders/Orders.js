import { Component } from 'react'

import Order from '../../components/Order/Order'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios-orders'

class Orders extends Component {
  state = {
    orders: [],
    loading: true,
  }
  componentDidMount() {
    axios
      .get('/orders.json')
      .then((response) => {
        const fetchedOrders = []
        for (const key in response.data) {
          fetchedOrders.push({
            id: key,
            ...response.data[key],
          })
        }
        this.setState({
          orders: fetchedOrders,
          loading: false,
        })
      })
      .catch((error) => {
        this.setState({ loading: false })
      })
  }

  render() {
    const orders = this.state.orders.map((order) => {
      return (
        <Order
          key={order.id}
          ingredients={order.ingredients}
          price={order.price}
        />
      )
    })

    return <div>{orders}</div>
  }
}

export default withErrorHandler(Orders, axios)
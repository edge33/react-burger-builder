import classes from './BuildControls.module.css'
import BuildControl from './BuildControl/BuildControl'

const updatePurchaseState = (ingredients) => {
  const sum = Object.keys(ingredients)
    .map((igKey) => ingredients[igKey])
    .reduce((acc, curr) => acc + curr, 0)
  return sum
}

const buildControls = (props) => {
  let controls = []
  for (const ingredient in props.ingredients) {
    controls.push({
      label: `${ingredient.substr(0, 1).toUpperCase()}${ingredient
        .substr(1)
        .toLowerCase()}`,
      type: ingredient,
    })
  }
  const disabled = updatePurchaseState(props.ingredients) === 0
  return (
    <div className={classes.BuildControls}>
      <p>
        Current Price: <strong>{props.price.toFixed(2)}</strong>
      </p>
      {controls.map((control) => (
        <BuildControl
          key={control.label}
          label={control.label}
          added={() => props.ingredientAdded(control.type)}
          removed={() => props.ingredientRemoved(control.type)}
          disabled={props.disabled[control.type]}
        />
      ))}
      <button
        onClick={props.ordered}
        disabled={disabled}
        className={classes.OrderButton}
      >
        ORDER NOW
      </button>
    </div>
  )
}

export default buildControls

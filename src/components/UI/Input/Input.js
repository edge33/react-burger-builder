import classes from './Input.module.css'

const input = (props) => {
  let inputElement = null
  const inputClasses = [classes.InputElement]
  let validationMessage = null
  if (props.invalid && props.shouldValidate && props.touched) {
    inputClasses.push(classes.Invalid)
    validationMessage = (
      <p className={classes.ValidationError}>{props.errorMessage}</p>
    )
  }
  const classString = inputClasses.join(' ')
  switch (props.elementType) {
    case 'input':
      inputElement = (
        <input
          className={classString}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
          onBlur={props.changed}
        />
      )
      break
    case 'textarea':
      inputElement = (
        <textarea
          className={classString}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
          onBlur={props.changed}
        />
      )
      break
    case 'select':
      inputElement = (
        <select
          className={classString}
          value={props.value}
          onChange={props.changed}
        >
          {props.elementConfig.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.displayValue}
            </option>
          ))}
        </select>
      )
      break
    default:
      inputElement = (
        <input
          className={classString}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      )
  }

  return (
    <div className={classes.Input}>
      <label>{props.label}</label>
      {inputElement}
      {validationMessage}
    </div>
  )
}

export default input

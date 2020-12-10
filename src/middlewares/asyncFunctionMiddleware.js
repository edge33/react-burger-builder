const createAsyncFunctionMiddleware = (extraArgs) => ({
  dispatch,
  getState,
}) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(dispatch, getState, extraArgs)
  }
  return next(action)
}

const asyncFunctionMiddleware = createAsyncFunctionMiddleware()
asyncFunctionMiddleware.withExtraArgs = createAsyncFunctionMiddleware

export default asyncFunctionMiddleware

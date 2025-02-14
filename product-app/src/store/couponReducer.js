const initialState = {
    value: null,
  };
  
  const couponReducer = (state = initialState, action) => {
    console.log('Coupon Reducer Action:', action); // Log actions received by this reducer
    switch (action.type) {
      case 'GENERATE_COUPON':
        console.log('Updated State in Reducer:', { ...state, value: action.payload });
        return {
          ...state,
          value: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default couponReducer;
  
  
  
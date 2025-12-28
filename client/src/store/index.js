import { configureStore, createSlice } from "@reduxjs/toolkit";

// The "Slice" is a piece of the brain that handles transaction data
const fraudSlice = createSlice({
  name: "fraud",
  initialState: { transactions: [] },
  reducers: {
    // This function adds a new transaction to our list
    addTransaction: (state, action) => {
      // We add the new one at the start and keep only the last 10
      state.transactions = [action.payload, ...state.transactions].slice(0, 10);
    },
  },
});

export const { addTransaction } = fraudSlice.actions;

export const store = configureStore({
  reducer: {
    fraud: fraudSlice.reducer,
  },
});

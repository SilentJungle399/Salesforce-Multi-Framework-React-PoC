import { configureStore } from '@reduxjs/toolkit';
import testObjectReducer from './slices/testObjectSlice';
import contactReducer from './slices/ContactsSlice';

export const store = configureStore({
  reducer: {
    testObjects: testObjectReducer,
    contacts: contactReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

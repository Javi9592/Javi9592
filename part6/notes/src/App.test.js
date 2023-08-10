import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux'
import noteReducer from './reducers/noteReducer'
import { configureStore } from '@reduxjs/toolkit'
import filterReducer from './reducers/filterReducer'

const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer
  }
})

test.skip('renders learn react link', () => {
  render(<Provider store={store}>
    <App />
  </Provider>);
  const linkElement = screen.getByText(/notes/i);
  expect(linkElement).toBeInTheDocument();
});

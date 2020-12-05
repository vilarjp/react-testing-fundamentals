import create from 'zustand';
import produce from 'immer';

const initialState = {
  open: false,
  products: [],
};

export const useCartStore = create((set) => {
  const setState = (fn) => set(produce(fn));

  return {
    state: { ...initialState },
    actions: {
      toggle() {
        setState(({ state }) => {
          state.open = !state.open;
        });
      },
      reset() {
        setState((store) => {
          store.state = initialState;
        });
      },
      add(product) {
        setState(({ state }) => {
          const productDoesntExists = !state.products.find(({ id }) => id === product.id);

          if (productDoesntExists) {
            state.products.push(product);
            state.open = true;
          }
        });
      },
      remove(product) {
        setState(({ state }) => {
          const productExists = !!state.products.find(({ id }) => id === product.id);

          if (productExists) {
            state.products = state.products.filter(({ id }) => id !== product.id);
          }
        });
      },
      removeAll() {
        setState(({ state }) => {
          state.products = [];
        });
      },
    },
  };
});

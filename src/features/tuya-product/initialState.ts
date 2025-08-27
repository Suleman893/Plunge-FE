import type { TuyaProductState } from '@custom-types/features/tuyaProduct'

export const initialState: TuyaProductState = {
  isAllProductsLoading: false,
  allProducts: null,

  //Sync Product
  isSyncProductLoading: false
}

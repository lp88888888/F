
interface ProductList {
  image: string;
  name?: string;
  price:string
}
interface MerchantsList {
  name: string;
  address?: string;
  shopUrl?: string;
  distance:string
  productList:ProductList[]
}

// 商品详情
interface ShopDetail {
  name: string;
  price: string|number;
  num:number
}
export type {
  MerchantsList,
  ShopDetail
};

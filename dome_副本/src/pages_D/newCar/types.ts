// 市场活动
interface MarketActivity {
  name:string;
  addr:string;
  img:string;
}
// 经销商
interface DealerType {
  name:string;
  addr:string;
}
// 车
interface CarType {
  name:string;
  icon?:string;
}
export type {
  MarketActivity,
  DealerType,
  CarType
};
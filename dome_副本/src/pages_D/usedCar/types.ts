// 市场活动
interface Form {
  name: string
  phone: string
  brandName?: string
  seriesName?: string
  appointmentTime?: string
  typeName?: string
  brandId?: string
  seriesId?: string
  typeId?: string
  industryId?:string
  industryName?:string
  budget?:string
  remark?:string
}

interface List {
	id?:string
	price?: string|number;
	title?: string
	text: string
	image?: string
}
export type {
  Form,
  List
};
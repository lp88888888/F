import type { CSSProperties } from 'vue';

export interface IImageItem {
	id: string | number;
	url: string;
	width: number;
	height: number;
	[key: string]: any;
}

// 瀑布流虚拟列表
export interface IVirtualWaterFallProps {
	column?: number;
	columnItemCount?: number;
	requestSize?: number;
	gap?: number;
	request?: FsVirtualWaterfallRequest;
}

export interface IColumnQueue {
	list: Array<IRenderItem>;
	height: number;
}

export interface IItemRect {
	width: number;
	height: number;
}

// 渲染视图项
export interface IRenderItem {
	item: IDataItem;
	y: number;
	h: number;
	style: CSSProperties;
}

// 数据源项类型：固定宽高
export interface IDataItem {
	id: number | string;
	width: number;
	height: number;
	[key: string]: any;
}

// 数据请求
export type FsVirtualWaterfallRequest = (
	page: number,
	pageSize: number
) => Promise<{
	total: number;
	list: IDataItem[];
}>;

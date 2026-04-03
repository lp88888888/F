interface TrVehicleVo {
  
  // 暂时设为 any 或留空，后续可补充
}

interface ItemDetail {
	id?:string|number;
	startAddress?:string;
	endAddress?:string;
  
	bodyworkLen?: number | null;
    carType?: string | null;
    contactNumber?: string;
    contactPerson?: string;
    goodsName?: string;
    goodsType?: string; // 
    listed?: boolean | null; 
    loadingAddr?: string[]; 
    loadingAddrLatitude?: number;
    loadingAddrLongitude?: number;
    loadingStraightLineDistance?: number | null;
    tenantId?: number;
    totalDistance?: number | null;
    trVehicleVoList?: TrVehicleVo[] | null;
    sysVehicleVoList?: TrVehicleVo[] | null;
    transportationRequirements?: string;
    unloadingAddr?: string[];
    unloadingAddrLatitude?: number;
    unloadingAddrLongitude?: number;
    unloadingStraightLineDistance?: number | null;
    volume?: number;
    weight?: number;
	price?:string;
	unloadingAddrName?:string;
	loadingAddrName?:string;
}
export type {
  ItemDetail
};
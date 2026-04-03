// 跳转下个页面
export function toNav(url:string){
	uni.navigateTo({
		url:url
	})
}
// 关闭所有页面，跳转下个页面
export function toLau(url:string){
	uni.reLaunch({
		url:url
	})
}
// 关闭当前页面，跳转下个页面
export function toRec(url:string){
	uni.redirectTo({
		url:url
	})
}
// 返回上级页面，失败则返回首页
export function toBack(delta:number){
	uni.navigateBack({
		delta:delta,
		fail: (err) => {
			// 返回失败跳转下一页面
			uni.navigateTo({
				url:"/pages/home/home"
			})
		}
	})
}
// 返回首页
export function toHome(){
	uni.navigateTo({
		url:"/pages/home/home"
	})
}
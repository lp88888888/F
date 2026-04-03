import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getToken, setToken, removeToken } from '@/utils/token';
import { login, logout } from '@/api/login';

export const UserStore = defineStore('user', () => {
	// data
	const token = ref<string | null>(getToken());

	// actions
	// 登录方法
	function Login(loginForm: { username: string; password: string; code: string; uuid: string }) {
		return new Promise<void>((resolve, reject) => {
			login(loginForm.username, loginForm.password, loginForm.code, loginForm.uuid)
				.then((res: { token: string }) => {
					setToken(res.token);
					token.value = res.token;
					resolve();
				})
				.catch((error: unknown) => {
					reject(error);
				});
		});
	}

	// 退出方法
	function LogOut() {
		return new Promise<void>((resolve, reject) => {
			logout()
				.then(() => {
					token.value = '';
					removeToken();
					storage.clean();
					resolve();
				})
				.catch((error: unknown) => {
					reject(error);
				});
		});
	}

	// 返回需要导出的内容
	return { token, Login, LogOut };
});

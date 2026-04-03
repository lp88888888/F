import JSEncrypt from 'jsencrypt';

var key = '-----BEGIN PUBLIC KEY-----' + 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKoR8mX0rGKLqzcWmOzbfj64K8ZIgOdH\n' + 'nzkXSOVOZbFu/TJhZ7rFAN+eaGkl3C4buccQd/EjEsj9ir7ijT7h96MCAwEAAQ==' + '-----END PUBLIC KEY-----';

export function myencrypt(str:string) {
	const jsencrypt = new JSEncrypt();
	jsencrypt.setPublicKey(key);
	return jsencrypt.encrypt(str)
}

export function encrypt(str:string) {
	const jsencrypt = new JSEncrypt();
	jsencrypt.setPublicKey(key);
	return jsencrypt.encrypt(str)
}

import { uploadFile } from '@/utils/upload';

/** OCR 结果数据结构（与页面使用保持兼容） */
export interface OcrResult {
	url?: { readUrl?: string; imageUrl?: string };
	data?: Record<string, any>;
}

/**
 * 行驶证 OCR 识别
 * @param filePath      本地临时文件路径（uni.chooseImage/chooseMedia 返回的路径）
 * @param moduleName    模块名/业务名（例如：'行驶证'）
 * @param ocrType       识别类型：'LICENSE_DEPARTURE_FRONT' | 'LICENSE_DEPARTURE_BACK' | 'LICENSE_DEPARTURE_ELECTRONIC' 等
 * @param successHandler 可选：成功回调（传入 result.data 的实际业务数据，含 url/data）
 * @param failHandler    可选：失败回调
 * @returns Promise<OcrResult> 便于 await 使用
 */
export function ocrRecognition(
	filePath: string,
	moduleName: string,
	ocrType: string,
	successHandler?: (res: OcrResult) => void,
	failHandler?: (err: any) => void
): Promise<OcrResult> {
	return uploadFile<OcrResult>({
		url: '/premium/api/file/ocrRecognition',
		filePath,
		name: 'file',
		formData: { moduleName, ocrType },
		// headers 默认走 token，若要禁用可加 headers: { isToken: false }
	})
		.then((resp) => {
			console.log('ocr的数据', resp);
			// uploadFile 内部已处理业务码，这里直接拿 data
			const data = resp.clazz || {};
			successHandler?.(data);
			return data;
		})
		.catch((err) => {
			console.log('ocr的数据错误', resp);
			failHandler?.(err);
			// 继续抛出，方便上层 try/catch
			throw err;
		});
}
export function ocrRecognitionYldj(
	filePath: string,
	code: string,
	successHandler?: (res: OcrResult) => void,
	failHandler?: (err: any) => void
): Promise<OcrResult> {
	return uploadFile<OcrResult>({
		url: '/system/api/recognition/v1/unifiedOcrRecognition',
		filePath,
		name: 'file',
		formData: { code, path: '' },
		// headers 默认走 token，若要禁用可加 headers: { isToken: false }
	})
		.then((resp) => {
			// uploadFile 内部已处理业务码，这里直接拿 data
			console.log('封装的ocr', resp);
			const data = resp.data || {};
			successHandler?.(data);
			return data;
		})
		.catch((err) => {
			failHandler?.(err);
			// 继续抛出，方便上层 try/catch
			throw err;
		});
}
export default { ocrRecognition, ocrRecognitionYldj };

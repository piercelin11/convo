export function getObjectKeyFromS3Url(s3Url: string): string | null {
	try {
		const url = new URL(s3Url);
		if (
			url.hostname.includes(".s3.") &&
			url.hostname.includes(".amazonaws.com")
		) {
			const objectKey = url.pathname.substring(1);
			return objectKey;
		}
		return null;
	} catch (e) {
		console.error("解析 S3 URL 失敗:", e);
		return null;
	}
}

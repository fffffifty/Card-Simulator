export class ImageUtil {
  // 图片转Base64
  static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Base64 转 Blob
  static base64ToBlob(base64: string): Blob {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([u8arr], { type: mime });
  }

  // 验证图片
  static async validateImage(file: File): Promise<{ valid: boolean; message: string }> {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      return { valid: false, message: '请选择图片文件' };
    }

    // 检查文件大小（最大2MB）
    if (file.size > 2 * 1024 * 1024) {
      return { valid: false, message: '图片大小不能超过2MB' };
    }

    // 检查图片尺寸
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 100 || img.height < 100) {
          resolve({
            valid: false,
            message: '图片尺寸应该至少为100x100像素',
          });
        } else {
          resolve({ valid: true, message: 'OK' });
        }
      };
      img.onerror = () => {
        resolve({ valid: false, message: '图片格式无效' });
      };
      img.src = URL.createObjectURL(file);
    });
  }

  // 压缩图片
  static async compressImage(
    file: File,
    maxWidth: number = 300,
    maxHeight: number = 400,
    quality: number = 0.7
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
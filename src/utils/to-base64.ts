// base64转换
/**
 * file 对象转 base64
 * @param file
 * @param callback
 */
export const fileToBase64 = (file: Blob, callback: (arg0: string | ArrayBuffer | null) => void) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = function () {
      callback(this.result);
    };
};

export default function unifyPromiseVue2() {
  try {
    // eslint-disable-next-line no-inner-declarations
    function isPromise(obj) {
      return Boolean(obj) && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
    }
    // 统一 vue2 API Promise 化返回格式与 vue3 保持一致
    // eslint-disable-next-line no-undef
    (uni as any).addInterceptor({
      returnValue(res) {
        if (!isPromise(res)) {
          return res;
        }
        return new Promise((resolve, reject) => {
          res.then((res) => {
            if (res[0]) {
              reject(res[0]);
            } else {
              resolve(res[1]);
            }
          });
        });
      },
    });
    // eslint-disable-next-line no-empty
  } catch (error) { }
}

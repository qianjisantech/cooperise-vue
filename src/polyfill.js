// Polyfill for axios, @stomp/stompjs and other libraries
// This must be imported FIRST before any other imports

// 确保 globalThis 存在
if (typeof globalThis === 'undefined') {
  (function() {
    if (typeof self !== 'undefined') { return self; }
    if (typeof window !== 'undefined') { return window; }
    if (typeof global !== 'undefined') { return global; }
    throw new Error('unable to locate global object');
  })();
}

// 确保 global 存在
if (typeof global === 'undefined') {
  window.global = window;
}

// 为 axios 提供 Request 和 Response
// axios 会尝试从 globalThis 解构这些对象
if (typeof globalThis.Request === 'undefined') {
  globalThis.Request = class Request {
    constructor() {}
  };
}

if (typeof globalThis.Response === 'undefined') {
  globalThis.Response = class Response {
    constructor() {}
  };
}

if (typeof globalThis.Headers === 'undefined') {
  globalThis.Headers = class Headers {
    constructor() {}
  };
}

console.log('[Polyfill] Global objects initialized', {
  Request: typeof globalThis.Request,
  Response: typeof globalThis.Response,
  Headers: typeof globalThis.Headers
});

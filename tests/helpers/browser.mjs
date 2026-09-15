export async function connectBrowser() {
  const endpoint = process.env.CDP_URL || 'http://127.0.0.1:9237';
  const targets = await (await fetch(`${endpoint}/json/list`)).json();
  const target = targets.find(item => item.type === 'page');
  if (!target) throw new Error(`No page target at ${endpoint}`);
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  let sequence = 0;
  const pending = new Map();
  const errors = [];
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
    if (!message.id) return;
    const request = pending.get(message.id);
    pending.delete(message.id);
    clearTimeout(request.timer);
    if (message.error) request.reject(new Error(JSON.stringify(message.error)));
    else request.resolve(message.result);
  });
  const command = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => reject(new Error(`CDP timeout: ${method}`)), 10000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const until = async (expression, timeout = 4000) => {
    const deadline = Date.now() + timeout;
    do {
      const value = await evaluate(expression);
      if (value) return value;
      await new Promise(resolve => setTimeout(resolve, 40));
    } while (Date.now() < deadline);
    throw new Error(`Condition not met: ${expression}`);
  };
  const key = async (key, code, virtualKey, modifiers = 0) => {
    const params = { key, code, windowsVirtualKeyCode: virtualKey, nativeVirtualKeyCode: virtualKey, modifiers };
    const text = key === 'Enter' ? '\r' : key.length === 1 ? key : undefined;
    await command('Input.dispatchKeyEvent', { type: 'keyDown', ...params, text, unmodifiedText: text });
    await command('Input.dispatchKeyEvent', { type: 'keyUp', ...params });
  };
  const click = async selector => {
    const point = await evaluate(`(() => {
      const node = document.querySelector(${JSON.stringify(selector)});
      node.scrollIntoView({behavior:'instant',block:'center'});
      const rect = node.getBoundingClientRect();
      return {x:rect.x + rect.width / 2, y:rect.y + rect.height / 2};
    })()`);
    for (const type of ['mousePressed', 'mouseReleased']) {
      await command('Input.dispatchMouseEvent', { type, button: 'left', clickCount: 1, ...point });
    }
  };
  await command('Page.enable');
  await command('Runtime.enable');
  return { command, evaluate, until, key, click, errors, close: () => socket.close() };
}

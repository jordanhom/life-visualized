// tests/setup/jsdom-helper.js
export async function setupJSDOM(html = '<!doctype html><html><body></body></html>') {
  const { JSDOM } = await import('jsdom');
  const dom = new JSDOM(html);

  // Attach window and DOM constructors to the global so tests and modules
  // use the same Event / Node constructors (prevents JSDOM/mixed-window flakiness).
  global.window = dom.window;
  global.document = dom.window.document;
  global.HTMLElement = dom.window.HTMLElement;
  global.Node = dom.window.Node;
  global.Event = dom.window.Event;
  global.MouseEvent = dom.window.MouseEvent;
  global.CustomEvent = dom.window.CustomEvent;
  global.KeyboardEvent = dom.window.KeyboardEvent;

  return dom;
}

export function teardownJSDOM(dom) {
  if (dom && dom.window && typeof dom.window.close === 'function') dom.window.close();
  // Clean up globals to avoid cross-test pollution
  try { delete global.window; } catch {}
  try { delete global.document; } catch {}
  try { delete global.HTMLElement; } catch {}
  try { delete global.Node; } catch {}
  try { delete global.Event; } catch {}
  try { delete global.MouseEvent; } catch {}
  try { delete global.CustomEvent; } catch {}
  try { delete global.KeyboardEvent; } catch {}
}
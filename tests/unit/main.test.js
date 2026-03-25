import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('main initialization', () => {
  beforeEach(() => {
    vi.resetModules();
    // Initialize the global marker so the hoist-safe mock can increment it
    global.__setup_called = 0;
  });

  it('calls setupEventListeners from ui on import', async () => {
    // Import the real ui module and spy on its exported function before importing main.js.
    const uiModule = await import('../../js/ui.js');
    const setupSpy = vi.spyOn(uiModule, 'setupEventListeners');
    
    // Import main which runs initializeApp()
    await import('../../js/main.js');
    
    expect(setupSpy).toHaveBeenCalled();
  });

  it('does not throw when document is missing', async () => {
    vi.resetModules();
    // Use a hoist-safe factory for the mock
    vi.doMock('../../js/ui.js', async () => ({ setupEventListeners: () => {} }));
    // Ensure no global document exists
    delete global.document;
    // Import should resolve without throwing (module namespace object is returned)
    await expect(import('../../js/main.js')).resolves.toBeDefined();
  });
});

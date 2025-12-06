import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('main initialization', () => {
  beforeEach(() => {
    vi.resetModules();
    // Initialize the global marker so the hoist-safe mock can increment it
    global.__setup_called = 0;
  });

  it('calls setupEventListeners from ui on import', async () => {
    // Use a spy in the hoist-safe mock so we can reliably assert the function was invoked
    const setupSpy = vi.fn();
    vi.mock('../../js/ui.js', () => ({ setupEventListeners: setupSpy }));
    
    // Import main which runs initializeApp()
    await import('../../js/main.js');
    
    expect(setupSpy).toHaveBeenCalled();
  });

  it('does not throw when document is missing', async () => {
    vi.resetModules();
    vi.mock('../../js/ui.js', () => ({ setupEventListeners: () => {} }));
    // Ensure no global document exists
    delete global.document;
    // Import should resolve without throwing (module namespace object is returned)
    await expect(import('../../js/main.js')).resolves.toBeDefined();
  });
});
import '@testing-library/jest-dom/jest-globals'

// jsdom doesn't implement scrollIntoView; components that follow a keyboard highlight call it.
// Guarded so files that opt into the `node` test environment can still load this setup.
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}

// jsdom has no IntersectionObserver. Stub one that reports the target as immediately
// intersecting so viewport-gated subtrees (LazyChart) render their real content in tests
// instead of sitting on the placeholder forever.
if (typeof globalThis.IntersectionObserver === 'undefined') {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root = null
    readonly rootMargin = ''
    readonly thresholds: ReadonlyArray<number> = []
    constructor(private readonly callback: IntersectionObserverCallback) {}
    observe(target: Element) {
      this.callback(
        [{ isIntersecting: true, target } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver
      )
    }
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
  }
  globalThis.IntersectionObserver = MockIntersectionObserver
}

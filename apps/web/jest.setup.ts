import '@testing-library/jest-dom/jest-globals'

// jsdom doesn't implement scrollIntoView; components that follow a keyboard highlight call it.
// Guarded so files that opt into the `node` test environment can still load this setup.
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}

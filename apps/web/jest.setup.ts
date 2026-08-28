import '@testing-library/jest-dom/jest-globals'

// jsdom doesn't implement scrollIntoView; components that follow a keyboard highlight call it.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}

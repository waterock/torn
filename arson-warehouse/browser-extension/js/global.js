// In chrome, `this` is an instance of Window. In firefox, it's some wrapper object (an instance of Sandbox) and `window` is not directly available.
// Either way, we can safely store a reference to the global object by assigning it to a const, which will be available to all the content scripts in the current frame.
// MDN says: "There is only one global scope per frame, per extension. This means that variables from one content script can directly be accessed by another content script, regardless of how the content script was loaded."
const global = this;
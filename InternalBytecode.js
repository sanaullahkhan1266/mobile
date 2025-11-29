// This file is intentionally left minimal.
// Metro sometimes attempts to read "InternalBytecode.js" when symbolicating stack traces
// on React Native / Hermes. Creating this placeholder file prevents noisy ENOENT logs
// like: "ENOENT: no such file or directory, open '.../InternalBytecode.js'".

export default {};

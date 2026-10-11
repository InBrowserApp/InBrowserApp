// Runs in both the conversion worker and every native pthread. Asset bytes
// have already been downloaded; document content cannot initiate networking.
const denyDocumentNetwork = () => {
  self.postMessage({ documentResourceBlocked: true })
  throw new Error("Document network resources are not supported")
}
self.fetch = denyDocumentNetwork
self.XMLHttpRequest = class {
  constructor() {
    denyDocumentNetwork()
  }
}
self.WebSocket = class {
  constructor() {
    denyDocumentNetwork()
  }
}
self.EventSource = class {
  constructor() {
    denyDocumentNetwork()
  }
}

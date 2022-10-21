console.log("sw.js")

self.addEventListener("install", async e => {
  console.log("install")
  await self.skipWaiting()
})

self.addEventListener("activate", async e => {
  console.log("activate")
  await self.clients.claim()
})

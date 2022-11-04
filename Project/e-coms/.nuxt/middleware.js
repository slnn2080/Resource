const middleware = {}

middleware['guardActorPage'] = require('..\\middleware\\guardActorPage.ts')
middleware['guardActorPage'] = middleware['guardActorPage'].default || middleware['guardActorPage']

middleware['initCheck'] = require('..\\middleware\\initCheck.ts')
middleware['initCheck'] = middleware['initCheck'].default || middleware['initCheck']

middleware['loginAuth'] = require('..\\middleware\\loginAuth.ts')
middleware['loginAuth'] = middleware['loginAuth'].default || middleware['loginAuth']

middleware['routerGuard'] = require('..\\middleware\\routerGuard.ts')
middleware['routerGuard'] = middleware['routerGuard'].default || middleware['routerGuard']

export default middleware

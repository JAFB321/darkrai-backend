const Push = require( 'pushover-notifications' )

var pushNotification = new Push( {
    user: 'up57k26zwe7p1uop9mdw1n1cbw3o55',
    token: 'ap7fgydyttgvqyyp3ev4jyhk2e5jhe',
    // httpOptions: {
    //   proxy: process.env['http_proxy'],
    //},
    onerror: console.error,
    // update_sounds: true // update the list of sounds every day - will
    // prevent app from exiting.
  })

export type PushMessage = {
    message: string,
    title: string,
    url: string,
    url_title: string
  }

export const pushAlert = (message: PushMessage) => {
    try {
        pushNotification.send( message, function( err, result ) {
        if ( err ) {
            console.error(err);
            
        }
        console.log( result )
        })
    } catch (error) { console.error(error) }

}
// imports


importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    '/',
    'index.html',
    'style/base.css',
    'js/base.js',
    'js/app.js',
    'js/sw-utils.js',
    'style/bg.png'
];

const APP_SHELL_INMUTABLE = [
    '//cdn.jsdelivr.net/npm/pouchdb@8.0.1/dist/pouchdb.min.js'
];

self.addEventListener('install', e=>{

    const cachestatic = caches.open(STATIC_CACHE).then(cache=>{

        cache.addAll(APP_SHELL);

    });//cierre cacheStatic
    
    const cachelnmutable = caches.open(INMUTABLE_CACHE).then(cache=>{

        cache.addAll(APP_SHELL_INMUTABLE);

    });//cierre cacheStatic

    e.waitUntil(Promise.all([cachestatic, cachelnmutable]));
}); //cierre Install

self.addEventListener('activate', e=>{

const respuesta = caches.keys().then( keys => {

    keys.forEach( key => {

        if ( key !== STATIC_CACHE && key.includes('static')) {
            return caches.delete(key);
        }

        if ( key !== DYNAMIC_CACHE && key.includes('dynamic')) {
            return caches.delete(key);
        }

    });

});

e.waitUntil( respuesta);

});//cierre activate

self.addEventListener( 'fetch', e => {


    const respuesta = caches.match( e.request).then( res => {

        if (res) {
            return res;
        } else {

            return fetch( e.request ).then( newRes => {
                
                return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );

            });

        }

    });

    e.respondWith( respuesta );

});
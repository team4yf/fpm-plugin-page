'use strict';
import { Fpm, Biz } from 'yf-fpm-server'
import plugin from '../src'
import plugin_socketio from 'fpm-plugin-socketio'
let app = new Fpm()
// plugin_socketio.bind(app)
plugin.bind(app)
let biz = new Biz('0.0.1');
biz.addSubModules('test',{
	foo:async function(args){
		return new Promise( (resolve, reject) => {
			reject({errno: -3001});
		});
	}
})
app.addBizModules(biz);

app.run()
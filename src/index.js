"use strict";
import _ from 'lodash'
import path from 'path'
import Views from 'koa-views'
import session from 'koa-session2'

const Router = (router, fpm) => {
  fpm.app.use(Views(path.join(__dirname, '../views'), {
    extension: 'html',
    map: { html: 'nunjucks' }
  }))
  fpm.app.use(session({
    key: "SESSIONID",   //default "koa:sess"
  }))
  fpm.app.use(async (ctx, next) => {

    let path = ctx.request.url
    if (path === '/' || path === '/eggs/login') {
      await next()
    } else {
      let user = ctx.session.user
      if (!user) {
        ctx.redirect('/eggs/login')
      } else {
        await next()
      }
    }

  })

  router.get('/eggs/login', async (ctx, next) => {
    await ctx.render('login', {

    })
  })

  router.post('/eggs/login', async (ctx, next) => {
    //check pass
    let loginInfo = ctx.request.body
    if (loginInfo.name === 'admin' && loginInfo.pass === '741235896') {
      ctx.session.user = loginInfo
      ctx.body = { code: 0 }
    } else {
      ctx.body = { code: -99, error: 'User Or Pass Error ' }
    }
  })

  router.get('/eggs/main', async (ctx, next) => {
    await ctx.render('main')
  })

  router.get('/eggs/logs/:id', async (ctx, next) => {
    let id = ctx.params.id
    await ctx.render('log', {
      items: datas[id]
    })
  })

  return router
}

let datas = {};

let clients = {};

let jackpot = 0;

let dbm = undefined;

const on_messages = (message, data) =>{
  if(data.target !== 'server') return;
  if(data.channel !== 'Eggs') return;
  if(data.id === undefined) return;
  switch(data.command){
    case 'jackpot':
      jackpot = data.jackpot
      if(dbm){
        let arg = {
        　table: "eggs_jackpots",
        　row: { jackpot: parseInt(jackpot), createAt: _.now()}
        };
        dbm.createAsync(arg)
      }
      return
    case 'connect':
    case 'login':
      data.login_at = new Date().toLocaleString()
      clients[data.id] = data
      return
    case 'refresh':
      let items = datas[data.id] || []
      data.at = new Date().toLocaleString()
      items.unshift(data)
      datas[data.id] = items
      return
  }
}
const on_connect = (message, data) =>{
  // console.log(data)
}

export default {
  bind: (fpm) => {
    fpm.registerAction('FPM_ROUTER', (args) => {
      let fpm = args[0]
      let r = fpm.createRouter()
      fpm.bindRouter(Router(r, fpm))
      dbm = fpm.M
      // subscrib the io messages
      fpm.subscribe('socketio.message', on_messages)
      fpm.subscribe('socketio.connection', on_connect)
    })
  }
}

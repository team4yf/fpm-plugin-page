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
  router.get('/eggs', async (ctx, next) => {
    await ctx.render('login', {

    })
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

  return router
}

export default {
  bind: (fpm) => {

    fpm.registerAction('FPM_ROUTER', (args) => {
      let fpm = args[0]
      let r = fpm.createRouter()
      fpm.bindRouter(Router(r, fpm))
    })
  }
}

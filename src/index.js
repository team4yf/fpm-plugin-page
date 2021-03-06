"use strict";
import _ from 'lodash'
import path from 'path'

const Router = (router, fpm) => {

  router.get('/admin/eggs/main', async (ctx, next) => {
    await ctx.render('eggs/main')
  })

  router.get('/admin/eggs/logs/:id', async (ctx, next) => {
    let id = ctx.params.id
    await ctx.render('eggs/log', {
      items: datas[id]
    })
  })

  return router
}

let datas = {};

let clients = {};

let jackpot = 0;

let dbm = undefined;

let fpmServer = undefined;

const billion = 100000000;

const on_messages = (message, data) =>{
  if(data.target !== 'server') return;
  if(data.channel !== 'Eggs') return;
  if(data.id === undefined) return;
  switch(data.command){
    case 'jackpot':
      if(jackpot < 29 * billion && data.jackpot >= 29 * billion){
        // 达到了 29 亿
        if(fpmServer){
          fpmServer.execute('system.sms', {tpl_id: 39012, mobiles: '13770683580', tpl_value: {number: '2.9 Billion'}}, '0.0.1')
            .catch((err)=>{})
          fpmServer.execute('system.sms', {tpl_id: 39012, mobiles: '15995143131,', tpl_value: {number: '2.9 Billion'}}, '0.0.1')
            .catch((err)=>{})
        }
      }
      if(data.jackpot < jackpot/2 && data.jackpot > 0.1 * billion){
        // 出了皇家同花顺
        if(fpmServer){
          fpmServer.execute('system.sms', {tpl_id: 39012, mobiles: '13770683580', tpl_value: {number: 'Royal Flush'}}, '0.0.1')
            .catch((err)=>{})
          fpmServer.execute('system.sms', {tpl_id: 39012, mobiles: '15995143131', tpl_value: {number: 'Royal Flush'}}, '0.0.1')
            .catch((err)=>{})
        }
      }
      jackpot = data.jackpot
      if(fpmServer){
        fpmServer.execute('websocket.broadcast', {command: 'jackpot', jackpot: jackpot, channel: 'Eggs', at: _.now()}, '0.0.1')
          .catch((err)=>{})
      }
      if(dbm){
        let arg = {
        　table: "eggs_jackpots",
        　row: { players: parseInt(data.players || 0), jackpot: parseInt(jackpot), createAt: _.now()}
        };
        dbm.createAsync(arg)
      }
      
      return
    case 'connect':
    case 'login':
      data.login_at = new Date().toLocaleString()
      clients[data.id] = data
      if(dbm){
        let name = data.name || '>';
        if(name.indexOf('-')){
          name = name.split('-');
        }
        let arg = {
        　table: "eggs_robot_status",
        　row: { 
            clientid: data.id,
            name: name[1] || 'UnKnown',
            title: name[0],
            douzi: data.douzi || 0,
            createAt: _.now(),
            ip: '-',
            command: 'login',
            status: data.status || '-',
          }
        };
        dbm.createAsync(arg)
      }
      return
    case 'refresh':
      if (data.status !== 'PLAYING'){
        return;
      }
      if(dbm){
        let name = data.name || '>';
        if(name.indexOf('-')){
          name = name.split('-');
        }
        let arg = {
        　table: "eggs_robot_status",
        　row: { 
            clientid: data.id,
            name: name[1] || 'UnKnown',
            title: name[0],
            douzi: data.douzi || 0,
            createAt: _.now(),
            ip: '-',
            command: 'refresh',
            status: data.status || '-',
          }
        };
        dbm.createAsync(arg)
      }
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
    fpm.copyViews(path.join(__dirname, '../views/eggs' ), 'eggs')
    fpm.registerAction('FPM_ROUTER', (args) => {
      let r = fpm.createRouter()
      fpm.bindRouter(Router(r, fpm))
      dbm = fpm.M
      fpmServer = fpm
      // subscrib the io messages
      fpm.subscribe('socketio.message', on_messages)
      fpm.subscribe('socketio.connection', on_connect)
    })
  }
}

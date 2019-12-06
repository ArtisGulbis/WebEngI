/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict'

const router = (function () {
  // Private Variable
  const mapRouteToHandler = new Map()

  // Oeffentliche Methoden
  return {
    // Fügt eine neue Route (URL, auszuführende Funktion) zu der Map hinzu
    addRoute: function (route, handler) {
      mapRouteToHandler.set(route, handler)
    },

    // Wird aufgerufen, wenn zu einer anderen Adresse navigiert werden soll
    navigateToPage(url) {
      history.pushState(null, '', url)
      this.handleRouting()
    },

    // Wird als Eventhandler an ein <a>-Element gebunden
    handleNavigationEvent: function (event) {
      event.preventDefault()
      const url = event.target.href
      this.navigateToPage(url)
    },

    // Wird als EventHandler aufgerufen, sobald die Pfeiltasten des Browsers betätigt werden
    handleRouting: function () {
      console.log('Aufruf von router.handleRouting(): Navigation zu: ' + window.location.pathname)
      const currentPage = window.location.pathname.split('/')[1]
      // console.log(`Current page ---->>> ${currentPage}`);
      let routeHandler = mapRouteToHandler.get(currentPage)
      if (routeHandler === undefined) { routeHandler = mapRouteToHandler.get('') } // Startseite
      routeHandler(window.location.pathname)
    }
  }
})();

(function initRouter() {
  // The "Startpage".
  router.addRoute('', function () {
    presenter.showStartPage()
  })

  router.addRoute('detail', function () {
    var id = window.location.pathname.split('/detail/')[1].trim()

    presenter.showBlogOverview(id)
  })

  router.addRoute('post', function () {
    const url = window.location.pathname.split('/post/')[1].trim()
    const pid = url.split('/')[1].trim()
    const bid = url.split('/')[0].trim()
    presenter.showCommentsOfPost(bid, pid)
  })

  router.addRoute('delete', function () {
    const url = window.location.pathname
    console.log(`URL ---> ${url}`)
  })

  if (window) {
    window.addEventListener('popstate', (event) => {
      router.handleRouting()
    })
  }
})()

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict'
const presenter = (function () {
  // Private Variablen und Funktionen
  let init = false
  let blogId = -1
  let postId = -1
  let owner

  function replace(id, element) {
    const main = document.getElementById(id)
    const content = main.firstElementChild
    if (content) content.remove()
    if (element) main.append(element)
  };


  function compareDates(blogs) {
    let previousDate, newestDate, nextDate, newestBlog, previousBlog, nextBlog;
    for (let i = 0; i < blogs.length - 1; i++) {
      previousBlog = blogs[i];
      nextBlog = blogs[i + 1];
      previousDate = new Date(previousBlog.last_changed);
      nextDate = new Date(nextBlog.last_changed);
      if (previousDate > nextDate) {
        newestDate = previousDate;
        newestBlog = previousBlog;
      } else {
        newestDate = nextDate;
        newestBlog = nextBlog;
      }
    };
    return newestBlog;
  }

  function initPage2() {
    replace('main_content')
    replace('name_of_selected_blog')

    model.getSelf((result) => {
      const page = userView.render(result)
      replace('logged_in_user', page)
    })
    // BLOG OVERVIEW --> SHOW ALL BLOGS
    model.getAllBlogs((result) => {
      const page = blogListView.render(result)
      replace('blog_nav', page)
      const mainNav = document.getElementById('blog_nav')
      const main = document.getElementById('main_content')
      main.addEventListener('click', handleClicks)
      mainNav.addEventListener('click', handleClicks)
      init = true

      // result.forEach((el) => {
      //   console.log(el);
      // })
      const newestBlog = compareDates(result)
      model.getBlog(newestBlog.id, (data) => {
        const page = blogOverView.render(data)
        replace('name_of_selected_blog', page)
        model.getAllPostsOfBlog(newestBlog.id, (data) => {
          const page = postOverView.render(data)
          replace('main_content', page)
        });
      });
    });
  };

  function handleClicks(event) {
    let source = null

    switch (event.target.tagName) {
      case 'A':
        router.handleNavigationEvent(event)
        break
      case 'BUTTON':
        source = event.target
        break;
      default:
        source = event.target.closest('LI');
        break
    }
    if (source) {
      const action = source.dataset.action
      if (action) {
        presenter[action](source.id)
      }
      const path = source.dataset.path
      if (path) {
        router.navigateToPage(path)
      }
    }
  }

  // Sorgt dafür, dass bei einem nicht-angemeldeten Nutzer nur noch der Name der Anwendung
  // und der Login-Button angezeigt wird.
  function loginPage() {
    console.log('Presenter: Aufruf von loginPage()')
    if (owner !== undefined) console.log(`Presenter: Nutzer*in ${owner} hat sich abgemeldet.`)
    replace('main_content')
    replace('logged_in_user')
    replace('name_of_selected_blog')
    replace('blog_nav')
    // replace('content');
    init = false
    blogId = -1
    postId = -1
    owner = undefined
  }

  // Oeffentliche Methoden
  return {
    // Wird vom Router aufgerufen, wenn die Startseite betreten wird
    showStartPage() {
      console.log('Aufruf von presenter.showStartPage()')
      // Wenn vorher noch nichts angezeigt wurde, d.h. beim Einloggen
      if (model.loggedIn) { // Wenn der Nutzer eingeloggt ist
        initPage2()
      }
      if (!model.loggedIn) { // Wenn der Nuzter eingelogged war und sich abgemeldet hat
        // Hier wird die Seite ohne Inhalt angezeigt
        loginPage()
      }
    },

    // Wird vom Router aufgerufen, wenn eine Blog-Übersicht angezeigt werden soll
    showBlogOverview(bid) {
      if (!init) initPage2()
      console.log(`Aufruf von presenter.showBlogOverview(${bid})`)

      model.getBlog(bid, (el) => {
        const page = blogOverView.render(el)
        replace('name_of_selected_blog', page);
        // this.showPostsOfBlog(bid)
        model.getAllPostsOfBlog(bid, (result) => {
          const page = postOverView.render(result);
          replace('main_content', page);
        });
      })
    },

    showPostsOfBlog(blogID) {
      if (!init) initPage2()
      model.getAllPostsOfBlog(blogID, (data) => {
        const page = postOverView.render(data)
        replace('main_content', page)
        data.forEach((el) => {
          console.log(el)
        })
      })
    },

    showCommentsOfPost(blogID, postId) {
      if (!init) initPage2()
      model.getPost(blogID, postId, (data) => {
        const page = postDetailView.render(data)
        replace('main_content', page)
        model.getAllCommentsOfPost(blogID, postId, (data) => {
          const page = commentView.render(data)
          replace('comments', page)
          if (data) {
            data.forEach((el) => {
              console.log(el)
            });
          }
        });
      });
    },

    // delete(bid, pid, cid) {
    //   if (bid && pid) {
    //     model.deletePost(bid, pid, () => {
    //       console.log(`Post -> ${bid} was deleted!`)
    //     });
    //   } else if (bid && pid && cid) {
    //     model.deleteComment(bid, pid, cid, () => {
    //       console.log(`Comment --> ${cid} was deleted!`)
    //     })
    //   }
    // },

    edit(bid, pid) {
      if (!init) initPage2;
      model.getPost(bid, pid, (result) => {
        result.setFormatDates(true);
        const page = editView.render(result);
        replace('main_content', page);
      });
    },

    create(bid) {
      if (!init) initPage2;
      const page = createView.render(bid);
      replace('main_content', page);
    },

    delete(info) {
      let ids = info.split('/');
      const filter = ids.filter((el) => typeof parseInt(el) === 'number' && parseInt(el) > 0);
      let pid, bid, cid;

      if (filter.length === 2) {
        pid = ids[0];
        bid = ids[1];
        model.deletePost(bid, pid, () => {
          console.log(`Blog ${bid} was deleted!`);
        });
      } else if (filter.length === 3) {
        pid = ids[2];
        bid = ids[1];
        cid = ids[0];
        model.deleteComment(bid, pid, cid, () => {
          console.log(`Comment ${cid} was deleted`);
        });
      }

    }

  }
})()

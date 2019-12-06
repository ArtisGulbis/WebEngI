/*
 *
 /*
 * Adresse über die man auf die Webschnittstelle meines Blogs zugreifen kann:
 */
'use strict'
const model = (function () {
  // Private Variablen
  let loggedIn = false

  const pathGetBlogs = 'blogger/v3/users/self/blogs'
  const pathBlogs = 'blogger/v3/blogs'

  // Private Funktionen

  // Formatiert den Datum-String in date in zwei mögliche Datum-Strings:
  // long = false: 24.10.2018
  // long = true: Mittwoch, 24. Oktober 2018, 12:21

  function formatDate(date, long) {
    const originalDate = new Date(date)
    const longVer = {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric'
    }
    const shortVer = { month: 'numeric', day: 'numeric', year: 'numeric' }
    if (long) return originalDate.toLocaleDateString('de-DE', longVer)
    return originalDate.toLocaleDateString('de-DE', shortVer)
  }

  // Konstruktoren für Daten-Objekte
  function Blog(id, name, amount, upload_date, last_changed) {
    this.id = id
    this.name = name
    this.amount = amount
    this.upload_date = upload_date
    this.last_changed = last_changed
  };

  function Post(id, blogID, name, upload_date, last_changed, comment_count, content) {
    this.id = id
    this.blogID = blogID
    this.name = name
    this.upload_date = upload_date
    this.last_changed = last_changed
    this.comment_count = comment_count
    this.content = content
  };

  function Comment(id, blogID, postID, author, upload_date, last_changed, content) {
    this.id = id
    this.blogID = blogID
    this.postID = postID
    this.author = author
    this.upload_date = upload_date
    this.last_changed = last_changed
    this.content = content
  }

  Blog.prototype = {
    constructor: Blog,
    setFormatDates(long) {
      this.upload_date = formatDate(this.upload_date, long)
      this.last_changed = formatDate(this.last_changed, long)
    }
  }

  Post.prototype = {
    constructor: Post,
    setFormatDates(long) {
      this.upload_date = formatDate(this.upload_date, long)
      this.last_changed = formatDate(this.last_changed, long)
    }
  }

  Comment.prototype = {
    constructor: Comment,
    setFormatDates(long) {
      this.upload_date = formatDate(this.upload_date, long)
      this.last_changed = formatDate(this.last_changed, long)
    }
  }

  // Oeffentliche Methoden
  return {
    // Setter für loggedIn
    setLoggedIn(b) {
      loggedIn = b
    },
    // Getter für loggedIn
    isLoggedIn() {
      return loggedIn
    },
    // Liefert den angemeldeten Nutzer mit allen Infos
    getSelf(callback) {
      var request = gapi.client.request({
        method: 'GET',
        path: 'blogger/v3/users/self'
      })
      // Execute the API request.
      request.execute((result) => {
        callback(result)
      })
    },

    // Liefert alle Blogs des angemeldeten Nutzers
    getAllBlogs(callback) {
      var request = gapi.client.request({
        method: 'GET',
        path: pathGetBlogs
      })
      // Execute the API request.
      request.execute((result) => {
        const blogArray = result.items.map(el => new Blog(el.id, el.name, el.posts.totalItems, el.published, el.updated))
        callback(blogArray)
      })
    },

    // Liefert den Blog mit der Blog-Id bid
    getBlog(bid, callback) {
      var request = gapi.client.request({
        method: 'GET',
        path: pathBlogs + '/' + bid
      })
      // Execute the API request.
      request.execute((result) => {

        const blog = new Blog(result.id, result.name, result.posts.totalItems, result.published, result.updated);
        callback(blog)
      })
    },

    // Liefert alle Posts zu der  Blog-Id bid
    getAllPostsOfBlog(bid, callback) {
      var request = gapi.client.request({
        method: 'GET',
        path: pathBlogs + '/' + bid + '/posts'
      })

      request.execute((result) => {
        // const postArray = result.items.map(el => new Post(el.id, el.blog.id, el.title, el.published, el.updated, el.replies.totalItems));
        const postArray = result.items.map(el => new Post(el.id, el.blog.id, el.title, el.published, el.updated, el.replies.totalItems, el.content))
        callback(postArray)
      })
    },

    // Liefert den Post mit der Post-Id pid im Blog mit der Blog-Id bid
    getPost(bid, pid, callback) {
      var request = gapi.client.request({
        method: 'GET',
        path: pathBlogs + '/' + bid + '/posts/' + pid
      })

      request.execute((result) => {
        const post = new Post(result.id, result.blog.id, result.title, result.published, result.updated, result.replies.totalItems, result.content)
        callback(post)
      })
    },

    // Liefert alle Kommentare zu dem Post mit der Post-Id pid
    // im Blog mit der Blog-Id bid
    getAllCommentsOfPost(bid, pid, callback) {
      var request = gapi.client.request({
        method: 'GET',
        path: pathBlogs + '/' + bid + '/posts/' + pid + '/comments'
      })

      request.execute((result) => {
        if (result.items) {
          const commentArray = result.items.map(el => new Comment(el.id, el.blog.id, el.post.id, el.author.displayName, el.published, el.updated, el.content))
          callback(commentArray)
        } else {
          callback()
        }
      })
    },

    // Löscht den Kommentar mit der Id cid zu Post mit der Post-Id pid
    // im Blog mit der Blog-Id bid
    // Callback wird ohne result aufgerufen
    deleteComment(bid, pid, cid, callback) {
      var path = pathBlogs + '/' + bid + '/posts/' + pid + '/comments/' + cid
      console.log(path)
      var request = gapi.client.request({
        method: 'DELETE',
        path: path
      })

      request.execute(callback)
    },

    // Fügt dem Blog mit der Blog-Id bid einen neuen Post
    // mit title und content hinzu, Callback wird mit neuem Post aufgerufen
    addNewPost(bid, title, content, callback) {
      var body = {
        kind: 'blogger#post',
        title: title,
        blog: {
          id: bid
        },
        content: content
      }

      var request = gapi.client.request({
        method: 'POST',
        path: pathBlogs + '/' + bid + '/posts',
        body: body
      })

      request.execute(callback)
    },

    // Aktualisiert title und content im geänderten Post
    // mit der Post-Id pid im Blog mit der Blog-Id bid
    updatePost(bid, pid, title, content, callback) {
      var body = {
        kind: 'blogger#post',
        title: title,
        id: pid,
        blog: {
          id: bid
        },
        content: content
      }

      var request = gapi.client.request({
        method: 'PUT',
        path: pathBlogs + '/' + bid + '/posts/' + pid,
        body: body
      })

      request.execute(callback)
    },

    // Löscht den Post mit der Post-Id pid im Blog mit der Blog-Id bid,
    // Callback wird ohne result aufgerufen
    deletePost(bid, pid, callback) {
      var path = pathBlogs + '/' + bid + '/posts/' + pid
      console.log(path)
      var request = gapi.client.request({
        method: 'DELETE',
        path: path
      })

      request.execute(callback)
    }
  }
})()

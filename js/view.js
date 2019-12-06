
// working
const blogOverView = {
  render (data) {
    const page = document.getElementById('blog_info').cloneNode(true)
    page.removeAttribute('id')
    data.setFormatDates(true)
    helper.setDataInfo(page, data)
    return page
  }
}
// working
const blogListView = {
  render (data) {
    const page = document.getElementById('list_of_blogs').cloneNode(true)
    page.removeAttribute('id')
    const ul = page.querySelector('ul')
    const liTemp = ul.firstElementChild
    liTemp.remove()
    data.forEach((el) => {
      const li = liTemp.cloneNode(true)
      ul.appendChild(li)
      helper.setDataInfo(ul, el)
    })
    return page
  }
}
// working
const userView = {
  render (data) {
    const page = document.getElementById('user').cloneNode(true)
    page.removeAttribute('id')
    helper.setDataInfo(page, data)
    return page
  }
}

const postOverView = {
  render (data) {
    function handleDelete (event) {
      let source
      if (event.target.tagName === 'BUTTON') {
        source = event.target.closest('LI')
        if (source.dataset.action === 'delete') {
          const post = source.parentElement.closest('LI')
          post.remove()
        }
      }
    }

    const page = document.getElementById('post_overview').cloneNode(true)
    page.removeAttribute('id')
    const ul = page.querySelector('ul')
    const liTemp = ul.firstElementChild
    helper.setNavButtons(liTemp)
    liTemp.remove()
    data.forEach((el) => {
      const li = liTemp.cloneNode(true)
      ul.appendChild(li)
      el.setFormatDates(false)
      helper.setDataInfo(ul, el)
    })
    page.addEventListener('click', handleDelete)
    return page
  }
}

const postDetailView = {
  render (data) {
    const page = document.getElementById('post_detail').cloneNode(true)
    page.removeAttribute('id')
    data.setFormatDates(true)
    helper.setDataInfo(page, data)
    return page
  }
}

const commentView = {

  render (data) {
    function handleDelete (event) {
      let source
      if (event.target.tagName === 'BUTTON') {
        source = event.target.closest('LI')
        if (source.dataset.action === 'delete') {
          const post = source.parentElement.closest('LI')
          post.remove()
        }
      }
    }

    const page = document.getElementById('comment').cloneNode(true)
    page.removeAttribute('id')
    const ul = page.querySelector('ul')
    const liTemp = ul.firstElementChild
    helper.setNavButtons(liTemp)
    liTemp.remove()
    if (data) {
      data.forEach((el) => {
        el.setFormatDates(true)
        const li = liTemp.cloneNode(true)
        ul.appendChild(li)
        helper.setDataInfo(ul, el)
      })
    } else {
      const li = liTemp.cloneNode(true)
      li.innerHTML = 'No comments yet'
      ul.appendChild(li)
    }
    // page.removeAttribute('id');
    helper.setNavButtons(liTemp)
    page.addEventListener('click', handleDelete)
    return page
  }
}

const helper = {
  setDataInfo (element, object) {
    let cont = element.innerHTML
    for (const key in object) {
      const rexp = new RegExp('%' + key + '%', 'g')
      cont = cont.replace(rexp, object[key])
    }
    element.innerHTML = cont
  },

  setNavButtons (temp) {
    const buttons = document.getElementById('buttons').cloneNode(true)
    buttons.removeAttribute('id')
    const footer = temp.querySelector('footer')
    footer.append(buttons)
  }
}

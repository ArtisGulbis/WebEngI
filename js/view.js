
// working
const blogOverView = {
  render(data) {
    const page = document.getElementById('blog_info').cloneNode(true)
    page.removeAttribute('id')
    data.setFormatDates(true)
    helper.setDataInfo(page, data)
    return page
  }
}
// working
const blogListView = {
  render(data) {
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
  render(data) {
    const page = document.getElementById('user').cloneNode(true)
    page.removeAttribute('id')
    helper.setDataInfo(page, data)
    return page
  }
}

const postOverView = {
  render(data) {
    function handleDelete(event) {
      let source
      if (event.target.tagName === 'BUTTON') {
        source = event.target.closest('LI')
        if (source.dataset.action === 'delete') {
          const post = source.parentElement.closest('LI')
          post.remove()
          console.log('im here delete');
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
  render(data) {
    const page = document.getElementById('post_detail').cloneNode(true)
    page.removeAttribute('id')
    data.setFormatDates(true)
    helper.setDataInfo(page, data)
    return page
  }
}

const commentView = {

  render(data) {
    function handleDelete(event) {
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

const editView = {

  render(data) {
    const handleSave = function (event) {
      if (event.target.value === 'save') {
        event.preventDefault();
        console.log('im here');
        model.updatePost(form.blogID.value, form.id, form.titel.value, form.content.value);

      }
    }

    let fillForm = function () {
      form.blogID.value = data.blogID;
      form.titel.value = data.name;
      form.upload_date.value = data.upload_date;
      form.last_changed.value = data.last_changed;
      form.content.value = data.content;
      form.comment_count.value = data.comment_count;
      form.id = data.id;
    }

    const edit = (data && data.id) ? true : false;
    let div = document.getElementById('edit').cloneNode(true);
    div.removeAttribute('id');
    let form = div.querySelector('form');

    if (edit) {
      fillForm();
      let path = '/detail/' + data.blogID
      let buttons = form.querySelectorAll('button');
      buttons.forEach((el) => {
        el.dataset.path = path;
      });
    }
    div.addEventListener('click', handleSave);
    return div;
  }
}

const helper = {
  setDataInfo(element, object) {
    let cont = element.innerHTML
    for (const key in object) {
      const rexp = new RegExp('%' + key + '%', 'g')
      cont = cont.replace(rexp, object[key])
    }
    element.innerHTML = cont
  },

  setNavButtons(temp) {
    const buttons = document.getElementById('buttons').cloneNode(true)
    buttons.removeAttribute('id')
    const footer = temp.querySelector('footer')
    footer.append(buttons)
  }
}


// working
const blogOverView = {
  render(data) {
    const page = document.getElementById('blog_info').cloneNode(true);
    page.removeAttribute('id');
    data.setFormatDates(true);
    helper.setDataInfo(page, data);
    return page;
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
          post.remove();
        }
      }
    }

    const page = document.getElementById('post_overview').cloneNode(true);
    const button = document.getElementById('create-button').cloneNode(true);
    button.removeAttribute('id');
    page.removeAttribute('id');
    const ul = page.querySelector('ul');
    const liTemp = ul.firstElementChild;
    ul.append(button);
    helper.setNavButtons(liTemp);
    liTemp.remove();
    data.forEach((el) => {
      const li = liTemp.cloneNode(true);
      ul.appendChild(li);
      el.setFormatDates(false);
      helper.setDataInfo(ul, el);
    })
    page.addEventListener('click', handleDelete);
    return page;
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
          post.remove();
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
        model.updatePost(form.blogID_input.value, form.id, form.titel_input.value, form.content_input.value);

      }
    }

    let fillForm = function () {
      form.blogID_input.value = data.blogID;
      form.titel_input.value = data.name;
      form.upload_date_input.value = data.upload_date;
      form.last_changed_input.value = data.last_changed;
      form.content_input.value = data.content;
      form.comment_count_input.value = data.comment_count;
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

const createView = {
  render(bid) {

    const handleCreate = function (event) {
      if (event.target.value === 'create') {
        event.preventDefault();
        model.addNewPost(form.id, form.title_post.value, form.content_post.value);
      }
    }

    const edit = (bid) ? true : false;
    let div = document.getElementById('create').cloneNode(true);
    div.removeAttribute('id');
    let form = div.querySelector('form');
    if (edit) {
      form.id = bid;
      let path = '/detail/' + bid
      let buttons = form.querySelectorAll('button');
      buttons.forEach((el) => {
        el.dataset.path = path;
      });
    }
    div.addEventListener('click', handleCreate);
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

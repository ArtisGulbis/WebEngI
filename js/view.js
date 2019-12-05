
//working
const blogOverView = {
    render(data) {
        let page = document.getElementById('blog_info').cloneNode(true);
        page.removeAttribute('id');
        data.setFormatDates(true);
        helper.setDataInfo(page, data);
        return page;
    }
};
//working
const blogListView = {
    render(data) {
        let page = document.getElementById('list_of_blogs').cloneNode(true);
        page.removeAttribute("id");
        let ul = page.querySelector('ul');
        let liTemp = ul.firstElementChild;
        liTemp.remove();
        data.forEach((el) => {
            let li = liTemp.cloneNode(true);
            ul.appendChild(li);
            helper.setDataInfo(ul, el);
        });
        return page;
    }
}
//working
const userView = {
    render(data) {
        let page = document.getElementById('user').cloneNode(true);
        page.removeAttribute('id');
        helper.setDataInfo(page, data);
        return page;
    }
}


const postOverView = {
    render(data) {

        function handleDelete(event) {
            let source;
            if (event.target.tagName === 'BUTTON') {
                source = event.target.closest('LI');
                if (source.dataset.action === 'delete') {
                    let post = source.parentElement.closest('LI');
                    post.remove();
                }
            }
        }

        let page = document.getElementById('post_overview').cloneNode(true);
        page.removeAttribute('id');
        let ul = page.querySelector('ul');
        let liTemp = ul.firstElementChild;
        helper.setNavButtons(liTemp);
        liTemp.remove();
        data.forEach((el) => {
            let li = liTemp.cloneNode(true);
            ul.appendChild(li);
            el.setFormatDates(false);
            helper.setDataInfo(ul, el);
        });
        page.addEventListener('click', handleDelete);
        return page;
    }
};

const postDetailView = {
    render(data) {
        let page = document.getElementById('post_detail').cloneNode(true);
        page.removeAttribute('id');
        data.setFormatDates(true);
        helper.setDataInfo(page, data);
        return page;
    }
};

const commentView = {



    render(data) {

        function handleDelete(event) {
            let source;
            if (event.target.tagName === 'BUTTON') {
                source = event.target.closest('LI');
                if (source.dataset.action === 'delete') {
                    let post = source.parentElement.closest('LI');
                    post.remove();
                }
            }
        }

        let page = document.getElementById('comment').cloneNode(true);
        page.removeAttribute('id');
        let ul = page.querySelector('ul');
        let liTemp = ul.firstElementChild;
        helper.setNavButtons(liTemp);
        liTemp.remove();
        if (data) {
            data.forEach((el) => {
                el.setFormatDates(true);
                let li = liTemp.cloneNode(true);
                ul.appendChild(li);
                helper.setDataInfo(ul, el);
            });
        } else {
            let li = liTemp.cloneNode(true);
            li.innerHTML = "No comments yet";
            ul.appendChild(li);
        }
        //page.removeAttribute('id');
        helper.setNavButtons(liTemp);
        page.addEventListener('click', handleDelete);
        return page;
    }
}

const helper = {
    setDataInfo(element, object) {
        let cont = element.innerHTML;
        for (let key in object) {
            let rexp = new RegExp("%" + key + "%", "g");
            cont = cont.replace(rexp, object[key]);
        }
        element.innerHTML = cont;
    },

    setNavButtons(temp) {
        let buttons = document.getElementById('buttons').cloneNode(true);
        buttons.removeAttribute('id');
        let footer = temp.querySelector('footer');
        footer.append(buttons);
    }
};



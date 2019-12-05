/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
const presenter = (function () {
    // Private Variablen und Funktionen
    let init = false;
    let blogId = -1;
    let postId = -1;
    let owner = undefined;

    function replace(id, element) {
        let main = document.getElementById(id);
        let content = main.firstElementChild;
        if (content) content.remove();
        if (element) main.append(element);
    };

    // function formatDate(date, long) {
    //     const originalDate = new Date(date);
    //     const longVer = {
    //         weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric'
    //     }
    //     const shortVer = { month: 'numeric', day: 'numeric', year: 'numeric' }
    //     if (long) return originalDate.toLocaleDateString('de-DE', longVer);
    //     return originalDate.toLocaleDateString('de-DE', shortVer);
    // }

    function compareDates(blogs) {
        let previousDate, newestDate, newestBlog
        for (let i = 0; i < blogs.length; i++) {
            let currentBlog = blogs[i]
            let nextBlog = blogs[i + 1]
            let currentDate = new Date(currentBlog.last_changed)
            let nextDate = new Date(nextBlog.last_changed)
            if (currentDate > nextDate) {
                newestDate = currentDate
                newestBlog = currentBlog
            }
        }
        return newestBlog
    }

    function initPage2() {

        replace('main_content');
        replace('name_of_selected_blog');

        model.getSelf((result) => {
            const page = userView.render(result);
            replace('logged_in_user', page);
        });
        //BLOG OVERVIEW --> SHOW ALL BLOGS
        model.getAllBlogs((result) => {

            const page = blogListView.render(result);
            replace('blog_nav', page);
            const mainNav = document.getElementById('blog_nav');
            const main = document.getElementById('main_content');
            main.addEventListener('click', handleClicks);
            mainNav.addEventListener("click", handleClicks);
            init = true;

            // const newestBlog = compareDates(result.items)
            console.log(result);

        });

    };

    function handleClicks(event) {
        let source = null;
        switch (event.target.tagName) {
            case "A":
                router.handleNavigationEvent(event);
                //console.log(event.target.tagName + " was clicked");
                break;
            case "BUTTON":
                source = event.target;
            default:
                source = event.target.closest('LI');
                break;
        }
        if (source) {
            let action = source.dataset.action;
            if (action) {
                presenter[action](source.id);
            }
            let path = source.dataset.path;
            if (path) {
                router.navigateToPage(path);
            }
        }
    }


    // Initialisiert die allgemeinen Teile der Seite
    // function initPage() {


    //     console.log("Presenter: Aufruf von initPage()");

    //     // Hier werden zunächst nur zu Testzwecken Daten vom Model abgerufen und auf der Konsole ausgegeben 

    //     // Nutzer abfragen und Anzeigenamen als owner setzen
    //     model.getSelf((result) => {
    //         owner = result.displayName;
    //         document.getElementById('logged_in_user').innerHTML = owner;
    //         console.log(`Presenter: Nutzer*in ${owner} hat sich angemeldet.`);
    //     });



    //     //----------------------------------------------------------------
    //     model.getAllBlogs((blogs) => {
    //         console.log("--------------- Alle Blogs --------------- ");
    //         if (!blogs)
    //             return;

    //         blogs.forEach(blog => {

    //             //blog.setFormatDates(true);
    //             console.log(blog);
    //         });
    //         blogId = blogs[0].id
    //         model.getAllPostsOfBlog(blogId, (posts) => {
    //             console.log("--------------- Alle Posts des ersten Blogs --------------- ");
    //             if (!posts)
    //                 return;
    //             posts.forEach(post => {

    //                 // post.setFormatDates(true);
    //                 console.log(post);
    //             });
    //             postId = posts[2].id;
    //             model.getAllCommentsOfPost(blogId, postId, (comments) => {
    //                 console.log("--------------- Alle Comments des zweiten Post --------------- ");
    //                 if (!comments)
    //                     return;
    //                 comments.forEach(comment => {

    //                     //comment.setFormatDates(false);
    //                     console.log(comment);
    //                 });
    //             });
    //         });
    //     });
    //     //----------------------------------------------------------------



    //     // Das muss später an geeigneter Stelle in Ihren Code hinein.
    //     init = true;
    //     //Falls auf Startseite, navigieren zu Uebersicht
    //     if (window.location.pathname === "/")
    //         router.navigateToPage('/blogOverview/' + blogId);
    // }
    // Sorgt dafür, dass bei einem nicht-angemeldeten Nutzer nur noch der Name der Anwendung
    // und der Login-Button angezeigt wird.
    function loginPage() {
        console.log("Presenter: Aufruf von loginPage()");
        if (owner !== undefined) console.log(`Presenter: Nutzer*in ${owner} hat sich abgemeldet.`);
        replace('main_content');
        replace('logged_in_user');
        replace('name_of_selected_blog');
        replace('blog_nav');
        //replace('content');
        init = false;
        blogId = -1;
        postId = -1;
        owner = undefined;
    }


    //Oeffentliche Methoden
    return {
        // Wird vom Router aufgerufen, wenn die Startseite betreten wird
        showStartPage() {
            console.log("Aufruf von presenter.showStartPage()");
            // Wenn vorher noch nichts angezeigt wurde, d.h. beim Einloggen
            if (model.loggedIn) { // Wenn der Nutzer eingeloggt ist
                initPage2();
            }
            if (!model.loggedIn) { // Wenn der Nuzter eingelogged war und sich abgemeldet hat
                //Hier wird die Seite ohne Inhalt angezeigt
                loginPage();
            }
        },

        // Wird vom Router aufgerufen, wenn eine Blog-Übersicht angezeigt werden soll
        showBlogOverview(bid) {
            if (!init) initPage2()
            console.log(`Aufruf von presenter.showBlogOverview(${bid})`);
            // model.getAllPostsOfBlog(bid, (result) => {
            //     const page = postOverView.render(result);
            //     replace('main_content', page);
            // });
            model.getBlog(bid, (el) => {
                const page = blogOverView.render(el);
                replace('name_of_selected_blog', page);
                this.showPostsOfBlog(bid);
            });

        },

        showPostsOfBlog(blogID) {
            if (!init) initPage2()
            //const blogId = '4365263144152804094';
            model.getAllPostsOfBlog(blogID, (data) => {
                const page = postOverView.render(data);
                replace('main_content', page);
                data.forEach((el) => {
                    console.log(el);
                })
            });
        },

        showCommentsOfPost(blogID, postId) {
            if (!init) initPage2()
            model.getPost(blogID, postId, (data) => {
                const page = postDetailView.render(data);
                replace('main_content', page);
                model.getAllCommentsOfPost(blogID, postId, (data) => {
                    const page = commentView.render(data);
                    replace('comments', page)
                    if (data) {
                        data.forEach((el) => {
                            console.log(el);
                        });
                    }

                });
            });
        },

        delete(bid, pid, cid) {
            if (bid && pid) {
                model.deletePost(bid, pid, () => {
                    console.log(`Post -> ${bid} was deleted!`);
                });
            } else if (bid && pid && cid) {
                model.deleteComment(bid, pid, cid, () => {
                    console.log(`Comment --> ${cid} was deleted!`);
                });
            }
        },


        edit() {

        }



    };
})();

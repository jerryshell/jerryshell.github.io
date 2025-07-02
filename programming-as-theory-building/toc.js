// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="01.引言.html"><strong aria-hidden="true">1.</strong> 引言</a></li><li class="chapter-item expanded "><a href="02.编程与程序员的知识.html"><strong aria-hidden="true">2.</strong> 编程与程序员的知识</a></li><li class="chapter-item expanded "><a href="03.Ryle的理论概念.html"><strong aria-hidden="true">3.</strong> Ryle 的理论概念</a></li><li class="chapter-item expanded "><a href="04.程序员需要构建的理论.html"><strong aria-hidden="true">4.</strong> 程序员需要构建的理论</a></li><li class="chapter-item expanded "><a href="05.程序修改的问题与成本.html"><strong aria-hidden="true">5.</strong> 程序修改的问题与成本</a></li><li class="chapter-item expanded "><a href="06.程序的生命、死亡与复活.html"><strong aria-hidden="true">6.</strong> 程序的生命、死亡与复活</a></li><li class="chapter-item expanded "><a href="07.编程方法和理论构建.html"><strong aria-hidden="true">7.</strong> 编程方法和理论构建</a></li><li class="chapter-item expanded "><a href="08.程序员的地位与理论构建观点.html"><strong aria-hidden="true">8.</strong> 程序员的地位与理论构建观点</a></li><li class="chapter-item expanded "><a href="09.结论.html"><strong aria-hidden="true">9.</strong> 结论</a></li><li class="chapter-item expanded "><a href="10.应用「理论构建」.html"><strong aria-hidden="true">10.</strong> 应用「理论构建」</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);

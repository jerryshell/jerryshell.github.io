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
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="how_to_use_this_book.html"><strong aria-hidden="true">1.</strong> HOW TO USE THIS BOOK 如何使用这本书</a></li><li class="chapter-item expanded "><a href="pitch_and_rhythm.html"><strong aria-hidden="true">2.</strong> Pitch &amp; Rhythm 音高与节奏</a></li><li class="chapter-item expanded "><a href="notes_and_enharmonics.html"><strong aria-hidden="true">3.</strong> Notes &amp; Enharmonics 音符与等音</a></li><li class="chapter-item expanded "><a href="tuning.html"><strong aria-hidden="true">4.</strong> Tuning 调音</a></li><li class="chapter-item expanded "><a href="major_scale.html"><strong aria-hidden="true">5.</strong> Major Scale 大调</a></li><li class="chapter-item expanded "><a href="minor_scale_and_relatives.html"><strong aria-hidden="true">6.</strong> Minor Scale &amp; Relatives 小调与关系调</a></li><li class="chapter-item expanded "><a href="finding_relatives.html"><strong aria-hidden="true">7.</strong> Finding Relatives 寻找关系调</a></li><li class="chapter-item expanded "><a href="why_flats_exist.html"><strong aria-hidden="true">8.</strong> Why Flats Exist 为什么会有降号</a></li><li class="chapter-item expanded "><a href="difference_between_major_and_minor_scales.html"><strong aria-hidden="true">9.</strong> Difference Between Major &amp; Minor Scales 大调与小调的区别</a></li><li class="chapter-item expanded "><a href="difference_between_major_and_minor_triads.html"><strong aria-hidden="true">10.</strong> Difference Between Major &amp; Minor Triads 大三和弦与小三和弦的区别</a></li><li class="chapter-item expanded "><a href="seven_triads.html"><strong aria-hidden="true">11.</strong> Seven Triads 七个三和弦</a></li><li class="chapter-item expanded "><a href="triads_in_major_keys.html"><strong aria-hidden="true">12.</strong> Triads in Major Keys 大调三和弦</a></li><li class="chapter-item expanded "><a href="triads_in_minor_keys.html"><strong aria-hidden="true">13.</strong> Triads in Minor Keys 小调三和弦</a></li><li class="chapter-item expanded "><a href="chord_symbols.html"><strong aria-hidden="true">14.</strong> Chord Symbols 和弦符号</a></li><li class="chapter-item expanded "><a href="goodbye.html"><strong aria-hidden="true">15.</strong> GOODBYE 再见</a></li><li class="chapter-item expanded "><a href="test.html"><strong aria-hidden="true">16.</strong> TEST 测试</a></li><li class="chapter-item expanded "><a href="answers.html"><strong aria-hidden="true">17.</strong> ANSWERS 答案</a></li><li class="chapter-item expanded "><a href="glossary.html"><strong aria-hidden="true">18.</strong> GLOSSARY 术语表</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
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

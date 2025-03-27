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
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><li class="part-title">Modes</li><li class="chapter-item expanded "><a href="01.html"><strong aria-hidden="true">1.</strong> Vibes: Seven Feelings, One Formula</a></li><li class="chapter-item expanded "><a href="02.html"><strong aria-hidden="true">2.</strong> Modes: Notes &amp; Chords That Are Different Between Modes</a></li><li class="chapter-item expanded "><a href="03.html"><strong aria-hidden="true">3.</strong> More Vibes: What Makes Each Mode Sound &amp; Feel Unique</a></li><li class="chapter-item expanded "><a href="04.html"><strong aria-hidden="true">4.</strong> Intervals: Understanding Musical Relationships &amp; Emotions</a></li><li class="chapter-item expanded affix "><li class="part-title">Chords</li><li class="chapter-item expanded "><a href="05.html"><strong aria-hidden="true">5.</strong> Chords: Compose a Chord Progression in 4 Steps</a></li><li class="chapter-item expanded affix "><li class="part-title">Bass</li><li class="chapter-item expanded "><a href="06.html"><strong aria-hidden="true">6.</strong> Bass: Compose a Bass Line in 2 Steps</a></li><li class="chapter-item expanded "><a href="07.html"><strong aria-hidden="true">7.</strong> Bass for Chords: Compose Bass Lines for Chord Progressions</a></li><li class="chapter-item expanded "><a href="08.html"><strong aria-hidden="true">8.</strong> More Bass: Compose a Funky Bass Line in 4 Steps</a></li><li class="chapter-item expanded affix "><li class="part-title">Guitar</li><li class="chapter-item expanded "><a href="09.html"><strong aria-hidden="true">9.</strong> Guitar: Compose a Unique Guitar Part in 4 Steps</a></li><li class="chapter-item expanded affix "><li class="part-title">Transitions</li><li class="chapter-item expanded "><a href="10.html"><strong aria-hidden="true">10.</strong> Modulation: Change Keys Successfully Using These 3 Methods</a></li><li class="chapter-item expanded "><a href="11.html"><strong aria-hidden="true">11.</strong> Keys: Work Out Any Key Signature for Any Mode in Seconds</a></li><li class="chapter-item expanded affix "><li class="part-title">Melody</li><li class="chapter-item expanded "><a href="12.html"><strong aria-hidden="true">12.</strong> Vocals: The Ultimate Checklist for Composing a Great Melody</a></li><li class="chapter-item expanded "><a href="13.html"><strong aria-hidden="true">13.</strong> Counterpoint: Creating Depth by Adding Musical Layers</a></li><li class="chapter-item expanded "><a href="14.html"><strong aria-hidden="true">14.</strong> Lyrics: Creating Timeless Lines &amp; Catchy Hooks with Depth</a></li></ol>';
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

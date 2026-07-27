/* Theme switcher.
 *
 * Both stylesheets are always in the document; the inactive one is parked at
 * media="not all". This script is parser-blocking and sits right after the
 * <link>s, so the stored theme is applied before first paint (no flash), and
 * switching later is a style recalc rather than a reload.
 */
(function () {
    'use strict';

    var KEY = 'theme';
    var FALLBACK = 'default';
    var LABEL = {
        'default': 'switch to y2k mode',
        'legacy': 'switch to default theme'
    };

    /* localStorage throws outright in some sandboxed/blocked contexts. */
    function stored() {
        try {
            var value = window.localStorage.getItem(KEY);
            return LABEL.hasOwnProperty(value) ? value : FALLBACK;
        } catch (e) {
            return FALLBACK;
        }
    }

    function remember(theme) {
        try {
            window.localStorage.setItem(KEY, theme);
        } catch (e) {
            /* private mode, storage disabled, quota: the switch still works,
               it just won't outlive the page. */
        }
    }

    function apply(theme) {
        var links = document.querySelectorAll('link[data-theme]');
        for (var i = 0; i < links.length; i++) {
            links[i].media = links[i].dataset.theme === theme ? 'all' : 'not all';
        }
        document.documentElement.dataset.theme = theme;
    }

    var current = stored();
    apply(current);

    /* The control is injected rather than written into each page, so it only
       exists where the script that powers it actually ran. */
    document.addEventListener('DOMContentLoaded', function () {
        var footer = document.querySelector('footer');
        if (!footer) return;

        var button = document.createElement('button');
        button.type = 'button';
        button.textContent = LABEL[current];
        button.addEventListener('click', function () {
            current = current === 'legacy' ? 'default' : 'legacy';
            apply(current);
            remember(current);
            button.textContent = LABEL[current];
        });

        var wrapper = document.createElement('div');
        wrapper.className = 'theme-switch';
        // wrapper.appendChild(document.createElement('hr'))
        wrapper.appendChild(button);
        footer.appendChild(wrapper);
    });
})();

document.addEventListener('DOMContentLoaded', () => {
    fetch('https://ejg-miniapps-svb26.ondigitalocean.app/snppt/bookmarklet/fetch-bookmarklet.txt')
    .then(res => res.text())
    .then(js => {document.getElementById('bookmarkletCode').textContent = js});
});
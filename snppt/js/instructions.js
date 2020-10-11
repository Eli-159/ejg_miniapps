document.addEventListener('DOMContentLoaded', () => {
    fetch('https://ejg-miniapps-svb26.ondigitalocean.app/snppt/bookmarklet/SN_Bookmarklet.txt')
    .then(res => res.text())
    .then(js => {document.getElementById('bookmarkletCode').textContent = js});
});
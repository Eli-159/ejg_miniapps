document.addEventListener('DOMContentLoaded', () => {
    fetch('https://snppt-app-5546u.ondigitalocean.app/bookmarklet/SN_Bookmarklet.txt')
    .then(res => res.text())
    .then(js => {document.getElementById('bookmarkletCode').textContent = js});
});
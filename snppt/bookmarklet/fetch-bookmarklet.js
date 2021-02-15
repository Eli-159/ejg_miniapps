try {
    copyNoticesDataFunc();
} catch {
    new Promise((resolve, reject) => {
        const script = document.createElement('script');
        document.body.appendChild(script);
        script.onload = resolve;
        script.onerror = reject;
        script.async = true;
        script.src = 'https://ejg-miniapps-svb26.ondigitalocean.app/snppt/bookmarklet/SN_Bookmarklet.js';
    }).then(() => {
        copyNoticesDataFunc();
    });
}
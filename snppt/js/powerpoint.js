const powerpointFunctions = {
    createPresentation: () => {
        return new PptxGenJS();
    },
    createSlide: (pres, logo, colours) => {
        let slide = pres.addSlide();
        console.log(colours);
        slide.background = {fill: colours.back};
        slide.color = colours.text;
        if (logo) {
            let imgOpts = {
                path: "https://ejg-miniapps-svb26.ondigitalocean.app/snppt/images/CSHS_Logo.png",
                x: '95%',
                y: '89%',
                w: '4%',
                h: '9%'
            }
            slide.addImage(imgOpts);
        }
        return slide;
    },
    createTextBox: (slide, text, opts, size, x, y, align, bold) => {
        if (opts == false) {
            opts = {
                fontSize: size,
                x: x,
                y: y,
                align: align,
                bold: bold
            };
        }
        slide.addText(text, opts);
    }
}
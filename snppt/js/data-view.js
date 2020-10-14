document.addEventListener('DOMContentLoaded', () => {
    // const mainPageCss = document.getElementById('mainPageCss');
    // const printPageCss = document.getElementById('printPageCss');
    const savedData = window.sessionStorage.getItem('noticesDataDisplay');
    const table = document.getElementById('noticesTable');
    const tableContainer = document.getElementById('tableContainer');
    const errorMessage = document.getElementById('error');
    const printBtn = document.getElementById('printBtn');

    //printPageCss.disabled = true;
    
    if (savedData == null) {
        tableContainer.style.display = 'none';
    } else {
        errorMessage.style.display = 'none';
        const displayData = JSON.parse(savedData);
        for (let i = 0; i < displayData.length; i++) {
            const tableRow = document.createElement('tr');
            let tableCell = document.createElement('td');
            let text = document.createTextNode(displayData[i].category);
            tableCell.appendChild(text);
            tableRow.appendChild(tableCell);
            tableCell = document.createElement('td');
            text = document.createTextNode(displayData[i].subject);
            tableCell.appendChild(text);
            tableRow.appendChild(tableCell);
            tableCell = document.createElement('td');
            text = document.createTextNode(displayData[i].message);
            tableCell.appendChild(text);
            tableRow.appendChild(tableCell);
            tableCell = document.createElement('td');
            text = document.createTextNode(displayData[i].teacher);
            tableCell.appendChild(text);
            tableRow.appendChild(tableCell);
            table.appendChild(tableRow);
        }
    }

    // printBtn.addEventListener('click', () => {
    //     mainPageCss.disabled = true;
    //     printPageCss.disabled = false;
    //     setTimeout(() => {
    //         window.print();
    //         setTimeout(() => {
    //             printPageCss.disabled = true;
    //             mainPageCss.disabled = false;
    //         }, 1000);
    //     }, 1000);
    // });
    printBtn.addEventListener('click', () => {
            window.print();
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const savedData = window.sessionStorage.getItem('noticesDataDisplay');
    const table = document.getElementById('noticesTable');
    const tableContainer = document.getElementById('tableContainer');
    const errorMessage = document.getElementById('error');
    const printBtn = document.getElementById('printBtn');

    
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
            tableCell.class = ((displayData[i].new) ? 'newNotice' : 'oldNotice');
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

    printBtn.addEventListener('click', () => {
            window.print();
    });
});
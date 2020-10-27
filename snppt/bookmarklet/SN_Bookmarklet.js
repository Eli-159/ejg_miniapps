const table = document.getElementsByClassName('ms-listviewtable ms-basictable')[0];
const rows = table.getElementsByTagName('tr');
const allCellData = [];
let cells = [];
for (let i = 2; i < rows.length; i++) {
    cells = rows[i].getElementsByTagName('td');
    allCellData.push({
        category: cells[1].innerText,
        subject: cells[2].getElementsByTagName('a')[0].innerText,
        new: cells[2].getElementsByTagName('img').length > 0,
        message: cells[3].getElementsByTagName('div')[0].innerText,
        teacher: cells[5].getElementsByTagName('span')[0].getElementsByTagName('a')[2].innerText
    });
}
console.log(allCellData);



const newDiv = document.createElement('div');
newDiv.id = 'copyArrayToClipboardDiv';

const textInput = document.createElement('input');
textInput.type = 'text';
textInput.id = 'valueToBeCopied';
textInput.value = JSON.stringify(allCellData);

const copyButton = document.createElement('button');
copyButton.appendChild(document.createTextNode('Click to Copy Data'));
copyButton.addEventListener('click', () => {
    textInput.select();
    document.execCommand("copy");
});

newDiv.appendChild(textInput);
newDiv.appendChild(copyButton);

const body = document.getElementsByTagName("body")[0];
body.insertBefore(newDiv, body.childNodes[0]);

copyButton.click();
newDiv.remove();

alert('The data has now been copied to you clipboard. Please now go to the data processing page.');
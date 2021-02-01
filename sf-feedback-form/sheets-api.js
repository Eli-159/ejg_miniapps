function gapiLogin(optsObj) {
    const scriptTag = document.createElement('script');
    scriptTag.src = 'https://apis.google.com/js/api.js';
    scriptTag.onload = 'handleClientLoad()';
    scriptTag.onreadystatechange = 'if (this.readyState === \'complete\') handleClientLoad()';
    document.getElementsByTagName('head')[0].appendChild(scriptTag);

    const CLIENT_ID = optsObj['CLIENT_ID'];
    const API_KEY = optsObj['API_KEY'];
    const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
    let SCOPES = 'https://www.googleapis.com/auth/drive.readonly';
    if (optsObj['SCOPE'] == 'sheetsRead') {
        SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';
    } else if (optsObj['SCOPE'] == 'sheetsFull') {
        SCOPES = 'https://www.googleapis.com/auth/spreadsheets'
    } else if (optsObj['SCOPE'] == 'driveRead') {
        SCOPES = 'https://www.googleapis.com/auth/drive.readonly'
    } else if (optsObj['SCOPE'] == 'driveFull') {
        SCOPES = 'https://www.googleapis.com/auth/drive'
    }
    console.log('const CLIENT_ID = "' + CLIENT_ID + '";\nconst API_KEY = "' + API_KEY + '";\nconst DISCOVERY_DOCS = ' + JSON.stringify(DISCOVERY_DOCS) + ';\nconst SCOPES = "' + SCOPES + '";');

    function handleClientLoad() {
        console.log('From handleClientLoad.');
        gapi.load('client:auth2', initClient);
    }

    function initClient() {
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        }).then(function () {
          // Listen for sign-in state changes.
        //   gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
            gapi.auth2.getAuthInstance().signIn();
            gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
                range: 'Class Data!A2:E',
            }).then(function(response) {
                console.log(response.result);
            });
        }, function(error) {
          console.log(JSON.stringify(error, null, 2));
        });
      }
}

/*
gapiLogin({
    'CLIENT_ID': '3496606216-q5nmfu7tnohvphq7st8i6f2hh9fphfnm.apps.googleusercontent.com',
    'API_KEY': 'AIzaSyCyzfbgnCSO4gtafe_uCUe5xXnVbWVSXlY',
    'SCOPE': 'sheetsRead'
});
*/
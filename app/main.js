const electron = require('electron');
const ping = require('ping');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const Menu = electron.Menu;
const path = require('path');
const url = require('url');
const Datastore = require('nedb');
const db = new Datastore({ filename: __dirname + '/datafile.json' });
let mainWindow, newWindow, hosts = [];

const template = [
  {
    label: 'Edit',
    submenu: [
      {
        label: 'New',
        click () { createNewWindow(); }
      },
      {label: 'Edit current list'}
    ]
  },
  {
    label: 'View',
    submenu: [
      {role: 'reload'},
      {role: 'toggledevtools'}
    ]
  },
  {
    role: 'window',
    submenu: [
      {role: 'minimize'},
      {role: 'close'}
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Author: Andrew Schools'
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

function createNewWindow() {
  newWindow = new BrowserWindow({
    width: 300, 
    height:100,
    parent: mainWindow,
    modal: true,
    titleBarStyle: 'hidden',
    center: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    darkTheme: true
  });

  newWindow.setMenu(null);
  
  newWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'new.html'),
    protocol: 'file:',
    slashes: true
  }));

  newWindow.on('closed', () => {
    newWindow = null;
  });
}

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800, 
    height: 400,
    center: true,
    resizable: false
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
  db.loadDatabase(function (err) {
    monitor();
  });

  setInterval(() => {
    monitor();
  }, 60000*5);
}

app.on('ready', createWindow);

app.on('window-all-closed', () =>{
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

ipcMain.on('new', (event, host) => {
  db.insert({host}, function (error, newDoc) {
    if (!error) {
      event.sender.send('new-reply', newDoc);
      ping.sys.probe(newDoc.host, (ok) => {
        mainWindow.webContents.send('info' , {host: newDoc.host, "status": ok.toString(), lastChecked: new Date()});
      });
    }
    else {
      event.sender.send('error', error)
    }
  });
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

function monitor() {
  db.find({}, function (error, docs) {
    if (!error) {
      docs.forEach((item) => {
        ping.sys.probe(item.host, (ok) => {
            mainWindow.webContents.send('info' , {host: item.host, "status": ok.toString(), lastChecked: new Date()});
        });
      });
    }
    else {
      mainWindow.webContents.send('error' , error);
    }
  });
}
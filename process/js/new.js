const React = require('react');
const ReactDOM = require('react-dom');
const $ = jQuery = require('jquery');
const bootstrap = require('bootstrap');
const remote = window.require('electron').remote;
var ipcRenderer = window.require('electron').ipcRenderer;
var data = {};
let currentWindow = remote.getCurrentWindow();

class Table extends React.Component {
  render() {
    return (
      <div>
        <div id="alert" class="alert alert-error" role="alert" style={{display:'none'}}>
          <div id="msg">error here</div>
        </div>
        <table class="table table-dark">
          <thead>
          </thead>
          <tbody>
          <tr>
            <td><input type="text" id="host" /></td>
            <td><input type="button" id="btn" value=" + " onClick={add} /></td>
          </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

ReactDOM.render(
  <Table />,
  document.getElementById('main')
);

function add() {
  ipcRenderer.send('new', $("#host").val());
}

// Listen for async-reply message from main process
ipcRenderer.on('new-reply', (event, arg) => {  
  if (arg instanceof Error) {
    $("#alert").css('display', 'block');
    $("#msg").val(error.message)
  }
  else {
    let window = remote.getCurrentWindow();
    window.close();
  }
});
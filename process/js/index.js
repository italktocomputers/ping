const React = require('react');
const ReactDOM = require('react-dom');
const $ = jQuery = require('jquery');
const bootstrap = require('bootstrap');

var ipcRenderer = window.require('electron').ipcRenderer;
var data = {};

class Table extends React.Component {
  render() {
    return (
      <table class="table table-dark">
        <thead>
          <tr>
            <th scope="col">Host</th>
            <th scope="col">Status</th>
            <th scope="col">Last Checked</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(this.props.value).map((o, i) => {
            return (
              <Host value={o.host} status={o.status} lastChecked={o.lastChecked} />
            )
          })}
        </tbody>
      </table>
    )
  }
}

class Host extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.value}</td>
        <td>{this.props.status}</td>
        <td>{this.props.lastChecked}</td>
      </tr>
    );
  }
}

ipcRenderer.on('refresh', (event, arg) => {
  addToTable(arg);
});

ipcRenderer.on('info', (event, arg) => {
  addToTable(arg);
});

function doNotify(title, msg) {
  let notify = new Notification(title, {
    body: msg,
    silent: false,
    icon: __dirname + '/images/alert.png'
  });

  const wav = new Audio(__dirname + '/sounds/alert.wav');
  wav.play();
}

function addToTable(arg) {
  data[arg.host] = arg;
  
  if (arg.status === 'false')
    doNotify('Ping alert!', arg.host + " is not responding to ping!");

  ReactDOM.render(
    <Table value={data} />,
    document.getElementById('main')
  );
}

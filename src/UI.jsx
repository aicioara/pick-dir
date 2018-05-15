const fs = require('fs');
const path = require('path');

const { h, Component, Text } = require('ink');
const SelectInput = require('ink-select-input');

class UI extends Component {
    constructor() {
        super();

        this.state = {
            dirOptions: [],
            console: "Console",
        };

        this.internal = {
            selectionColor: { hex: "#00ffff" }, // Cyan
            dirColor: { hex: "#00ff00" }, // Green
            currDir: process.cwd(),
        }

        process.on('exit', () => {
            console.error('\x1Bc');
            console.log(this.internal.currDir)
        });

    }

    render() {
        const attr = {
            items: this.state.dirOptions,
            onSelect: item => {
                const newFolder = item.value;
                const oldPath = this.internal.currDir;
                const newPath = path.resolve(oldPath, newFolder);
                process.chdir(newPath);
                this.internal.currDir = newPath;
                this._getDirs();
            },
            indicatorComponent: (props) => {
                const color = props.isSelected ? this.internal.selectionColor : {}
                return h(Text, color, props.isSelected ? '> ' : ' ')
            },
            itemComponent: (props) => {
                let color = {};
                if (props.isSelected) {
                    color = this.internal.selectionColor;
                } else if (props.type === 'dir') {
                    color = this.internal.dirColor
                }
                return h(Text, color, props.value);
            },
        };

        return h(SelectInput, attr);
    }

    componentDidMount() {
        this._getDirs();
    }

    _getDirs() {
        const dirs = ['..'].concat(fs.readdirSync('.'))
        const dirOptions = dirs.map(dirName => ({
            label: dirName,
            value: dirName,
            type: fs.lstatSync(dirName).isDirectory() ? "dir" : "file",
        })).sort((a, b) => a.type === 'dir' ? -1 : b.type === 'dir' ? 1 : 0)
        this.setState({dirOptions})
    }
}

module.exports = UI;

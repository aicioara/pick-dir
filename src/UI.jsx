const fs = require('fs');
const path = require('path');
const process = require('process');

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
            currDir: process.cwd(),
        }

        console.error("Started")

        process.on('exit', () => {
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
                return <Text {...color}>{props.isSelected ? '>' : ''}</Text>
            },
            itemComponent: (props) => {
                const color = props.isSelected ? this.internal.selectionColor : {}
                return <Text {...color}> {props.label} </Text>
            }
        };

        return <SelectInput {...attr} />
    }

    componentDidMount() {
        this._getDirs();
    }

    _getDirs() {
        const dirs = ['..'].concat(fs.readdirSync('.'))
        const dirOptions = dirs.map(dirName => ({
            label: dirName,
            value: dirName,
        }))
        this.setState({dirOptions})
    }
}

module.exports = UI;

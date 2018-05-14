const fs = require('fs');

const { h, render, Component, Text } = require('ink');
const SelectInput = require('ink-select-input');

class Counter extends Component {
    constructor() {
        super();

        this.state = {
            dirOptions: [],
            console: "Console",
        };

        this.internal = {
            selectionColor: { hex: "#00ffff" }, // Cyan
        }
    }

    render() {
        const attr = {
            items: this.state.dirOptions,
            onSelect: item => {
                console.log(item)
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

        return <div>
            <Text>
                <SelectInput {...attr} />
            </Text>
        </div>
    }

    componentDidMount() {
        this._getDirs();
    }

    _getDirs() {
        const dirs = fs.readdirSync('.')
        const dirOptions = dirs.map(dirName => ({
            label: dirName,
            value: dirName,
        }))
        this.setState({dirOptions})
    }
}

module.exports = Counter;

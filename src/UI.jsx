const fs = require('fs');
const path = require('path');

const hasAnsi = require('has-ansi');
const { h, Component, Color } = require('ink');
const QuickSearch = require('ink-quicksearch');

class Navigator extends Component {
    constructor() {
        super();
        this.state = Navigator.initialState;
        this.handleKeyPress = this.handleKeyPress.bind(this);

        this.internal = {
            currDir: process.cwd(),
            hasTyped: false,
        }

        process.on('exit', () => {
            console.log(this.internal.currDir)
        });
    }

    render() {
        let attr = {
            items: this.state.dirOptions,
            onSelect: item => {
                const newFolder = item.value;
                const newPath = path.resolve(this.internal.currDir, newFolder);
                this.changeDir(newPath);
            },
            indicatorComponent: ({isSelected, item}) => {
                let style = {}
                if (item.type === 'dir') {
                    style = this.props.dirStyle;
                } else {
                    style = this.props.fileStyle;
                }
                return <Color {...style}>{isSelected ? '>' : ' '} </Color>;
            },
            itemComponent: ({isSelected, children, item}) => {
                let style = {}
                if (item.type === 'dir') {
                    style = this.props.dirStyle;
                } else {
                    style = this.props.fileStyle;
                }
                return <Color {...style}>{children}</Color>
            },
            statusComponent: () => <span></span>
        };

        return h(QuickSearch, attr);
    }

    componentDidMount() {
        this.getDirs();
        process.stdin.on('keypress', this.handleKeyPress);
    }

    componentWillUnmount() {
        process.stdin.removeListener('keypress', this.handleKeyPress);
    }

    handleKeyPress(ch, key) {
        if (key.name === 'return') {
            this.internal.hasTyped = false;
        } else if (key.name === 'backspace') {
            if (!this.internal.hasTyped) {
                const newPath = path.resolve(this.internal.currDir, '..');
                this.changeDir(newPath)
            }
        } else if (hasAnsi(key.sequence)) {
            // No-op
        } else {
            this.internal.hasTyped = true;
        }
    }

    changeDir(newPath) {
        process.chdir(newPath);
        this.internal.currDir = newPath;
        this.getDirs();
    }

    getDirs() {
        const files = ['..'].concat(fs.readdirSync('.'))
        const dirOptions = files.map(dirName => {
            const isDir = fs.lstatSync(dirName).isDirectory();
            return {
                label: dirName,
                value: isDir ? dirName : "",
                type: isDir ? "dir" : "file",
            }
        }).sort((a, b) => {
            if (a.type === 'dir' && b.type !== 'dir') {
                return -1;
            }
            if (a.type !== 'dir' && b.type === 'dir') {
                return 1;
            }
            if (a.label < b.label) {
                return -1;
            }
            if (a.label > b.label) {
                return 1;
            }
            return 0;
        })
        this.setState({dirOptions})
    }
}

Navigator.defaultProps = {
    dirStyle: { hex: '#268BD2' },
    fileStyle: { hex: '#888888' },
    highlightStyle: {},
};

Navigator.initialState = {
    dirOptions : [],
}

module.exports = Navigator;

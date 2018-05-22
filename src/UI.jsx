const fs = require('fs');
const path = require('path');

const hasAnsi = require('has-ansi');
const { h, Component, Color, br } = require('ink');
const QuickSearch = require('ink-quicksearch');
const termSize = require('term-size');

class Navigator extends Component {
    constructor(props) {
        super(props);
        this.state = Navigator.initialState;
        this.handleKeyPress = this.handleKeyPress.bind(this);

        this.internal = {
            hasTyped: false,
        }

        process.on('exit', () => {
            console.log(this.state.currDir)
        });
    }

    render() {
        let attr = {
            items: this.state.dirOptions,
            onSelect: item => {
                const newFolder = item.value;
                const newPath = path.resolve(this.state.currDir, newFolder);
                this.changeDir(newPath);
            },
            limit: termSize().rows - 3, // One for clear screen, one for cursor, one for header
            forceMatchingQuery: true,
            clearQueryChars: this.props.clearQueryChars,
            initialSelectionIndex: this.state.initialSelectionIndex,
            indicatorComponent: ({isSelected, item}) => {
                let style = {}
                if (item.type === 'dir') {
                    style = this.props.dirStyle;
                } else {
                    style = this.props.fileStyle;
                }
                return h(Color, style, isSelected ? '>' : ' ' , ' ')
            },
            itemComponent: ({isSelected, children, item}) => {
                let style = {}
                if (item.type === 'dir') {
                    style = this.props.dirStyle;
                } else {
                    style = this.props.fileStyle;
                }
                return h(Color, style, children);
            },
            highlightComponent: ({children}) => {
                let style = this.props.highlightStyle;
                return h(Color, style, children);
            },
            statusComponent: () => h('span'), // no-op
        };

        return h('span', null,
            h(Color, this.props.currFolderStyle, this.state.currDir),
            h("br"),
            h(QuickSearch, attr),
        );
    }

    componentDidMount() {
        this.changeDir(process.cwd())
        process.stdin.on('keypress', this.handleKeyPress);
    }

    componentWillUnmount() {
        process.stdin.removeListener('keypress', this.handleKeyPress);
    }

    handleKeyPress(ch, key) {
        if (this.props.clearQueryChars.indexOf(ch) !== -1) {
            this.internal.hasTyped = false;
        } else if (key.name === 'return') {
            this.internal.hasTyped = false;
        } else if (key.name === 'backspace') {
            if (!this.internal.hasTyped) {
                const newPath = path.resolve(this.state.currDir, '..');
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
        const dirOptions = this.getDirs();
        if (path.relative(this.state.currDir, newPath) === '..') {
            const initialSelectionIndex = dirOptions.map(d => d.label).indexOf(path.relative(newPath, this.state.currDir))
            this.setState({initialSelectionIndex})
        } else {
            this.setState({initialSelectionIndex: 0})
        }
        this.setState({currDir: newPath});
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
        return dirOptions;
    }
}

Navigator.defaultProps = {
    currFolderStyle: { keyword: 'green' },
    dirStyle: { keyword: 'blue' },
    fileStyle: { hex: '#888888' },
    highlightStyle: { bgKeyword: 'green', keyword: 'white' },
    clearQueryChars: [
        '\u0015', // Ctrl + U
        '\u0017', // Ctrl + W
    ],
};

Navigator.initialState = {
    currDir: '',
    dirOptions : [],
    initialSelectionIndex: 0,
}

module.exports = Navigator;

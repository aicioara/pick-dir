# Pick Dir

An User-Experience-focused visual alternative to `cd`, aimed at achieving faster folder navigation.


## Installation

Dependencies:
- [NodeJS](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/get-npm)

```bash
npm install -g pick-dir # May need to be prefixed by sudo
```


## Setup

The recommended way of using pick-dir is by adding the following to your `~/.bashrc`

```bash
d() {
  cd $( pick-dir )
}
```

Then source bashrc (`source ~/.bashrc`) and invoke using `d`


## Usage

- Once started, pick-dir will print to stderr the current list of files and folders.
- Navigate around using arrow keys.
- Quickly select a folder by typing part of its name.
- Enter folders using `Enter`. Exit folders using `Backspace`.
- Once finished press `CTRL + C` and the current folder will be printed to stdout. Ideally this will be served as an argument to `cd`


## Keymap

- <kbd>PageUp</kbd> / <kbd>PageDown</kbd> - Scroll up / down
- <kbd>ArrowUp</kbd> / <kbd>ArrowDown</kbd> - Navigate through selection
- <kbd>Backspace</kbd> - Move up one folder
- <kbd>Enter</kbd> - Move inside selected folder
- <kbd>CTRL</kbd> + <kbd>C</kbd> - Finish and print current folder to stdout
- <kbd>CTRL</kbd> + <kbd>W</kbd> - Clear search

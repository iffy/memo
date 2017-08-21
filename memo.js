define("memorizer", ["require", "exports", "react", "react-dom"], function (require, exports, React, ReactDOM) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Memorizer {
    }
    function chunkToLetterish(x) {
        return x.match(/([^a-zA-Z0-9]*[a-zA-Z0-9][^a-zA-Z0-9]*)/g);
    }
    class MemoParagraphs extends React.Component {
        constructor(props) {
            super(props);
            this.handleKeypress = (ev) => {
                if (ev.key.toLowerCase() === this.nextLetter || ev.key === 'Tab') {
                    let newletteridx = this.state.letteridx + 1;
                    if (newletteridx === this.state.flatletters.length) {
                        if (this.props.onComplete) {
                            this.props.onComplete();
                        }
                    }
                    this.setState({ letteridx: newletteridx });
                    ev.preventDefault();
                }
            };
            this.state = {
                letteridx: 0,
                flatletters: [],
                chunkedparas: [],
            };
        }
        stateFromProps(props) {
            let flatletters = [];
            let chunkedparas = props.paragraphs.map(para => {
                let letters = chunkToLetterish(para.text);
                flatletters = flatletters.concat(letters);
                return letters;
            });
            this.setState({
                flatletters,
                chunkedparas,
            });
        }
        componentWillReceiveProps(nextProps) {
            this.stateFromProps(nextProps);
            this.setState({ letteridx: 0 });
        }
        componentDidMount() {
            this.stateFromProps(this.props);
        }
        componentWillUnmount() {
        }
        render() {
            let pointer = 0;
            let { letteridx, chunkedparas } = this.state;
            let paras = chunkedparas.map((para, idx) => {
                let text = para.map((letterish, j) => {
                    if (pointer++ < letteridx) {
                        return letterish;
                    }
                    else {
                        return letterish.replace(/[a-zA-Z0-9]/g, '_');
                    }
                });
                return React.createElement("p", { key: idx }, text);
            });
            let cls = "quiz-area";
            if (letteridx >= this.state.flatletters.length) {
                cls += " complete";
            }
            return React.createElement("div", { className: cls, onKeyDown: this.handleKeypress, tabIndex: 1 }, paras);
        }
        get nextLetter() {
            let { flatletters, letteridx } = this.state;
            if (letteridx >= flatletters.length) {
                return null;
            }
            return flatletters[letteridx].match(/[a-zA-Z0-9]/)[0].toLowerCase();
        }
    }
    class MemoApp extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                showing: false,
                sampletext: 'But Ammon said unto him: I do not boast in my own strength, nor in my own wisdom; but behold, my joy is full, yea, my heart is brim with joy and I will rejoice in my God.',
            };
        }
        render() {
            let editpart;
            if (this.state.showing) {
                editpart = (React.createElement("div", null,
                    React.createElement("textarea", { value: this.state.sampletext, onChange: (ev) => {
                            this.setState({ sampletext: ev.target.value });
                        } })));
            }
            let paragraphs = [{ text: this.state.sampletext }];
            return React.createElement("div", null,
                React.createElement(MemoParagraphs, { paragraphs: paragraphs, onComplete: () => {
                    } }),
                React.createElement("button", { onClick: () => {
                        this.setState({ showing: !this.state.showing });
                    } }, "Configuration"),
                editpart);
        }
    }
    function start(elem) {
        ReactDOM.render(React.createElement(MemoApp, null), elem);
    }
    exports.start = start;
});
//# sourceMappingURL=memo.js.map
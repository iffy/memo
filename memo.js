define("interfaces", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("repo", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.items = [
        {
            ref: 'The Living Christ',
            paras: [
                {
                    text: `As we commemorate the birth of Jesus Christ two millennia ago, we offer our testimony of the reality of His matchless life and the infinite virtue of His great atoning sacrifice. None other has had so profound an influence upon all who have lived and will yet live upon the earth.`,
                },
                {
                    text: `He was the Great Jehovah of the Old Testament, the Messiah of the New. Under the direction of His Father, He was the creator of the earth. “All things were made by him; and without him was not any thing made that was made” (John 1:3). Though sinless, He was baptized to fulfill all righteousness. He “went about doing good” (Acts 10:38), yet was despised for it. His gospel was a message of peace and goodwill. He entreated all to follow His example. He walked the roads of Palestine, healing the sick, causing the blind to see, and raising the dead. He taught the truths of eternity, the reality of our premortal existence, the purpose of our life on earth, and the potential for the sons and daughters of God in the life to come.`,
                },
                {
                    text: `He instituted the sacrament as a reminder of His great atoning sacrifice. He was arrested and condemned on spurious charges, convicted to satisfy a mob, and sentenced to die on Calvary’s cross. He gave His life to atone for the sins of all mankind. His was a great vicarious gift in behalf of all who would ever live upon the earth.`,
                },
                {
                    text: `We solemnly testify that His life, which is central to all human history, neither began in Bethlehem nor concluded on Calvary. He was the Firstborn of the Father, the Only Begotten Son in the flesh, the Redeemer of the world.`,
                },
                {
                    text: `He rose from the grave to “become the firstfruits of them that slept” (1 Cor. 15:20). As Risen Lord, He visited among those He had loved in life. He also ministered among His “other sheep” (John 10:16) in ancient America. In the modern world, He and His Father appeared to the boy Joseph Smith, ushering in the long-promised “dispensation of the fulness of times” (Eph. 1:10).`,
                },
                {
                    text: `Of the Living Christ, the Prophet Joseph wrote: “His eyes were as a flame of fire; the hair of his head was white like the pure snow; his countenance shone above the brightness of the sun; and his voice was as the sound of the rushing of great waters, even the voice of Jehovah, saying:`,
                },
                {
                    text: `“I am the first and the last; I am he who liveth, I am he who was slain; I am your advocate with the Father” (D&C 110:3–4).`,
                },
                {
                    text: `Of Him the Prophet also declared: “And now, after the many testimonies which have been given of him, this is the testimony, last of all, which we give of him: That he lives!`,
                },
                {
                    text: `“For we saw him, even on the right hand of God; and we heard the voice bearing record that he is the Only Begotten of the Father—`,
                },
                {
                    text: `“That by him, and through him, and of him, the worlds are and were created, and the inhabitants thereof are begotten sons and daughters unto God” (D&C 76:22–24).`,
                },
                {
                    text: `We declare in words of solemnity that His priesthood and His Church have been restored upon the earth—“built upon the foundation of … apostles and prophets, Jesus Christ himself being the chief corner stone” (Eph. 2:20).`,
                },
                {
                    text: `We testify that He will someday return to earth. “And the glory of the Lord shall be revealed, and all flesh shall see it together” (Isa. 40:5). He will rule as King of Kings and reign as Lord of Lords, and every knee shall bend and every tongue shall speak in worship before Him. Each of us will stand to be judged of Him according to our works and the desires of our hearts.`,
                },
                {
                    text: `We bear testimony, as His duly ordained Apostles—that Jesus is the Living Christ, the immortal Son of God. He is the great King Immanuel, who stands today on the right hand of His Father. He is the light, the life, and the hope of the world. His way is the path that leads to happiness in this life and eternal life in the world to come. God be thanked for the matchless gift of His divine Son.`,
                },
            ]
        }
    ];
});
define("memorizer", ["require", "exports", "react", "react-dom", "repo"], function (require, exports, React, ReactDOM, repo_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function chunkToLetterish(x) {
        return x.match(/([^a-zA-Z0-9]*[a-zA-Z0-9][^a-zA-Z0-9]*)/g);
    }
    class MemoParagraphs extends React.Component {
        constructor(props) {
            super(props);
            this.elem = null;
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
                else if (ev.key === ' ') {
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
            if (this.elem) {
                this.elem.focus();
            }
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
            return React.createElement("div", { className: cls, onKeyDown: this.handleKeypress, tabIndex: 1, ref: elem => {
                    if (elem) {
                        this.elem = elem;
                    }
                } }, paras);
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
                custom_text: '',
                memorizeable: null,
            };
        }
        render() {
            let editpart;
            if (this.state.showing) {
                editpart = (React.createElement("div", null,
                    React.createElement("textarea", { value: this.state.custom_text, onChange: (ev) => {
                            this.setState({ custom_text: ev.target.value });
                        } })));
            }
            let paragraphs = [];
            if (this.state.custom_text) {
                paragraphs = [{ text: this.state.custom_text }];
            }
            else if (this.state.memorizeable) {
                paragraphs = this.state.memorizeable.paras;
            }
            return React.createElement("div", null,
                paragraphs.map((para, i) => {
                    return React.createElement(MemoParagraphs, { key: i, paragraphs: [para], onComplete: () => {
                        } });
                }),
                React.createElement("div", null,
                    React.createElement("button", { onClick: () => {
                            this.setState({
                                showing: !this.state.showing,
                            });
                        } }, "Custom"),
                    editpart),
                this.props.items.map((item, i) => {
                    return React.createElement("button", { key: i, onClick: () => {
                            this.setState({
                                custom_text: '',
                                memorizeable: item,
                            });
                        } }, item.ref || i);
                }));
        }
    }
    function start(elem) {
        ReactDOM.render(React.createElement(MemoApp, { items: repo_1.items }), elem);
    }
    exports.start = start;
});
//# sourceMappingURL=memo.js.map
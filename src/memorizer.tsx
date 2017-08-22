import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Memorizeable, Paragraph } from './interfaces'
import { items } from './repo'

function chunkToLetterish(x:string):string[] {
  return x.match(/([^a-zA-Z0-9]*[a-zA-Z0-9][^a-zA-Z0-9]*)/g);
}

interface MemoParagraphsProps {
  paragraphs: Paragraph[];
  onComplete?: () => any;
}
class MemoParagraphs extends React.Component<MemoParagraphsProps,{
  letteridx: number;
  flatletters: string[];
  chunkedparas: Array<string[]>;
}> {
  private elem = null;
  constructor(props) {
    super(props);
    this.state = {
      letteridx: 0,
      flatletters: [],
      chunkedparas: [],
    }
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
    this.setState({letteridx: 0});
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
    let {letteridx, chunkedparas} = this.state;
    let paras = chunkedparas.map((para, idx) => {
      let text = para.map((letterish, j) => {
        if (pointer++ < letteridx) {
          return letterish;
        } else {
          return letterish.replace(/[a-zA-Z0-9]/g, '_');
        }
      })
      return <p key={idx}>{text}</p>
    })
    let cls = "quiz-area"
    if (letteridx >= this.state.flatletters.length) {
      cls += " complete";
    }
    return <div
      className={cls}
      onKeyDown={this.handleKeypress}
      tabIndex={1}
      ref={elem => {
        if (elem) {
          this.elem = elem;
        }
      }}>
      {paras}
    </div>
  }
  get nextLetter() {
    let {flatletters, letteridx} = this.state;
    if (letteridx >= flatletters.length) {
      return null;
    }
    return flatletters[letteridx].match(/[a-zA-Z0-9]/)[0].toLowerCase();
  }
  handleKeypress = (ev) => {
    if (ev.key.toLowerCase() === this.nextLetter || ev.key === 'Tab') {
      let newletteridx = this.state.letteridx+1;
      if (newletteridx === this.state.flatletters.length) {
        if (this.props.onComplete) {
          this.props.onComplete();
        }
      }
      this.setState({letteridx: newletteridx});
      ev.preventDefault();
    } else if (ev.key === ' ') {
      ev.preventDefault();
    }
  }
}

class MemoApp extends React.Component<{
  items: Memorizeable[];
}, {
  showing: boolean;
  custom_text: string;
  memorizeable: Memorizeable;
}> {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
      custom_text: '',
      memorizeable: null,
    }
  }
  render() {
    let editpart;
    if (this.state.showing) {
      editpart = (
      <div>
        <textarea
          value={this.state.custom_text}
          onChange={(ev) => {
            this.setState({custom_text: ev.target.value});
          }}>
        </textarea>
      </div>);
    }
    let paragraphs = [];
    if (this.state.custom_text) {
      paragraphs = [{text: this.state.custom_text}];
    } else if (this.state.memorizeable) {
      paragraphs = this.state.memorizeable.paras;
    }
    return <div>
      {paragraphs.map((para, i) => {
        return <MemoParagraphs
          key={i}
          paragraphs={[para]}
          onComplete={() => {
        }}/>  
      })}
      <div>
        <button onClick={() => {
          this.setState({
            showing: !this.state.showing,
          });
        }}>Custom</button>
        {editpart}
      </div>
      {this.props.items.map((item, i) => {
        return <button
          key={i}
          onClick={() => {
            this.setState({
              custom_text: '',
              memorizeable: item,
            })
          }}
        >{item.ref || i}</button>
      })}
    </div>
  }
}


export function start(elem) {
  ReactDOM.render(<MemoApp
    items={items}
  />, elem);
}

import * as React from 'react';
import * as ReactDOM from 'react-dom';

class Memorizer {

}
interface Paragraph {
  label?: string;
  text: string;
}

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
      tabIndex={1}>
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
    }
  }
}


class MemoApp extends React.Component<any, {

}> {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
      sampletext: 'But Ammon said unto him: I do not boast in my own strength, nor in my own wisdom; but behold, my joy is full, yea, my heart is brim with joy and I will rejoice in my God.',
    }
  }
  render() {
    let editpart;
    if (this.state.showing) {
      editpart = (
      <div>
        <textarea
          value={this.state.sampletext}
          onChange={(ev) => {
            this.setState({sampletext: ev.target.value});
          }}>
        </textarea>
      </div>);
    }
    let paragraphs = [{text: this.state.sampletext}];
    return <div>
      <MemoParagraphs
        paragraphs={paragraphs}
        onComplete={() => {
          // this.setState({showing: true});
        }}/>
      <button onClick={() => {
        this.setState({showing: !this.state.showing});
      }}>Configuration</button>
      {editpart}
    </div>
  }
}


export function start(elem) {
  ReactDOM.render(<MemoApp />, elem);
}

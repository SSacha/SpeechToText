
import React, { Component } from 'react'

import Button from './Button'
import './App.css'

//-----------------SPEECH RECOGNITION SETUP---------------------

var SpeechRecognition = SpeechRecognition || window.webkitSpeechRecognition
let recognition = new SpeechRecognition()

recognition.continous = true
recognition.interimResults = true
recognition.lang = 'fr-FR'

//------------------------COMPONENT-----------------------------

class App extends Component {

  constructor() {
    super()
    this.state = {
      listening: false,
      feedback: 'default',
      colors: ['green', 'yellow', 'red'],
      interimTranscript: '',
      finalTranscript: '',
      confidence: 0,
    }
    this.toggleListen = this.toggleListen.bind(this)
    this.handleListen = this.handleListen.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  changeColor(listenedSpeech) {
    const arrayOfWords = listenedSpeech !== undefined ? listenedSpeech.split(' ') : []

    if (arrayOfWords.includes('couleur')) {
      return this.setState({ feedback: 'red'})
    } else if (arrayOfWords.includes('test')) {
      return this.setState({ feedback: 'yellow' })
    } 
    return this.setState({ feedback: 'default' })
  }

  confidenceHighEnough(isFinal, sentence, rate) {
    let value = ''
    if (rate > 0.7 && isFinal) {  
      value += sentence + ' '
    } else {
      value = ''
    }
    return value
  }
  
  getConfidence(confidence) {
    return this.setState({ confidence: confidence })
  }

  toggleListen() {
    this.setState({
      listening: !this.state.listening
    }, this.handleListen)
  }

  handleListen() {
    console.log('listening?', this.state.listening)

    if (this.state.listening) {
      recognition.start()
      recognition.onend = () => {
        console.log("...continue listening...")
        recognition.start()
      }

    } else {
      recognition.stop()
      recognition.onend = () => {
        console.log("Stopped listening per click")
      }
    }

    recognition.onstart = () => {
      console.log("Listening!")
    }
    
    recognition.onresult = event => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;
        const isFinal = event.results[i].isFinal;
        console.log(event.results)
        this.getConfidence(confidence)
        let phrase = this.confidenceHighEnough(isFinal, transcript, confidence)
        this.changeColor(phrase)
        
        this.handleChange(transcript, phrase)
      }
    }
  }

  handleChange(interimPhrase, finalPhrase) {
    this.setState({interimTranscript: interimPhrase})
    this.setState(prevState => (
      {finalTranscript : prevState.finalTranscript.concat(finalPhrase)}
    ))
  }

  render() {
    const { colors, feedback, finalTranscript, interimTranscript, confidence } = this.state
    return (
      <div className='container'>
        <button id='microphone-btn' className='button on-off' onClick={this.toggleListen} />
        <div className="full">
          <textarea id='interim' className='interim' onChange={this.handleChange} value={interimTranscript}></textarea>
          <input className="speech-precision interim" onChange={this.getConfidence} value={`Confiance : ${confidence}`}></input>
        </div>
        <textarea id='final' className='final' onChange={this.handleChange} value={finalTranscript}></textarea>
        {colors.map((name, index) => (
          <Button
            id={index}
            key={index}
            button={name}
            feedback={feedback}
          />
        ))}
      </div>
    )
  }
}

export default App

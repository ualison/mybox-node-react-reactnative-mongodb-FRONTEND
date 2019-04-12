import React, { Component } from 'react';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import  './styles.css';
import api from '../../services/api';
import logo from '../../assets/logo.svg';
import {MdInsertDriveFile} from 'react-icons/md';
import DropZone from 'react-dropzone';
import socket from 'socket.io-client';

export default class Box extends Component {

  state = {box: {}}

  async componentDidMount(){
    this.subscribeNoToNewFiles();

    const box = this.props.match.params.id;
    const response = await api.get(`boxes/${box}`);

    this.setState({box: response.data});
  }

  subscribeNoToNewFiles = () => {
    const box = this.props.match.params.id;
    const io = socket('https://mybox-backend.herokuapp.com');

    io.emit('connectRoom', box);

    io.on('file', data =>{
      this.setState({box: {... this.state.box, files: [data, ... this.state.box.files]}});
    });

  };

   handleUpload = files  => {
     files.forEach(file => {
      const data = new FormData();
      const box = this.props.match.params.id;

      data.append('file', file);
      api.post(`boxes/${box}/files`, data);
    });
  };

  render() {
    return (
        <div id='box-container'>
          <header>
            <img src={logo} alt=''/>
            <h1>{this.state.box.title}</h1>
          </header>
          <DropZone onDropAccepted={this.handleUpload}>
            {({getRootProps, getInputProps}) => (
              <div className='upload' {... getRootProps()}>
              <input {...getInputProps()} />
              <p> Arrate arquivos ou clique aqui</p>
              </div>
            )}
          </DropZone>



          <ul>
            {this.state.box.files && this.state.box.files.map(file => (
              <li key={file._id}>
              <a className='fileInfo' href={file.url} target='_blank'  rel="noopener noreferrer">
                <MdInsertDriveFile size={24} color='#A5Cfff'/>
                <strong>
                 {file.title}
                </strong>
              </a>
              <span>
                há{' '}
              {distanceInWords(file.createdAt, new Date(), {
                  locale: pt
              })}</span>
            </li>
            ))}
          </ul>
        </div>
    );
  }
}

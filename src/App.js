import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './App.css';
import avatar from './assets/img/avatar.png'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.handlerNEWComment = this.handlerNEWComment.bind(this);
    this.addCommetButoon = this.addCommetButoon.bind(this);
    this.editButton = this.editButton.bind(this);
    this.editInput = this.editInput.bind(this);
    this.delBut = this.delBut.bind(this);
    this.repBut = this.repBut.bind(this);
    this.LoadMoreHandler = this.LoadMoreHandler.bind(this);
    this.repInput = this.repInput.bind(this);
    this.state = {
      currentUser: 'Antony Musk',
      comments: [
        { user: 'Kurt Thompson',
          photo: avatar, 
          coment: 'If non everyone makes money blogging, why is blogging so popular?', 
          time: '2015-07-06 at 13-57',
          sw: true,
          replyValue: [  ],
          showRep: false
        }
      ],
      newComment: { 
        user: 'Kurt Thompson', 
        photo: avatar, 
        coment: '', 
        time: 0, 
        sw: true ,
        replyValue: '',
        showRep: false
      },
      newReply: {},
      limit: 5
    }
  }

  handlerNEWComment(e) {
      this.state.newComment['coment'] = e.target.value;
      this.setState({newComment: this.state.newComment});
  }
  addCommetButoon() {
    //get current date
    let date = new Date().toLocaleString();
    date = date.replace(',', ' at').slice(0, -3);
    this.state.newComment['time'] = date;
    this.setState({time: this.state.newComment });
    //push new comment in main arr
    this.state.comments.push(this.state.newComment);
    this.setState({comments: this.state.comments,
      newComment: { user: 'Kurt Thompson', photo: avatar, coment: '', time: 0, sw: true }});
  }

  /*buttons: edit, del, reply*/

  editButton(id) {
    this.state.comments[id]['sw'] = !this.state.comments[id]['sw'];
    this.setState({comments: this.state.comments});
  }
  editInput(id, e) {
    this.state.comments[id]['coment'] = e.target.value;
    this.setState({commen: this.state.comments});
  }
  delBut(id) {
    this.state.comments.splice(id, 1);
    this.setState({comments: this.state.comments});
  }
  repBut(id) {
    this.state.comments[id]['showRep'] = !this.state.comments[id]['showRep'];
    this.setState({showRep: this.state.comments});
  }
  LoadMoreHandler() {
    this.setState({limit: this.state.limit + 5});
    console.log(this.state.limit);
  }
  repInput(id, e) {
    this.state.comments[id]['replyValue'] = e.target.value;
    this.setState({replyValue: this.state.comments});
  }
  render() {
    console.log(this.state.comments[0]);
    let countCommets = this.state.comments.length;
    const listOFcomments = this.state.comments.slice(0, this.state.limit).map( (item, id) => {  //
      return <Comments
                  key={id}
                  index={id}
                  name={item.user}
                  ava={item.photo}
                  text={item.coment}
                  time={item.time}
                  editBut={this.editButton}
                  editInp={this.editInput}
                  delBut={this.delBut}
                  repBut={this.repBut}
                  sw={item.sw}
                  showRep={item.showRep}
                  curUser={this.state.currentUser}
                  repInput={this.repInput}
                  replyValue={item.replyValue}
                  
      />
    })
    return <div>
        <section className="postBottomInfo">{countCommets}</section>
        <AddComment
            photo={this.state.newComment['photo']}
            areaFcomment={this.handlerNEWComment}
            user={this.state.newComment['user']}
            value={this.state.newComment['coment']}
            button={this.addCommetButoon}
        />       
        {listOFcomments}
        { this.state.comments.length > 5 ? <LoadMore more={this.LoadMoreHandler} /> : null }
    </div>
  }
}


class AddComment extends Component {
  render() {
    let { photo, user, value, areaFcomment, button } = this.props;
    return <div>
              <img src={photo} alt={user}/>
              <textarea
                  type="text"
                  value={value}
                  onChange={areaFcomment}
              />
              <br/>
              <button onClick={button} 
                      disabled={ this.props.value == "" ? true:false } >SEND</button>
              <div className="separate"></div>
    </div>
  }
}


class Comments extends Component {
  render() {
    let { index, 
          name, 
          ava, 
          text, 
          time, 
          sw, 
          editBut, 
          editInp, 
          delBut, 
          repBut,
          showRep,
          curUser,
          repInput,
          replyValue } = this.props;
    return <div className="commentWrapper">
            <img src={ava} alt={name}/>
            <div>
              <p>{name} <span> {time}</span></p>
              <p>{ sw ? text : 
                    <textarea 
                        type="text"
                        value={text}
                        onChange={editInp.bind(null, index)}
                    />}
              </p>
              <button onClick={editBut.bind(null, index)}>{sw ? `Edit`:`Ok`}</button>
              <button onClick={delBut.bind(null, index)}>Delete</button>
              <button onClick={repBut.bind(null, index)}>Reply</button>
              { !showRep ? null : 
                <div className="blockFOReplay">
                    <img src={ava} alt={name}/>
                    <div>
                      <p>{curUser} to {name} <span> {time}</span></p>
                      <TextAreaReply
                        repInput={repInput}
                        replyValue={replyValue}
                        index={index}
                      />
                    </div>
                </div>}
            </div>
    </div>
  }
}

class TextAreaReply extends Comments {
  constructor(props) {
    super();
    this.state = {
      saveReply: false
    }
  }
  saveRepFunc() {
    this.setState({saveReply: !this.state.saveReply});
  }
  render() {
    return <div>
        {
          !this.state.saveReply 
          ?
          <textarea
            type="text"
            value={this.props.replyValue}
            onChange={this.props.repInput.bind(null, this.props.index)}
            onBlur={this.saveRepFunc.bind(this)} /> 
          :
          <p onClick={this.saveRepFunc.bind(this)}>{this.props.replyValue}</p>
        }
    </div>
  }
}



const LoadMore = (props) => <button onClick={props.more}>More</button>

// {
//   !this.state.saveReply 
//   ?
//   <textarea
//     type="text"
//     value={replyValue}
//     onChange={repInput.bind(null, index)}
//     onMouseLeave={this.blurHandler.bind(this)} /> 
//   :
//   <p>1</p>
// }
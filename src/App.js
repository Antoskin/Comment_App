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
    this.addNewReplyButton = this.addNewReplyButton.bind(this);
    //for new reply comment
    this.replyInput = this.replyInput.bind(this);
    this.state = {
      currentUser: 'Antony Musk',
      comments: [
        { user: 'Miranda Thompson',
          photo: avatar, 
          coment: 'If non everyone makes money blogging, why is blogging so popular?', 
          time: '2015-07-06 at 13-57',
          sw: true,
          replyValue: [ ],
        }
      ],
      newComment: { 
        user: 'Kurt Thompson', 
        photo: avatar, 
        coment: '', 
        time: 0, 
        sw: true ,
        replyValue: [ ],
      },
      newReply: { user: 'Antony Musk', photo: avatar, coment: '', time: 0 },
      limit: 5
    }
  }

  componentDidUpdate() {
    $('.replyTarget').click( function() {
      $('.addReplyArea').css({'display':'none'});
      $(this).parents('.commentWrapper').find('.addReplyArea').slideDown('fast');
    })
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
      newComment: { user: 'Kurt Thompson', photo: avatar, coment: '', time: 0, sw: true,
      replyValue: [  ] }});
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

  //for new reply comment
  replyInput(e) {
    this.state.newReply['coment'] = e.target.value;
    this.setState({coment: this.state.newReply});
  }
  addNewReplyButton(id) {
    this.state.comments[id].replyValue.push(this.state.newReply);
    this.setState({ replyValue: this.state.comments, newReply: { user: 'Antony Musk', photo: avatar, coment: '', time: 0 } });
    $('.addReplyArea').css({'display':'none'});
  }
  render() {
    //console.log(this.state.newReply.coment);
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
                  curUser={this.state.currentUser}
                  
                  replyValue={item.replyValue}
                  //for new reply comment
                  newReply={this.state.newReply}
                  replyInput={this.replyInput}
                  addNewReplyButton={this.addNewReplyButton}
                  
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
          curUser,
          replyValue,
          //for new reply comment
          newReply,
          replyInput,
          addNewReplyButton } = this.props;
          
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
              <button className="replyTarget" onClick={repBut.bind(null, index)}>Reply</button>

              <ReplyComments
                index={index}
                name={name}
                replyValue={replyValue}
              />
              <AddReplyComment
                index={index}
                newReply={newReply}
                replyInput={replyInput}
                addNewReplyButton={addNewReplyButton}
              />

            </div>
  
    </div>
  }
}

class ReplyComments extends Comments {
  render() {
    let { name, replyValue } = this.props;
    let lostOfReplyes = this.props.replyValue.map( (i, id) => {
      return  <li key={id}>
                    <img src={i.photo}/>
                    <ul>
                        <li><span>{i.user}</span> to <span>{name}</span> <span>{i.time}</span></li>
                        <li>{i.coment}</li>
                    </ul>
              </li>
    })
    return <ul className="replysComponentBlock">
      {lostOfReplyes}
    </ul>
  }
}


class AddReplyComment extends Comments {
  render() {
    let { index, addNewReplyButton } = this.props;
    return <div className="addReplyArea">
            <textarea
                type="text"
                value={this.props.newReply.coment}
                onChange={this.props.replyInput.bind(null)}
    />
            <button data-cl={index} onClick={addNewReplyButton.bind(null,index)}>Add</button>
    </div>
  }
}

const LoadMore = (props) => <button onClick={props.more}>More</button>


import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './App.css';
import avatar from './assets/img/avatar.png'
import ava2 from './assets/img/avatarFemale.png'

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
    this.cancelReply = this.cancelReply.bind(this);
    this.state = {
      currentUser: 'Kurt Thompson',
      comments: [
        { user: 'Miranda Rojah',
          photo: ava2, 
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
      $(this).parents('.commentWrapper').find('.addReplyArea').slideDown('fast').css({'display': 'flex'});
    })
  }

  handlerNEWComment(e) {
      this.state.newComment['coment'] = e.target.value;
      this.setState({newComment: this.state.newComment});
  }
  addCommetButoon() {
    //get current date
    let date = new Date().toLocaleString().replace(',', ' at').slice(0, -3);
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
    this.state.newReply['coment'] = '';
    this.state.comments[id]['showRep'] = !this.state.comments[id]['showRep'];
    this.setState({showRep: this.state.comments});
  }
  LoadMoreHandler() {
    this.setState({limit: this.state.limit + 5});
    console.log(this.state.limit);
  }

  //for new reply comment
  replyInput(e) {
   //get time for Reply
    let date = new Date().toLocaleString().replace(',', ' at').slice(0, -3);
    this.state.newReply['time'] = date;
    this.state.newReply['coment'] = e.target.value;
    this.setState({coment: this.state.newReply});
  }
  cancelReply() {
    this.state.newReply['coment'] = '';
    this.setState({coment: this.state.newReply});
    $('.addReplyArea').css({'display':'none'});
  }
  addNewReplyButton(id) {
    this.state.comments[id].replyValue.push(this.state.newReply);
    this.setState({ replyValue: this.state.comments, newReply: { user: 'Antony Musk', photo: avatar, coment: '', time: 0 } });
    $('.addReplyArea').css({'display':'none'});
  }
  render() {
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
                  cancelReply={this.cancelReply}
      />
    })
    return <div>
    <div className="bottomPost">
      <span><i className="fa fa-user" aria-hidden="true"></i>Post by <b>Will Smith</b></span>
      <span><i className="fa fa-clock-o" aria-hidden="true"></i> Posted <b>June 18, 2015</b> at <b>21:44</b></span>
      <span><i className="fa fa-comment" aria-hidden="true"></i> <b>{countCommets}  {countCommets == 1 ? `comment`: `comments` } </b> </span>
    </div>
    <h5>Leave comment:</h5>
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
    return <div className="leaveComment">
              <div className="avaForleaveComment"><img src={photo} alt={user}/></div>
              <textarea
                  type="text"
                  value={value}
                  placeholder="Your message"
                  onChange={areaFcomment}
              />
              <br/>
              <button onClick={button} 
                      disabled={ this.props.value == "" ? true:false } >Send</button>
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
          addNewReplyButton,
          cancelReply } = this.props;
          
    return <div className="commentWrapper">
            <img className="commentUserAva" src={ava} alt={name}/>
            <div className="theComment">
              <p><b>{name}</b> <span> <i className="fa fa-clock-o" aria-hidden="true"></i> {time}</span></p>
              <p className="lengthOFcomment">{ sw ? text : 
                    <textarea 
                        type="text"
                        value={text}
                        onChange={editInp.bind(null, index)}
                    />}
              </p>
              {curUser == name ? <button onClick={editBut.bind(null, index)}>{sw ? <i className="fa fa-pencil-square-o" aria-hidden="true"> Edit</i>:`Ok`}</button> :null }
              {curUser == name ? <button onClick={delBut.bind(null, index)}><i className="fa fa-times" aria-hidden="true"> Delete</i></button>: null}
              
              <button className="replyTarget" onClick={repBut.bind(null, index)}><i className="fa fa-reply" aria-hidden="true"> Reply</i>
              </button>

              <ReplyComments
                index={index}
                name={name}
                replyValue={replyValue}
              />
              <AddReplyComment
                index={index}
                name={name}
                newReply={newReply}
                replyInput={replyInput}
                addNewReplyButton={addNewReplyButton}
                cancelReply={cancelReply}
              />
            </div>
    </div>
  }
}

class ReplyComments extends Component {
  render() {
    let clas = {transform: 'scale(-1, 1)'};
    let { name, replyValue } = this.props;
    let lostOfReplyes = this.props.replyValue.map( (i, id) => {
      return  <li key={id}>
                    <img src={i.photo}/>
                    <ul>
                        <li>
                            <b>{i.user}</b> <span> </span> 
                            <i style={clas} className="fa fa-reply" aria-hidden="true"></i> 
                            <span> {name} </span> 
                            <b><i className="fa fa-clock-o" aria-hidden="true"></i> {i.time}</b>
                        </li>
                        <li>{i.coment}</li>
                    </ul>
              </li>
    })
    return <ul className="replysComponentBlock">
      {lostOfReplyes}
    </ul>
  }
}


class AddReplyComment extends Component {
  render() {
    let { index,name, addNewReplyButton, cancelReply, newReply } = this.props;
    return <div className="addReplyArea">
            <p className="replyesTo"><i className="fa fa-reply" aria-hidden="true"></i> { name}</p>
            <button onClick={cancelReply.bind(null, index)}>
                <i className="fa fa-times" aria-hidden="true"> Cancel</i>
            </button>
            <textarea
                type="text"
                placeholder="Your message"
                value={newReply.coment}
                onChange={this.props.replyInput.bind(null)}
            />
            <span>
              <button disabled={newReply.coment == '' ? true:false} 
                     data-cl={index} 
                     className="addReplyBut"
                     onClick={addNewReplyButton.bind(null,index)}>
                                    Send
              </button>
            </span>
    </div>
  }
}

const LoadMore = (props) => <button className="loadMoreButton" onClick={props.more}>Load more comments</button>

//  <div className="wrapMore"><span></span></div>

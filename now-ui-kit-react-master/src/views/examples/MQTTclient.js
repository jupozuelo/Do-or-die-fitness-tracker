// Create a client instance, we create a random id so the broker will allow multiple sessions
import React from "react";
// import jQuery from 'jquery';
import Paho from 'paho-mqtt';
import { Redirect } from "react-router-dom";


import {
  Button,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
  Row,
} from "reactstrap";

class Mqtt extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        mqttConnected: false,
      //new challenge page
        challenge_id: '',
        challenge_name: '',
        challenge_description: '',
        challenge_step_goal: '',
        challenge_end_date: '20-03-31',
        challenge_reward: '',
        challenges_loaded: false,
        challenge_array: [],
      //login/signup page
        login_username: '',
        redirect: false,
      //ProfilePage
        total_steps: 0,
        remaining_sec: 0,
        ranking: 8364,
        user_challenges: [],
        dummy_counter: 0, // used to calculate a dummy ranking

    };
    this.handleChange = this.handleChange.bind(this);
    this.pushNewChallenge = this.pushNewChallenge.bind(this);
    this.onMessageArrived = this.onMessageArrived.bind(this);
  }

  componentDidMount() {
    this.client = new Paho.Client("broker.mqttdashboard.com", 8000, "clientId" + this.makeid(3) );
    this.client.connect({onSuccess: this.onConnect.bind(this)});
    this.client.onConnectionLost = this.onConnectionLost;
    this.client.onMessageArrived = this.onMessageArrived;
  }

  render(){
      if(this.props.type === "login"){
        return(this.renderLogin())
      }
      if(this.props.type === "sign-up"){
        return(this.rendersignup())
      }
      if(this.props.type === "profile"){
        return(this.renderProfile())
      }
      if(this.props.type === "challenges"){
        return(this.renderGetChallenges())
      }
      if(this.props.type === "set-challenge"){
        return(this.renderSetChallenge())
      }
  }

renderProfile(){
  if (this.state.mqttConnected === true){
    this.requestProfile();
  }
  if(this.state.user_challenges.length === 0)
  {
    return(
    <div>
    <h2 align="middle" classname="title">Loading...</h2>
      <iframe
        style={{
          position: "relative",
          top: 0,
          left: 0,
          width: 1080,
          height: 640,
        }}
        src="https://www.youtube.com/embed/1svA2sGhDEE"
        align="middle"
        title="Pink Windmill Kids"
      />
      </div>
    )
  }
  else {
  return(
    <div>
    <p className="category">Your Stats</p>
    <div className="content">
      <div className="social-description">
        <h2>{this.state.total_steps}</h2>
        <p>Steps</p>
      </div>
      <div className="social-description">
        <h2>{this.state.remaining_sec}</h2>
        <p>Seconds Lifetime</p>
      </div>
      <div className="social-description">
        <h2>#{this.state.ranking}</h2>
        <p>Ranking</p>
      </div>
    </div>
    <h3 className="title">About me</h3>
    <h5 className="description">
      I only take credit bets with rankers in the top 1000, if you're
      not in that group, don't @ me. First user to reach 10,000km walked
      within a month, and only user to ever hold the #1 spot in the
      leaderboards. Also I'm F2P.
    </h5>
      <h3 className="title">Ongoing Challenges</h3>
      <React.Fragment>
         <div align="middle" class="tg-wrap"><table id="ccp">
         {this.state.user_challenges.map(listitem => (
           <tr>
             <td>{listitem.challenge_name}</td>
             <td>{listitem.description}</td>
             <td>{listitem.step_goal}</td>
             <td>{listitem.end_time}</td>
             <td>{listitem.reward}</td>
           </tr>
         ))}
         </table></div>
      </React.Fragment>
              <h3 className="title">Achievements</h3>
                  <Row>
                            <Col>
              <p>Extreme Strider</p>
                <img
                  alt="..."
                  className="img-raised"
                  src={require("assets/img/tired1.png")}
                ></img><br/><br/><br/><br/>
<p>Close Call</p>
                <img
                  alt="..."
                  className="img-raised"
                  src={require("assets/img/neardeath1.png")}
                ></img><br/><br/><br/><br/>
              </Col>
              <Col>
<p>Champion</p>
                <img
                  alt="..."
                  className="img-raised"
                  src={require("assets/img/winicon1.png")}
                ></img><br/><br/><br/><br/>
<p >In The Red</p>
                <img
                  alt="..."
                  className="img-raised"
                  src={require("assets/img/death1.png")}
                ></img><br/><br/><br/><br/>
              </Col>
            </Row>
  </div>

)}
}

requestProfile(){
  if(this.state.total_steps !== 0){
    this.wait(1000);
  }
  console.log("Requesting profile...");
  var newRequest = {
    type: "pull profile",
    user_name: global.userName
  }
  this.requestToServer(JSON.stringify(newRequest));
}

rendersignup(){
  return(
    <Col className="text-center ml-auto mr-auto" lg="6" md="8">
    <InputGroup>
      <InputGroupAddon addonType="prepend">
        <InputGroupText>
          <i className="now-ui-icons users_circle-08"></i>
        </InputGroupText>
      </InputGroupAddon>
      <Input
        placeholder="User Name..."
        type="text"
        value={this.state.login_username}
        onChange={(event) => this.loginChange('login_username', event)}
      ></Input>
    </InputGroup>
    <div className="send-button">
    {this.redirectToProfile()}
      <Button
        block
        className="btn-round"
        color="info"
        size="lg"
        onClick={this.handleLogin.bind(this)}
      >
      Sign up now
      </Button>
      <div className="pull-middle">
        <h6>
          <a
            className="link"
            href="/login-page"
          >
            Login to existing Account
          </a>
        </h6>
      </div>
    </div>
    </Col>
  )
}

redirectToProfile(){
  if (this.state.redirect) {
    return(
         <Redirect to={{
               pathname: '/profile-page',
           }} />)
  }
}

handleLogin(){
  this.setState({
  redirect: true
})
}

loginChange(type,event){
  this.setState({[type]: event.target.value});
  global.userName= event.target.value;
}

handleChange(type,event) {
   this.setState({[type]: event.target.value});
}

renderLogin(){
  return(
    <form >
    <InputGroup
      >
      <InputGroupAddon addonType="prepend">
        <InputGroupText>
          <i className="now-ui-icons users_circle-08"></i>
        </InputGroupText>
      </InputGroupAddon>
      <Input
        placeholder="User Name..."
        type="text"
        value={this.state.login_username}
        onChange={(event) => this.loginChange('login_username', event)}
      ></Input>
    </InputGroup>
    <InputGroup>
      <InputGroupAddon addonType="prepend">
        <InputGroupText>
          <i className="now-ui-icons text_caps-small"></i>
        </InputGroupText>
      </InputGroupAddon>
      <Input
        placeholder="Password..."
        type="password"
      ></Input>
    </InputGroup>
    {this.redirectToProfile()}
    <Button
      block
      className="btn-round"
      color="info"
      onClick={this.handleLogin.bind(this)}
      size="lg"
      >    Login
    </Button>
    </form>
  );
}

requestChallenges(){
  console.log("Requesting challenges...")
  var newRequest1 = {
    type: "pull all challenges"
  }
  this.requestToServer(JSON.stringify(newRequest1))
}

renderGetChallenges(){
   if(this.state.mqttConnected === true && this.state.challenges_loaded === false){
    this.requestChallenges()
    this.setState({challenges_loaded: true})
  }
  if(this.state.challenge_array.length === 0)
  {
    return <div> <h2> Loading challenges... </h2> </div>
  }
  else{
   return(
     <React.Fragment>
        <div align="middle" class="tg-wrap"><table id="ccp">
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Step Goal</th>
          <th>End Date</th>
          <th>Reward</th>
          <th></th>
        </tr>
          {this.state.challenge_array.map(listitem => (
            <tr>
              <td>{listitem.challenge_name}</td>
              <td>{listitem.description}</td>
              <td>{listitem.step_goal}</td>
              <td>{listitem.end_time}</td>
              <td>{listitem.reward}</td>
              <td><Button className="submit-button" onClick={(event) => this.pushSelectedChallenge(event,listitem.challenge_id)} variant="outlined" size="large" color="primary">Accept Challenge</Button></td>
            </tr>
          ))}
        </table></div>
      </React.Fragment>
  );
}
}

pushSelectedChallenge(event,id){
var selectedChallenge = {
  type: "push select challenge",
  user_name: global.userName,
  challenge_id: id
  }
  this.requestToServer(JSON.stringify(selectedChallenge));
  alert("You successfully joined this challenge");
}

renderSetChallenge(){
return(
    <div>
    <form align="left" onSubmit={this.validateChallengeInput.bind(this)} >
    <label className ="form-label">Challenge Name:  </label>
    <input type="text"  value={this.state.challenge_name} onChange={(event) => this.handleChange('challenge_name', event)} /><p/>
    <label className ="form-label">Description:  </label>
    <input type="text" className='challenge-textfield' value={this.state.challenge_description} onChange={(event) => this.handleChange('challenge_description', event)} /><p/>
    <label className ="form-label">End Date: </label>
    <input type="date"  value={this.state.challenge_end_date} onChange={(event) => this.handleChange('challenge_end_date', event)} /><p/>
    <label className ="form-label">Step Goal: </label>
    <input type="number"  value={this.state.challenge_step_goal} onChange={(event) => this.handleChange('challenge_step_goal', event)}/><p/>
    <label className ="form-label">User Reward: </label>
    <input type="number"  value={this.state.challenge_reward} onChange={(event) => this.handleChange('challenge_reward', event)}/><p/>

    <button className="submit-button">Create Challenge</button>
    </form>
    </div>
  )
}

  validateChallengeInput(event){
    event.preventDefault();
    if(this.state.challenge_name === '' || this.state.challenge_description === '' || this.state.challenge_reward === '' || this.state.challenge_step_goal === ''){
      alert("Please complete all fields");
    }
    else if(this.state.challenge_reward >=0 && this.state.challenge_step_goal >=0){
      this.pushNewChallenge(event);
    }
    else{
      alert("Please enter positive numbers");
    }
  }

  pushNewChallenge(event){
    console.log(JSON.stringify(this.state.challenge_name));
    console.log("Pushing New Challenge");
    var today = new Date(),
    date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()+'T'+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds()+'.'+today.getMilliseconds()+'Z';
  	var newChallenge = {
      type: "push new challenge",
      challenge_id: "C" + this.makeid(6),
      challenge_name: this.state.challenge_name,
      description: this.state.challenge_description,
      end_time: this.state.challenge_end_date,
      step_goal: this.state.challenge_step_goal,
      reward: this.state.challenge_reward,
      current_time: date
    }

  	this.requestToServer(JSON.stringify(newChallenge));
    alert("You successfully created a new challenge");
  }

  // called when the client connects
  onConnect() {
    // Once a connection has been made report.
    console.log("Connected");
    this.setState({
    mqttConnected: true
  });

    // this.state.mqttConnected = true;
  }
  // called when the client connects
  requestToServer(payload) {
    // Once a connection has been made, make a subscription and send a message.
    console.log("Request to server");
    this.client.subscribe("doordie_web");
    var message = new Paho.Message(payload);
    message.destinationName = "doordie_web";
    this.client.send(message);
  }
  // called to generate the IDs
  makeid(length) {
     var result           = '';
     var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     var charactersLength = characters.length;
     for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
  }

  // called when the client loses its connection
  onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("Mqtt.onConnectionLost:"+responseObject.errorMessage);
    }
  }

  // called when a message arrives
  onMessageArrived(message) {
    console.log("Mgtt.onMessageArrived:"+message.payloadString);
    var json_message = JSON.parse(message.payloadString);

    if(json_message.type === 'push all challenges'){
      console.log("attempt to get array");
      this.setState({challenge_array: json_message.challenge})
    }

    if(json_message.type === 'push web profile' && json_message.user_name === global.userName){
      console.log("HELLLO");
      this.setState({
        total_steps: json_message.total_steps,
        remaining_sec: json_message.remaining_sec,
        user_challenges: json_message.challenge,
        ranking: Math.max(1, Math.round(8378 -json_message.total_steps +this.state.dummy_counter/3,0)), //dummy formula: so that it looks like your ranking changes when the step count goes up
        dummy_counter: this.state.dummy_counter + 1
      })
    }
}

  //wait function called after sever request, to avoid spaming the server
  wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
  }

}
export default Mqtt;

'use strict';
import util from '../util';
import sessionStore from '../stores/sessionStore';

export default React.createClass({

  render: function () {
    return (
      <div className="valign-center">
        <form id="loginform" className="col-sm-6 col-sm-offset-3 col-xs-8 col-xs-offset-2" onSubmit={this.login}>
          <div className="uppercase">Welcome</div>
          <div className="form-group">
            <input className="form-control" type="email" name="email"/>
          </div>
          <div className="form-group">
            <input className="form-control" type="password" name="password"/>
          </div>
          <input className="btn btn-primary btn-block" type="submit" value="Go!"/>
        </form>
      </div>
    );
  },

  login: function (event){
    event.preventDefault();
    console.log(sessionStore.store);
    sessionStore.set({
        action: 'login',
        payload: util.getFormData(event.target)
      });
  }

});

import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import LiveStream from './LiveStream';
import View from './View'

function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <LiveStream />
      </Route>
      <Route exact path="/livestream">
        <LiveStream />
      </Route>
      <Route exact path="/view/:name">
        <View />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
}

export default Routes;

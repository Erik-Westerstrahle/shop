import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Shop from './components/Shop';
import SignUp from './components/SignUp';
import Login from './components/Login';
import EditAccount from './components/EditAccount';
import MyItems from './components/MyItems';
import ChangePassword from './Account';

function AppRouter() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/shop" component={Shop} />
        <Route path="/signup" component={SignUp} />
        <Route path="/login" component={Login} />
        <Route path="/account" component={EditAccount} />
        <Route path="/myitems" component={MyItems} />
        <Route path="/account" component={ChangePassword} />
      </Switch>
    </BrowserRouter>
  );
}

export default AppRouter;

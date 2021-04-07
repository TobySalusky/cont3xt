import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from "./Home";
import Edit from "./Edit";
import Loader from "./Loader";
import ConfigSelectPage from "./ConfigSelectPage";
import GlobalProvider from "./GlobalContext";
import History from "./History";


function App() {

    return (
        <Router history={History}>
            <GlobalProvider>
                <Loader>
                    <Switch>
                        <Route path ='/' exact component={Home}/>
                        <Route path ='/configurations' component={ConfigSelectPage}/>
                        <Route path ='/edit' component={Edit}/>
                    </Switch>
                </Loader>
            </GlobalProvider>
        </Router>
    );
}

export default App;

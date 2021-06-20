import '../Style/App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from "../Pages/Home";
import Edit from "../Pages/Edit";
import Loader from "../State/Loader";
import ConfigSelectPage from "../Pages/ConfigSelectPage";
import GlobalProvider from "../State/GlobalContext";
import History from "../Util/History";


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

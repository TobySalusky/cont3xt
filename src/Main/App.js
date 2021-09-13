import '../Style/App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from "../Pages/Home";
import Edit from "../Pages/Edit";
import Loader from "../State/Loader";
import ConfigSelectPage from "../Pages/ConfigSelectPage";
import GlobalProvider from "../State/GlobalContext";
import History from "../Util/History";
import MetaTags from 'react-meta-tags';

function App() {

    return (
        <>
            <MetaTags>
                <title>Cont3xt</title>
                <meta id="meta-description" name="description" content="Cont3xt intends to centralize and simplify a structured approach to gathering contextual intelligence in support of technical investigations.." />
                <meta id="og-title" property="og:title" content="Cont3xt"/>
                <meta id="og-image" property="og:image" content="./images/Cont3xtLogo.png"/>
            </MetaTags>
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
        </>
    );
}

export default App;

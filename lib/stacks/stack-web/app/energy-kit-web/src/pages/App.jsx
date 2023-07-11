/************************************************************************
                            DISCLAIMER

This is just a playground package. It does not comply with best practices
of using Cloudscape Design components. For production code, follow the
integration guidelines:

https://cloudscape.design/patterns/patterns/overview/
************************************************************************/
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';

// Components
import ControlPanel from './ControlPanel';
import GetStarted from './GetStarted';
import AccountSettings from './AccountSettings';
import ErrorPage from './ErrorPage'
import FetchUserDetails from '../common/components/FetchUserDetails/index.jsx';

//Styles
import '@cloudscape-design/global-styles/index.css';

// Amplify
import  {Amplify, Auth, Storage, API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';


// No touchy
import { AmplifyConfig } from '../config/amplify-config';
Amplify.configure(AmplifyConfig)


const App = ({signOut, user}) => {
  // let { userId } = useParams();
    return (

    <>
      {/* <Authenticator loginMechanisms={['email']}  hideSignUp> */}
      {/* <Router> */}
              <FetchUserDetails user = {user} signOut = {signOut}  />
          <Routes>
              <Route  path="/" element={<GetStarted />} />
              <Route path="/control-panel" element={<ControlPanel />} />
              <Route  path="/get-started" element={<GetStarted />} />
              <Route  path="/account-settings" element={<AccountSettings />} />
              <Route path = "*" element = {<ErrorPage />} />
          </Routes>
      {/* </Router> */}
    {/* </Authenticator> */}
</>
    );
}

// export default App;
export default withAuthenticator(App);

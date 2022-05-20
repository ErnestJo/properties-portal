import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import { ToastContainer, toast } from 'react-toastify'
import 'devextreme/dist/css/dx.light.css'
import 'react-toastify/dist/ReactToastify.css'
import { PersistGate } from 'redux-persist/integration/react'
import ClipLoader from 'react-spinners/ClipLoader'
import { Provider, connect } from 'react-redux'
import store from './store'

const loading = () => (
  <div className="animated fadeIn pt-3 text-center center-layout-loading">
    <ClipLoader color={'blue'} size={'70'} width={'100%'} height={10} loading={true} />
    <p>Loading......</p>
  </div>
)
// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Login = React.lazy(() => import('./views/authentication/Login'))
const Page404 = React.lazy(() => import('./views/error/Page404'))
const Page500 = React.lazy(() => import('./views/error/Page500'))

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ToastContainer />
        <HashRouter>
          <Suspense fallback={loading}>
            <Routes>
              <Route exact path="/login" name="Login Page" element={<Login />} />
              <Route exact path="/404" name="Login Page" element={<Page404 />} />
              <Route exact path="/500" name="Login Page" element={<Page500 />} />
              <Route path="*" name="Home" element={<DefaultLayout />} />
            </Routes>
          </Suspense>
        </HashRouter>
      </Provider>
    )
  }
}

export default App

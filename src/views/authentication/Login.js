import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../authentication/Login.css'
import { useEffect, useRef, useState, useContext } from 'react'
import loginIcon from '../../assets/images/man.png'
import loginSvg from '../../assets/images/image.svg'
import axios from 'axios'
import { connect } from 'react-redux'
import Notify from '../../Helper/Notify'

const LOGIN_URL = '/api/login'
function Login() {
  const navigate = useNavigate()
  const userRef = useRef()
  const errRef = useRef()

  const [staff_username, setUser] = useState('')
  const [staff_password, setPwd] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setErrMsg('')
  }, [staff_username, staff_password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ staff_username, staff_password }),
        {
          headers: { 'content-Type': 'application/json' },
          withCredentials: true,
        },
      )
      console.log(response.data[0].data.length)
      console.log(response.data[0].data[0])

      if (response.data[0].data.length != 0) {
        Notify.notifySuccess('Successfuly LogedIn')
        navigate('/dashboard')
      } else {
        Notify.notifyErrorTopCenter('Sorry failed to login')
      }

      setUser('')
      setPwd('')
      setSuccess(true)
    } catch (e) {}
  }

  return (
    <div>
      <Container className="mt-5">
        <Row>
          <Col lg={4} md={6} sm={12} className="text-center m-7 p-3 space">
            <img className="icon-img" src={loginIcon} alt="Icon" />
            <h3>Properties Management System</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Enter Username"
                  id="staff_username"
                  autoComplete="off"
                  ref={userRef}
                  value={staff_username}
                  onChange={(e) => setUser(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  id="staff_password"
                  value={staff_password}
                  onChange={(e) => setPwd(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Login
              </Button>
            </Form>
          </Col>
          <Col lg={4} md={6} sm={12}>
            <img className="w-80" src={loginSvg} alt="Icon" />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

// const MapStateToProps = (state) => ({
//   sharedState: state.sharedState,
// })
export default Login

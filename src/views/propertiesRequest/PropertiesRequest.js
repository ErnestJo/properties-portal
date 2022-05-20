import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Button, Card, Modal, Form, Row, Col } from 'react-bootstrap'
import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import ExcelJS from 'exceljs'
import { exportDataGrid } from 'devextreme/excel_exporter'
import saveAs from 'file-saver'
import Notify from '../../Helper/Notify'
import * as Icon from 'react-bootstrap-icons'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import DataGrid, {
  Column,
  FilterRow,
  HeaderFilter,
  SearchPanel,
  Summary,
  TotalItem,
  ColumnChooser,
  Export,
  Selection,
  Lookup,
  Paging,
} from 'devextreme-react/data-grid'

const GetProject_URL = '/api/get_project'
const GetStaff_URL = '/api/get_staff'
const GetProperties_URL = '/api/get_properties'
const GetPropertiesReq_URL = '/api/get_properties_request'
const GetReqStatus_URL = '/api/get_request_status'
const Addproperites_URL = '/api/add_properties_req'

const schema = yup.object().shape({
  req_name: yup.string().required(),
  project_status: yup.number().required(),
  request_status: yup.number().required(),
  req_date: yup.date().required(),
  project: yup.number().required(),
  staff: yup.number().required(),
})

function CustomModal(props) {
  const [projectOption, setProjectOptions] = useState([])
  const [staffOption, setStaffOptions] = useState([])
  const [reqStatusOption, setReqStatusOptions] = useState([])
  const [propertiesOption, setPropertiesOptions] = useState([])

  const userRef = useRef()

  React.useEffect(() => {}, [])
  const { register, errors, handleSubmit, watch, reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  const [errMsg, setErrMsg] = useState('')
  const [success, setSuccess] = useState(false)

  const submitReqData = (data) => {
    try {
      var body = {
        req_name: data.req_name,
        req_date: data.req_date,
        request_status: parseInt(data.request_status),
        staff: parseInt(data.staff),
        propertiy: parseInt(data.propertiy),
        project: parseInt(data.project),
      }
      console.log(body)
      axios
        .post(Addproperites_URL, body, {
          headers: { 'content-Type': 'application/json' },
        })
        .then((data) => {
          reset()
          console.log(data.data[0].data[0])
          if ((data.data[0].data[0].code = 111)) {
            Notify.notifySuccess('Project was added Succefully')
          } else {
            Notify.notifyError('failed to add new project')
          }
        })

      setSuccess(true)
    } catch (e) {}
  }

  useEffect(() => {
    axios({
      method: 'GET',
      url: GetProject_URL,
    })
      .then((data) => {
        console.log(data.data[0].data)
        setProjectOptions(data.data[0].data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    axios({
      method: 'GET',
      url: GetStaff_URL,
    })
      .then((data) => {
        console.log(data.data[0].data)
        setStaffOptions(data.data[0].data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    axios({
      method: 'GET',
      url: GetProperties_URL,
    })
      .then((data) => {
        console.log(data.data[0].data)
        setPropertiesOptions(data.data[0].data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    axios({
      method: 'GET',
      url: GetReqStatus_URL,
    })
      .then((data) => {
        console.log(data.data[0].data)
        setReqStatusOptions(data.data[0].data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal">{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(submitReqData)}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Request Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Request Name"
                  name="req_name"
                  {...register('req_name')}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Label>Property/Item</Form.Label>
              <Form.Select aria-label="Default select" {...register('propertiy')} required>
                <option>Choose Item</option>
                {propertiesOption.length > 0 &&
                  propertiesOption.map((propertiy) => (
                    <option key={propertiy.properties_id} value={propertiy.properties_id}>
                      {propertiy.properties_name}
                    </option>
                  ))}
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Label>For Project</Form.Label>
              <Form.Select aria-label="Default select example" {...register('project')} required>
                <option>Choose Project</option>
                {projectOption.length > 0 &&
                  projectOption.map((project) => (
                    <option key={project.project_id} value={project.project_id}>
                      {project.project}
                    </option>
                  ))}
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Label>Staff</Form.Label>
              <Form.Select aria-label="Default select example" {...register('staff')} required>
                <option>Choose staff</option>
                {staffOption.length > 0 &&
                  staffOption.map((staff) => (
                    <option key={staff.staff_id} value={staff.staff_id}>
                      {staff.staff}
                    </option>
                  ))}
              </Form.Select>
            </Col>

            <Col md={6}>
              <Form.Label>Request Status</Form.Label>
              <Form.Select
                aria-label="Default select example"
                {...register('request_status')}
                required
              >
                <option>Request status options</option>
                {reqStatusOption.length > 0 &&
                  reqStatusOption.map((request_status) => (
                    <option
                      key={request_status.request_status_id}
                      value={request_status.request_status_id}
                    >
                      {request_status.request_status_name}
                    </option>
                  ))}
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Req date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Enter Request date"
                  {...register('req_date')}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Col md={12} className="mt-2">
            <Button onClick={props.onHide}>Close</Button>
            <Button className="float-end" type="submit">
              {props.title}
            </Button>
          </Col>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

const PropertiesRequest = () => {
  const [modalShow, setModalShow] = React.useState(false)
  const [dataPropertiesReqs, setDataPropertiesReq] = useState([])

  const applyFilterTypes = [
    {
      key: 'auto',
      name: 'Immediately',
    },
    {
      key: 'onClick',
      name: 'On Button Click',
    },
  ]

  const onExporting = (e) => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('User sheet')

    exportDataGrid({
      component: e.component,
      worksheet: worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'UserList.xlsx')
      })
    })
    e.cancel = true
  }

  const [state, setState] = useState({
    data: [],
    showFilterRow: true,
    showHeaderFilter: true,
    currentFilter: applyFilterTypes[0].key,
    startDate: new Date(),
    endDate: new Date(),
  })
  var dataGrid = null

  useEffect(() => {
    axios({
      method: 'GET',
      url: GetPropertiesReq_URL,
    })
      .then((data) => {
        console.log(data.data[0].data)
        setDataPropertiesReq(data.data[0].data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <div>
      <Card>
        <Card.Header>
          <Button className="primary" onClick={() => setModalShow(true)}>
            Add Properties Request
          </Button>
        </Card.Header>
        <Card.Body>
          <DataGrid
            ref={(ref) => (dataGrid = ref)}
            dataSource={dataPropertiesReqs}
            // defaultColumns={columns}
            showRowLines={true}
            showBorders={true}
          >
            <Column dataField="project_name" caption="Project Name" />
            <Column dataField="req_name" caption="request Name" />
            <Column dataField="staff" caption="Staff Name" />
            <Column dataField="properties_name" caption="Item Name" />
            <Column dataField="req_date" caption="Request Date" />
            <Column dataField="request_status" caption="Request status" />
            <Column
              dataField="properties_req_id"
              caption="Actions"
              allowFiltering={false}
              cellRender={(e) => (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button variant="success" className="mx-1">
                    <Icon.Check2 />
                  </Button>
                  <Button variant="warning" className="mx-1">
                    <Icon.Pencil />
                  </Button>
                  <Button variant="danger" className="mx-1">
                    <Icon.Trash />
                  </Button>
                </div>
              )}
            />
            <ColumnChooser enabled={true} />
            <Selection mode="multiple" />
            <Export enabled={true} fileName="Request" allowExportSelectedData={true} />
            <Paging defaultPageSize={5} />
            <FilterRow visible={state.showFilterRow} applyFilter={state.currentFilter} />
            <HeaderFilter visible={state.showHeaderFilter} />
            <Selection mode="single" />
            <SearchPanel visible={true} width={240} placeholder="Search..." />
            <Summary>
              <TotalItem column="id_no" summaryType="count" />
            </Summary>
          </DataGrid>
        </Card.Body>
      </Card>
      <CustomModal show={modalShow} onHide={() => setModalShow(false)}></CustomModal>
    </div>
  )
}

CustomModal.defaultProps = {
  title: 'Add Properties Request',
}
CustomModal.propTypes = {
  onHide: PropTypes.func,
}

export default PropertiesRequest

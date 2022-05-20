import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Button, Card, Modal, Form, Row, Col } from 'react-bootstrap'
import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import ExcelJS from 'exceljs'
import { exportDataGrid } from 'devextreme/excel_exporter'
import saveAs from 'file-saver'
import * as Icon from 'react-bootstrap-icons'
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
import Notify from '../../Helper/Notify'

const GetPropertiesStatus_URL = 'api/get_properties_status'
const GetAddres_URL = '/api/get_address'
const AddProperties_URL = '/api/add_properties'
const GetProperties_URL = '/api/get_properties'
function CustomModal(props) {
  const [propStatusOption, setPropStatusOption] = useState([])

  const userRef = useRef()

  React.useEffect(() => {}, [])
  const { register, errors, handleSubmit, watch, reset } = useForm({
    mode: 'onChange',
  })

  const [errMsg, setErrMsg] = useState('')
  const [success, setSuccess] = useState(false)

  const submitPropertiesData = (data) => {
    try {
      var body = {
        properties_name: data.properties_name,
        serial_number: data.serial_number,
        quantity: data.quantity,
        properties_status: parseInt(data.properties_status),
      }
      console.log(body)
      axios
        .post(AddProperties_URL, body, {
          headers: { 'content-Type': 'application/json' },
        })
        .then((data) => {
          reset()
          Notify.notifySuccess('Item was added Succefully')
          console.log(data)
        })

      setSuccess(true)
    } catch (e) {}
  }

  const Getproperties = () => {
    axios({
      method: 'GET',
      url: GetProperties_URL,
    })
      .then((data) => {
        console.log(data.data[0].data)
        setPropStatusOption(data.data[0].data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // useEffect(() => {
  //   Getproperties()
  // }, [])

  useEffect(() => {
    axios({
      method: 'GET',
      url: GetPropertiesStatus_URL,
    })
      .then((data) => {
        console.log(data.data[0].data)
        setPropStatusOption(data.data[0].data)
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
        <Form onSubmit={handleSubmit(submitPropertiesData)}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Propertiy Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Propertiy Name"
                  name="properties_name"
                  {...register('properties_name')}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              {' '}
              <Form.Label>Property Status</Form.Label>
              <Form.Select aria-label="Default select" {...register('properties_status')}>
                <option value="">Choose Status </option>
                {propStatusOption.length > 0 &&
                  propStatusOption.map((properties_status) => (
                    <option
                      key={properties_status.properties_status_id}
                      value={properties_status.properties_status_id}
                    >
                      {properties_status.properties_status_name}
                    </option>
                  ))}
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Quantity"
                  name="quantity"
                  {...register('quantity')}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Serial Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Quantity"
                  name="serial_number"
                  {...register('serial_number')}
                />
              </Form.Group>
            </Col>
          </Row>
          <Col md={12} className="mt-2">
            <Button onClick={props.onHide}>Close</Button>
            <Button onclassName="float-end" type="submit">
              {props.title}
            </Button>
          </Col>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

const PropertiesManagement = () => {
  const [modalShow, setModalShow] = React.useState(false)
  const [data, setData] = useState([])
  const [dataProperties, setDataProperties] = useState([])

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
      url: GetProperties_URL,
    })
      .then((data) => {
        console.log(data.data[0].data)
        setDataProperties(data.data[0].data)
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
            Add Properties
          </Button>
        </Card.Header>
        <Card.Body>
          <DataGrid
            ref={(ref) => (dataGrid = ref)}
            dataSource={dataProperties}
            showBorders={true}
            showRowLines={true}
            allowColumnResizing={true}
            allowColumnReordering={true}
            rowAlternationEnabled={true}
            columnResizingMode="nextColumn"
            columnAutoWidth={true}
          >
            <Column dataField="properties_name" caption="Item Name" />
            <Column dataField="quantity" caption="Quantity Status" />
            <Column dataField="properties_status_name" caption="Item current Condition" />
            <Column dataField="quantity" caption="Available" />
            <Column
              dataField="properties_id"
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
            <Export enabled={true} fileName="Properties" allowExportSelectedData={true} />
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
  title: 'Add Properties',
}
CustomModal.propTypes = {
  onHide: PropTypes.func,
}

export default PropertiesManagement

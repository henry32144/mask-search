import React, { Component, useRef, useState} from 'react';
import { CSSTransition } from 'react-transition-group';
import logo from './logo.svg';
import './App.css';
import '../node_modules/leaflet/dist/leaflet.css'

// Json datas
import countyLatLng from '../temp_data/county_latlng.json';
import geoJsonData from '../temp_data/twCounty2010merge.geo.json';

import countyRemaining from '../temp_data/county_remaining.json';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Popover from 'react-bootstrap/Popover';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import FormControl from 'react-bootstrap/FormControl';
import Overlay from 'react-bootstrap/Overlay';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Collapse from 'react-bootstrap/Collapse'
import Accordion from 'react-bootstrap/Accordion';
import Papa from 'papaparse';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import {FaGithub, FaLinkedin, FaBars, FaInfoCircle, FaLocationArrow, FaAngleDoubleDown, FaAngleDoubleUp} from 'react-icons/fa';
import {Typeahead} from 'react-bootstrap-typeahead';
import L from 'leaflet';

function GeoLocationErrorModal(props) {
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          取得座標時發生錯誤
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          {props.errorText}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

class TopNavBar extends Component {
  render() {
    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#home">口罩地圖</Navbar.Brand>
          <Nav className="ml-auto top-nav-items">
            <Nav.Link href="#info"><FaInfoCircle size={this.props.iconSize}/></Nav.Link> 
            <Nav.Link href="#github"><FaGithub size={this.props.iconSize}/></Nav.Link>
            <Nav.Link href="#linkedin"><FaLinkedin size={this.props.iconSize}/></Nav.Link>
          </Nav>
      </Navbar>
    )
  }
}

class LocateButton extends React.Component {
  render() {
    return (
      <Button variant="light" className="side-navbar-locate-button border-left-0" type="button" onClick={this.props.onClick}>
        <FaLocationArrow size={this.props.iconSize - 2}/>
      </Button>
    )
  }
}

function ToogleSideBarButton(props) {
  const decoratedOnClick = useAccordionToggle(
    props.eventKey
  );
  return (
    <Button variant="light" className="side-navbar-expand-button" type="button" onClick={decoratedOnClick}>
      <FaBars size={props.iconSize}/> {props.children}
    </Button>
  );
}

function ExpandSideBarButton(props) {
  const decoratedOnClick = useAccordionToggle(
    props.eventKey, 
    () => props.onAccordianToogle()
  );
  return (
    <Button variant="light" className="side-navbar-expand-button" type="button" onClick={decoratedOnClick}>
      {props.isAccordianOpen ? <FaAngleDoubleUp size={props.iconSize}/> : <FaAngleDoubleDown size={props.iconSize}/>} {props.children}
    </Button>
  );
}

function CustomTypeahead(props) {
  const decoratedOnClick = useAccordionToggle(
    props.eventKey,
    () => props.onAccordianToogle()
  );
  return (
      <Typeahead
        id="id"
        labelKey="label"
        options={props.options}
        placeholder="以店名或縣市來搜尋"
        className="border-right-0"
        onChange={(selected) => {
          if (selected != null && selected.length > 0) {
            props.onSearchSelected(selected);
            if (props.isAccordianOpen === false) {
              decoratedOnClick();
            }
          }
        }}
        selected={props.selected}
      />
  );
}

function ListItemPopOver(props) {
  return (
    <Popover id="list-item-popover">
      <Popover.Title as="h3">Popover right</Popover.Title>
      <Popover.Content>
        And here's some <strong>amazing</strong> content. It's very engaging.
        right?
      </Popover.Content>
    </Popover>
  );
}

function SideMenu(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <ListGroup.Item action key={number.toString()}>
      {number} <br/> {"Iaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}
    </ListGroup.Item>
  );
  return (
    <ListGroup className="side-navbar-menu-content">
      {listItems}
    </ListGroup>
  )
}

class SideNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBarExpand: true,
      selected: null,
      isAccordianOpen: false
    };
    this.toogleBarExpand = this.toogleBarExpand.bind(this);
    this.onSearchSelected = this.onSearchSelected.bind(this);
    this.toogleAccordian = this.toogleAccordian.bind(this);
  }

  toogleBarExpand() {
    this.setState(state => ({
      isBarExpand: !state.isBarExpand
    }));
  }

  onSearchSelected(selected) {
    if (selected != null && selected.length > 0) {
      this.setState({selected: selected}, () => {
        console.log(selected[0]);
      });
    }
  }

  toogleAccordian() {
    this.setState(state => ({
      isAccordianOpen: !state.isAccordianOpen
    }));
  }

  render() {
    const numbers = [];
    var options = [
      {id: 1, label: '台北市'},
      {id: 2, label: '台南市'},
      {id: 3, label: '台中市'},
      {id: 4, label: '桃園市'},
    ];
    return (
      <div className="side-navbar">
      <CSSTransition
        in={this.state.isBarExpand}
        timeout={{
          enter: 500,
          exit: 300,
        }}
        classNames="side-navbar-transition"
      >
      <div className="side-navbar-content">
        <Accordion>
          <Form className="py-3 d-flex justify-content-center">
            <InputGroup>
              <CustomTypeahead 
                eventKey="0"
                options={options} 
                selected={this.state.selected}
                onSearchSelected={this.onSearchSelected}
                isAccordianOpen={this.state.isAccordianOpen}
                onAccordianToogle={this.toogleAccordian} />
              <InputGroup.Append>
                <LocateButton iconSize={this.props.iconSize} onClick={this.props.getLocation}/>
              </InputGroup.Append>
            </InputGroup>
            <ExpandSideBarButton 
              eventKey="0" 
              iconSize={this.props.iconSize} 
              onAccordianToogle={this.toogleAccordian}
              isAccordianOpen={this.state.isAccordianOpen}
              />
          </Form>
          <Accordion.Collapse eventKey="0">
            <div className="side-navbar-menu">
              <p>衛生局資料最後更新時間: {new Date().toLocaleTimeString()}</p>
              <SideMenu numbers={numbers}/>
            </div>
          </Accordion.Collapse>
        </Accordion>
      </div>
      </CSSTransition>
      <Button 
        className="side-navbar-toogle-button"
        onClick={this.toogleBarExpand}
      />
      </div>
    )
  }
}

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.getColor = this.getColor.bind(this);
    this.drawStyle = this.drawStyle.bind(this);
  }

  getColor(d) {
    return d > 20000 ? '#1a9641' :
           d > 15000  ? '#a6d96a' :
           d > 10000  ? '#ffffbf' :
           d > 5000  ? '#fdae61' :
                      '#d7191c';
  }

  drawStyle(feature) {
    var countyName = feature.properties.COUNTYNAME.substring(0, 2);
    var data = countyRemaining[countyName]["adult_mask"];
    return {
        fillColor: this.getColor(data),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
  }

  componentDidMount() {
    console.log(countyLatLng);
    // create map
    this.map = L.map('map', {
      center: [this.props.userLatitude, this.props.userLongitude],
      zoom: 8,
      zoomControl: false,
      tap: true,
      dragging: true,
      layers: [
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }),
      ],
    });
    L.geoJSON(geoJsonData, {style: this.drawStyle}).addTo(this.map)
  }

  render() {
    return <div id="map"></div>
  }
}

class MainContents extends Component {
  render() {
    return (
      <div>
        <SideNavBar 
          iconSize={this.props.iconSize}
          getLocation={this.props.getLocation}
        />
        <Map
          userLatitude={this.props.userLatitude}
          userLongitude={this.props.userLongitude}
        />
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iconSize : 20,
      modalShow : false,
      userLatitude : 23.583234,
      userLongitude : 120.5825975,
      geoLocationErrorText : '您的瀏覽器不支援座標取得功能',
    };
    this.handleModalShow = this.handleModalShow.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.handleLocationError = this.handleLocationError.bind(this);
  }

  handleModalShow(show) {
    this.setState({modalShow: show});
  }

  handleLocationError(browserHasGeolocation) {
    this.setState({
      geoLocationErrorText: browserHasGeolocation ?
      '取得座標時發生錯誤. 將顯示預設的地點' :
      '您的瀏覽器不支援座標取得功能'
    },
    () => {
      this.handleModalShow(true);
    });
  }

  getLocation() {
    Papa.parse("http://127.0.0.1:5000/get-file", {
      download: true,
      worker: true,
      step: function(row) {
        console.log("Row:", row.data);
      },
      complete: function() {
        console.log("All done!");
      }
    });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.setState({
          userLatitude : pos.lat,
          userLongitude : pos.lng
        });
      }, () => {
        this.handleLocationError(true);
      });
    } else {
      // Browser doesn't support Geolocation
      this.handleLocationError(false);
    }
  }

  render() {
    return (
      <div className="app">
        <div className="top-navbar">
          <TopNavBar iconSize={this.state.iconSize}/>
        </div>
        <div className="main-contents">
          <MainContents 
            iconSize={this.state.iconSize} 
            getLocation={this.getLocation}
            userLatitude={this.state.userLatitude}
            userLongitude={this.state.userLongitude} 
          />
        </div>
        <GeoLocationErrorModal
          show={this.state.modalShow}
          errorText={this.state.geoLocationErrorText}
          onHide={() => {this.handleModalShow(false)}}
        />
      </div>
    );
  }
}

export default App;

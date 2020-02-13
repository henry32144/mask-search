import React, { Component, useRef, useState} from 'react';
import ReactDOMServer from "react-dom/server";

import { motion } from "framer-motion"
import logo from './logo.svg';
import './App.css';
import '../node_modules/leaflet/dist/leaflet.css'

// Json data
import countyLatLng from '../data/county_latlng.json';
import geoJsonData from '../data/twCounty2010merge.geo.json';
import countyRemaining from '../data/county_remaining.json';

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
import Table from 'react-bootstrap/Table';
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
          {props.geoErrorText}
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
        <Button variant="outline-dark" variant="dark" type="button" className="side-navbar-toogle-button" onClick={this.props.toggleSideBarExpand}>
          <FaBars size={this.props.iconSize}/>
        </Button>
        <Navbar.Brand href="#home" className="topnav-brand">口罩地圖</Navbar.Brand>
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
      selected: null,
      isAccordianOpen: false
    };
    this.onSearchSelected = this.onSearchSelected.bind(this);
    this.toogleAccordian = this.toogleAccordian.bind(this);
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
      <motion.div
        className="side-navbar"
        animate={this.props.isSideBarExpand ? "open" : "closed"}
        variants={{
          open: { opacity: 1, x: 0 },
          closed: { opacity: 0.5, x: "-100%" },
        }}
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
      </motion.div>
    )
  }
}

function CountyMaskPopup(props) {
  return (
    <Table striped bordered responsive size="sm" className="county-mask-popup">
      <caption>{props.countyName}</caption>
      <tr>
        <th>成人口罩剩餘</th>
        <th>兒童口罩剩餘</th>
      </tr>
      <tr>
        <td>{props.adultMask}</td>
        <td>{props.childMask}</td>
      </tr>
    </Table>
  )
}

function CountyMaskLegend(props) {
  var valueDegrees = props.valueDegrees;

  var legendItems = []
  for (var i = 0; i < valueDegrees.length; i++) {
    legendItems.push(
      <div key={"legend-" + i}>
        <i style={{background: props.getColor(valueDegrees[i] + 1)}}></i>
        {valueDegrees[i] + (valueDegrees[i + 1] ? '&ndash;' + valueDegrees[i + 1] + '<br/>' : '+')}
      </div>
    );
  }

  return (
    <div className="legend info">
      {legendItems}
    </div>
  )
}

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.colors = ['#d7191c', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641'];
    this.valueDegrees = [0, 5000, 10000, 15000, 20000]
    this.getColor = this.getColor.bind(this);
    this.drawStyle = this.drawStyle.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this.setCountiesLegend = this.setCountiesLegend.bind(this);
  }

  getColor(d) {
    return d > this.valueDegrees[4] ? this.colors[4] :
           d > this.valueDegrees[3]  ? this.colors[3] :
           d > this.valueDegrees[2]  ? this.colors[2] :
           d > this.valueDegrees[1]  ? this.colors[1] :
           this.colors[0];
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

  showPopup(layer) {
    var countyName = layer.feature.properties.COUNTYNAME.substring(0, 2);
    var data = countyRemaining[countyName]["adult_mask"];
    return (ReactDOMServer.renderToString(
      <CountyMaskPopup
        countyName={layer.feature.properties.COUNTYNAME}
        adultMask={data}
        childMask={data}
      />
    ))
  }

  setCountiesLegend(map) {
    return (ReactDOMServer.renderToString(
      <CountyMaskLegend
        valueDegrees={this.valueDegrees}
        getColor={this.getColor}
      />
    ))
  }

  componentDidMount() {
    // create map
    var map = L.map('map', {
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

    var geoJsonLayer = L.geoJSON(geoJsonData, {style: this.drawStyle})
    geoJsonLayer.bindPopup(this.showPopup);
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = (map) => {
        var div = L.DomUtil.create('div', 'info legend');
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < this.valueDegrees.length; i++) {
            div.innerHTML +=
                '<i style="background:' + this.getColor(this.valueDegrees[i] + 1) + '"></i> ' +
                this.valueDegrees[i] + (this.valueDegrees[i + 1] ? '&ndash;' + this.valueDegrees[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(map);

    var overlayLayers = L.layerGroup([geoJsonLayer]);
    overlayLayers.addTo(map);

    var overlayMaps = {
      "縣市剩餘數量": overlayLayers,
    };

    var mapControlPanel = L.control.layers(null, overlayMaps)
    mapControlPanel.addTo(map);

    map.on('overlayadd', function (eventLayer) {
      // Switch to the Population legend...
      if (eventLayer.name === '縣市剩餘數量') {
        legend.addTo(this);
      } 
    });
    map.on('overlayremove', function (eventLayer) {
      // Switch to the Population legend...
      if (eventLayer.name === '縣市剩餘數量') {
          this.removeControl(legend);
      } 
    });

    this.setState({
      map: map,
      geoJsonLayer: geoJsonLayer
    })
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
          isSideBarExpand={this.props.isSideBarExpand}
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
      isSideBarExpand: true,
      userLatitude : 23.583234,
      userLongitude : 120.5825975,
      geoLocationErrorText : '您的瀏覽器不支援座標取得功能',
    };
    this.toggleSideBarExpand = this.toggleSideBarExpand.bind(this);
    this.handleModalShow = this.handleModalShow.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.handleLocationError = this.handleLocationError.bind(this);
  }

  toggleSideBarExpand() {
    this.setState(state => ({
      isSideBarExpand: !state.isSideBarExpand
    }));
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
          <TopNavBar 
            iconSize={this.state.iconSize}
            toggleSideBarExpand={this.toggleSideBarExpand}
          />
        </div>
        <div className="main-contents">
          <MainContents 
            iconSize={this.state.iconSize} 
            getLocation={this.getLocation}
            userLatitude={this.state.userLatitude}
            userLongitude={this.state.userLongitude}
            isSideBarExpand={this.state.isSideBarExpand} 
          />
        </div>
        <GeoLocationErrorModal
          show={this.state.modalShow}
          geoErrorText={this.state.geoLocationErrorText}
          onHide={() => {this.handleModalShow(false)}}
        />
      </div>
    );
  }
}

export default App;

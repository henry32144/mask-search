
import React, { Component, useRef, useState} from 'react';
import ReactDOMServer from "react-dom/server";

import { motion } from "framer-motion"

import '../css/App.css';
import '../../node_modules/leaflet/dist/leaflet.css'
import '../../node_modules/rc-pagination/assets/index.css';
// Json data
import geoJsonData from '../../data/twCounty2010merge.geo.json';
import tempResult from '../../data/temp_result.json';
import countyRemaining from '../../data/county_remaining.json';

import Pagination from 'rc-pagination';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Popover from 'react-bootstrap/Popover';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import FormControl from 'react-bootstrap/FormControl';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import {FaGithub, FaLinkedin, FaBars, FaInfoCircle, FaLocationArrow, FaAngleDoubleDown, FaAngleDoubleUp, FaSearch, } from 'react-icons/fa';
import {Typeahead} from 'react-bootstrap-typeahead';
import L from 'leaflet';
import '../css/fontawesome.min.css';
import '../css/solid.min.css';
import '../../node_modules/leaflet.awesome-markers/dist/leaflet.awesome-markers.css'
import '../../node_modules/leaflet.awesome-markers/dist/leaflet.awesome-markers.min.js'

function ErrorModal(props) {
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.modalerrortitle}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          {props.modalerrortext}
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
        <Button variant="dark" type="button" className="side-navbar-toogle-button" onClick={this.props.toggleSideBarExpand}>
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

class SearchButton extends React.Component {
  render() {
    return (
      <Button variant="light" className="side-navbar-locate-button" type="button" onClick={this.props.onClick}>
        <FaSearch size={this.props.iconSize - 2}/>
      </Button>
    )
  }
}

function ExpandSideBarButton(props) {
  const decoratedOnClick = useAccordionToggle(
    props.eventKey, 
    () => props.toogleAccordian()
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
    () => props.toogleAccordian()
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

// function SideMenu(props) {
//   const numbers = props.numbers;
//   const listItems = numbers.map((number) =>
//     <ListGroup.Item action key={number.toString()}>
//       <p class="font-weight-bold">
//         {number}
//         <br/>
//         <span class="font-weight-light">
//         {"地址"}
//         <br/>
//         成人口罩剩餘: {1000}<br/>兒童口罩剩餘: {100}
//         </span>
//       </p>
//       <a href={"http://maps.google.com.tw/maps?q=" + "地址"}>在Google map開啟</a>
//     </ListGroup.Item>
//   );
//   return (
//     <div>
//       <ListGroup className="side-navbar-menu-content">
//         {listItems}
//       </ListGroup>
//       <div>
//         <Pagination className="side-navbar-menu-pagination">
//           <Pagination.First />
//           <Pagination.Prev />
//           <Pagination.Item>{11}</Pagination.Item>
//           <Pagination.Item active>{12}</Pagination.Item>
//           <Pagination.Item>{13}</Pagination.Item>
//           <Pagination.Next />
//           <Pagination.Last />
//       </Pagination>
//       </div>
//     </div>
//   )
// }

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 20,
      currentPage: 1,
    }

    this.pageOnChange = this.pageOnChange.bind(this);
  }

  pageOnChange(page) {
    console.log(page);
    this.setState({
      currentPage: page,
    });
  }

  listItemOnClick = param => e => {
    // param is the argument you passed to the function
    // e is the event object that returned
  };


  render() {
    var items = this.props.locationData;
    var indexStart = (this.state.currentPage - 1) * this.state.pageSize
    var indexEnd = indexStart + this.state.pageSize
    var listItems = null;
    if (items.length > 0) {
      listItems = items.slice(indexStart, indexEnd).map((item) => 
        <ListGroup.Item action key={item["code"]} onClick={this.listItemOnClick(item["code"])}>
          <p className="font-weight-bold">
            {item["name"]}
            <br/>
            <span className="font-weight-light">
            {item["location"]}
            <br/>
            成人口罩剩餘: {item["adult_remaining"]}<br/>兒童口罩剩餘: {item["child_remaining"]}
            </span>
          </p>
          <a href={"http://maps.google.com.tw/maps?q=" + item["name"] + " " + item["location"]} 
            target="_blank" rel="noopener noreferrer">用Google map開啟</a>
        </ListGroup.Item>
      );
    } else {
      listItems = null
    }
    return (
      <div>
        <ListGroup className="side-navbar-menu-content">
          {listItems}
        </ListGroup>
        <Pagination 
          className="side-navbar-menu-pagination"
          onChange={this.pageOnChange} 
          current={this.state.currentPage} 
          total={items.length}
          pageSize={this.state.pageSize}
        />
      </div>
    )
  }
}


class SideNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      isAccordianOpen: false
    };
    this.textInput = React.createRef();
    this.onSearchSelected = this.onSearchSelected.bind(this);
    this.toogleAccordian = this.toogleAccordian.bind(this);
    this.onSearchButtonClicked = this.onSearchButtonClicked.bind(this);
    this.filterText = this.filterText.bind(this);
    this.textConvert = this.textConvert.bind(this);
  }

  filterText(s) { 
    var pattern = new RegExp("[`\\\\~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？]") 
    var rs = ""; 
    for (var i = 0; i < s.length; i++) { 
        rs = rs + s.substr(i, 1).replace(pattern, ''); 
    } 
    return rs;  
  }

  textConvert(s) { 
    var s = s.replace("台", "臺");
    return s;  
  }

  onSearchSelected(selected) {
    if (selected != null && selected.length > 0) {
      this.setState({selected: selected}, () => {
        console.log(selected[0]);
      });
    }
  }

  onSearchButtonClicked() {
    var value = this.textInput.current.value;
    if (value.length > 0) {
      value = this.filterText(value);
      if (value.length > 0) {
        value = this.textConvert(value);
        this.props.setLoading(true);
        this.props.queryLocation(value).then(() => {
            this.toogleAccordian();
          }
        );
      } else {
        this.props.handleError("Sorry~ 不能搜尋特殊符號")
      }
    } else {
      this.props.handleError("搜尋欄不能是空的喔")
    }
  }

  toogleAccordian() {
    this.setState(state => ({
      isAccordianOpen: !state.isAccordianOpen
    }));
  }

  render() {
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
              {/* <CustomTypeahead 
                eventKey="0"
                options={options} 
                selected={this.state.selected}
                onSearchSelected={this.onSearchSelected}
                isAccordianOpen={this.state.isAccordianOpen}
                toogleAccordian={this.toogleAccordian} /> */}
              <FormControl 
                type="text" 
                ref={this.textInput}
                placeholder="以店名或縣市來搜尋"/>
              <InputGroup.Append>
                {
                  /* TODO:
                  <LocateButton iconSize={this.props.iconSize} onClick={this.props.getLocation}/> 
                  */
                }
                <SearchButton 
                  eventKey="0"
                  iconSize={this.props.iconSize} 
                  onClick={this.onSearchButtonClicked}
                  />
              </InputGroup.Append>
            </InputGroup>
            <ExpandSideBarButton 
              eventKey="0" 
              iconSize={this.props.iconSize} 
              toogleAccordian={this.toogleAccordian}
              isAccordianOpen={this.state.isAccordianOpen}
              />
          </Form>
          <Accordion.Collapse eventKey="0">
            <div className="side-navbar-menu">
              <p>伺服器資料最後更新時間: {new Date().toLocaleTimeString()}</p>
              <SideMenu 
                eventKey="0"
                locationData={this.props.locationData}
                toogleAccordian={this.toogleAccordian}
              />
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
    this.state = {
      markerStyle: L.AwesomeMarkers.icon({
        prefix: 'fa',
        icon: 'circle',
        markerColor: 'red'
      }), 
      overlayMaps: {},
    }
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
    var data = -1
    if (this.props.countyRemaining != null) {
      data = this.props.countyRemaining[countyName]["adult_remaining"] + 
                  this.props.countyRemaining[countyName]["child_remaining"];
    }
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
    var adultData = -1;
    var childData = -1;
    if (this.props.countyRemaining != null) {
      adultData = this.props.countyRemaining[countyName]["adult_remaining"];
      childData = this.props.countyRemaining[countyName]["child_remaining"];
    }
    return (ReactDOMServer.renderToString(
      <CountyMaskPopup
        countyName={layer.feature.properties.COUNTYNAME}
        adultMask={adultData}
        childMask={childData}
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
        L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        }),
      ],
    });

    this.setState({
      map: map
    }, () => {
        // Get county remaining
      this.props.getCountyRemaining()
      .then(() => {
        var geoJsonLayer = L.geoJSON(geoJsonData, {style: this.drawStyle})
        geoJsonLayer.bindPopup(this.showPopup);
        var overlayLayers = L.layerGroup([geoJsonLayer]);
        overlayLayers.addTo(this.state.map);

        this.setState({
          overlayMaps: {
            "縣市剩餘數量": overlayLayers,
          }
        }, () => {
          var mapControlPanel = L.control.layers(null, this.state.overlayMaps)
          mapControlPanel.addTo(this.state.map);
          this.props.setLoading(false)
        });
      })
      .catch(reason => console.log(reason.message))
      }
    )

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

    L.marker([this.props.userLatitude, this.props.userLongitude],
       {icon: this.state.markerStyle}).addTo(map);
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
          locationData={this.props.locationData}
          setLoading={this.props.setLoading}
          queryLocation={this.props.queryLocation}
          handleError={this.props.handleError}
        />
        <Map
          userLatitude={this.props.userLatitude}
          userLongitude={this.props.userLongitude}
          setLoading={this.props.setLoading}
          locationData={this.props.locationData}
          countyRemaining={this.props.countyRemaining}
          getCountyRemaining={this.props.getCountyRemaining}
        />
      </div>
    )
  }
}

function MainLoadingIndicator(props) {
  if (!props.isLoading) {
    return null;
  }

  return (
      <Spinner className="big-loading-indicator" animation="border" role="status" variant="secondary">
        <span className="sr-only">Loading...</span>
      </Spinner>
  )
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iconSize : 20,
      modalShow : false,
      isLoading : true,
      isSideBarExpand: true,
      userLatitude : 23.583234,
      userLongitude : 120.5825975,
      modalErrorTitle : '喔~發生錯誤',
      modalErrorText : '',
      locationData: [],
      countyRemaining: null,
    };
    this.toggleSideBarExpand = this.toggleSideBarExpand.bind(this);
    this.handleModalShow = this.handleModalShow.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.handleError = this.handleError.bind(this);
    this.setLoading = this.setLoading.bind(this);
    this.queryLocation = this.queryLocation.bind(this);
    this.getCountyRemaining = this.getCountyRemaining.bind(this);
    this.handleListItemClick = this.handleListItemClick.bind(this);
  }

  toggleSideBarExpand() {
    this.setState(state => ({
      isSideBarExpand: !state.isSideBarExpand
    }));
  }

  handleModalShow(show) {
    this.setState({modalShow: show});
  }

  setLoading(value) {
    this.setState({isLoading: value});
  }

  handleError(errorText) {
    this.setState({
      modalErrorText: errorText
    },
    () => {
      this.handleModalShow(true);
    });
  }

  getLocation() {
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
        var errorText = '取得座標時發生錯誤. 將顯示預設的地點';
        this.handleError(errorText);
      });
    } else {
      // Browser doesn't support Geolocation
      var errorText = '您的瀏覽器不支援座標取得功能';
      this.handleError(errorText);
    }
  }

  async getCountyRemaining() {
    try {
      const response = await fetch("http://127.0.0.1:5000/get-all/county-remaining", {method:'GET'})
      if (response.ok) {
        const countyRemaining = await response.json();
        console.log(countyRemaining)
        this.setState({
          countyRemaining: countyRemaining
        })
      }
    }
    catch (err) {
      console.log('fetch failed', err);
    }
  }

  async queryLocation(words) {
    console.log('queryLocation')
    this.setState({
      locationData: tempResult["results"]
    }, () => {
      this.setLoading(false);
    })
    // try {
    //   const response = await fetch("http://127.0.0.1:5000/get/" + words, {method:'GET'})
    //   if (response.ok) {
    //     const locationData = await response.json();
    //     console.log(locationData)
    //     this.setState({
    //       locationData: locationData["results"]
    //     }, () => {
    //       this.setLoading(false);
    //     })
    //   }
    // }
    // catch (err) {
    //   console.log('fetch failed', err);
    // }
  }

  handleListItemClick() {

  }

  render() {
    return (
      <div className="app">
        <MainLoadingIndicator 
          isLoading={this.state.isLoading}
        />
        <div className="top-navbar">
          <TopNavBar
            iconSize={this.state.iconSize}
            toggleSideBarExpand={this.toggleSideBarExpand}
          />
        </div>
        <div className="main-contents">
          <MainContents 
            setLoading={this.setLoading}
            getLocation={this.getLocation}
            queryLocation={this.queryLocation}
            iconSize={this.state.iconSize}
            userLatitude={this.state.userLatitude}
            userLongitude={this.state.userLongitude}
            isSideBarExpand={this.state.isSideBarExpand} 
            locationData={this.state.locationData}
            countyRemaining={this.state.countyRemaining}
            getCountyRemaining={this.getCountyRemaining}
            handleError={this.handleError}
          />
        </div>
        <ErrorModal
          show={this.state.modalShow}
          modalerrortext={this.state.modalErrorText}
          modalerrortitle={this.state.modalErrorTitle}
          onHide={() => {this.handleModalShow(false)}}
        />
      </div>
    );
  }
}

export default App;

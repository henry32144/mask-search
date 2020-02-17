
import React, { Component } from 'react';
import ReactDOMServer from "react-dom/server";

import { motion, AnimatePresence } from "framer-motion"

import '../css/App.css';
import '../../node_modules/leaflet/dist/leaflet.css'
import '../../node_modules/rc-pagination/assets/index.css';
// Json data
import geoJsonData from '../../data/twCounty2010merge.geo.json';
//import { Map, TileLayer, Marker, Popup, GeoJSON, LayersControl } from 'react-leaflet'

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

function InfoModal(props) {
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          關於
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          資料每半個小時更新一次，
          資料來源為<a target="_blank" rel="noopener noreferrer" href="http://data.nhi.gov.tw/Datasets/Download.ashx?rid=A21030000I-D50001-001&l=https://data.nhi.gov.tw/resource/mask/maskdata.csv">政府提供的口罩資料</a>。
        </p>
        <p>
          由於在下2/19就要入伍服義務役了，有些功能像是搜尋後在地圖上顯示圖標等等的來不及實作，請見諒。
          目前伺服器端和資料庫皆是使用免費的雲端平台，有時候可能會有不穩定的情形。
        </p>
          對於原始碼有興趣的訪客可以點網頁右上角的Github貓咪圖示。
        <br/>
        <p className="font-weight-bold">
          注意: 此網站的資料僅供參考。
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
    const setModalShow = () => {
      this.props.handleInfoModalShow(true)
    };
    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Button variant="dark" type="button" className="side-navbar-toogle-button" onClick={this.props.toggleSideBarExpand}>
          <FaBars size={this.props.iconSize}/>
        </Button>
        <Navbar.Brand className="topnav-brand">口罩地圖</Navbar.Brand>
          <Nav className="ml-auto top-nav-items">
            <Nav.Link href="" onClick={setModalShow}><FaInfoCircle size={this.props.iconSize}/></Nav.Link> 
            <Nav.Link href="https://github.com/henry32144/mask-search" target="_blank" rel="noopener noreferrer"><FaGithub size={this.props.iconSize}/></Nav.Link>
            <Nav.Link href="https://www.linkedin.com/in/cheng-han-wu-0803/?locale=en_US" target="_blank" rel="noopener noreferrer"><FaLinkedin size={this.props.iconSize}/></Nav.Link>
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
  return (
    <Button variant="light" className="side-navbar-expand-button" type="button" onClick={props.toogleAccordian}>
      {props.isAccordianOpen ? <FaAngleDoubleUp size={props.iconSize}/> : <FaAngleDoubleDown size={props.iconSize}/>} {props.children}
    </Button>
  );
}

function CustomTypeahead(props) {
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
              props.toogleAccordian();
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
      currentPage: this.props.currentPage,
      indexStart: 0,
      indexEnd: 0,
    }

    this.pageOnChange = this.pageOnChange.bind(this);
  }

  pageOnChange(page) {
    var indexStart = (page - 1) * this.state.pageSize;
    var indexEnd = indexStart + this.state.pageSize;
    this.props.setCurrentIndex(indexStart, indexEnd, page);
  }

  listItemOnClick = param => e => {
    // param is the argument you passed to the function
    // e is the event object that returned
    //this.props.toogleAccordian();
  };


  render() {
    var items = this.props.locationData;
    var indexStart = (this.props.currentPage - 1) * this.state.pageSize;
    var indexEnd = indexStart + this.state.pageSize;
    var listItems = items.slice(indexStart, indexEnd).map((item) => 
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
    return (
      <div>
        <ListGroup className="side-navbar-menu-content">
          {listItems}
        </ListGroup>
        <Pagination 
          className="side-navbar-menu-pagination"
          onChange={this.pageOnChange} 
          current={this.props.currentPage} 
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
            if (this.state.isAccordianOpen === false) {
              this.toogleAccordian();
            }
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
          <motion.header
            initial={false}
            onClick={this.toogleAccordian}
          />
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
                    iconSize={this.props.iconSize} 
                    onClick={this.onSearchButtonClicked}
                    />
                </InputGroup.Append>
              </InputGroup>
              <ExpandSideBarButton 
                iconSize={this.props.iconSize} 
                toogleAccordian={this.toogleAccordian}
                isAccordianOpen={this.state.isAccordianOpen}
                />
            </Form>
            <AnimatePresence initial={false}>
              {this.state.isAccordianOpen && (
              <motion.section
                  key="content"
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: {opacity: 1, height: "auto" },
                    collapsed: { opacity: 0, height: 0}
                  }}
                  transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98]}}
                >
                <div className="side-navbar-menu">
                  <p>伺服器資料最後更新時間: {new Date(this.props.lastUpdatedTime).toString()}</p>
                  <SideMenu 
                    locationData={this.props.locationData}
                    toogleAccordian={this.toogleAccordian}
                    setCurrentIndex={this.props.setCurrentIndex}
                    currentPage={this.props.currentPage}
                  />
                </div>
              </motion.section>
              )}
          </AnimatePresence>
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

function StorePopup(props) {
  return (
    <div>
      <p>{props.name}</p>
      <p>{props.location}</p>
      <Table striped bordered responsive size="sm" className="store-popup">
        <tr>
          <th>成人口罩剩餘</th>
          <th>兒童口罩剩餘</th>
        </tr>
        <tr>
          <td>{props.adultMask}</td>
          <td>{props.childMask}</td>
        </tr>
      </Table>
    </div>
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
      mapIsReady: false,
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
        var overlayMaps = {
          "縣市剩餘數量": overlayLayers
        };
        var mapControlPanel = L.control.layers(null, overlayMaps)
        mapControlPanel.addTo(this.state.map);
        this.setState({
          mapIsReady: true,
          mapControlPanel: mapControlPanel,
          overlayLayers: overlayLayers,
          overlayMaps: overlayMaps
        }, () => {
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
  }

  render() {
    return (<div id="map"></div>
    )
  }
}

// function getGeoJSONComponent(json) {
//   return(
//       <GeoJson
//           data={json}
//           color='red'
//           fillColor='green'
//           weight={1}
//           onEachFeature={onEachFeature} />
//   );
// }

// function onEachFeature(feature, layer) {
//   if (feature.properties && feature.properties.name) {
//       layer.bindPopup(feature.properties.name);
//   }
// }

// class MapContent extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       geoJSONLayerKey: "geojson",
//       dataIsReady: false,
//     }
//     this.colors = ['#d7191c', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641'];
//     this.valueDegrees = [0, 5000, 10000, 15000, 20000]
//     this.getColor = this.getColor.bind(this);
//     this.drawStyle = this.drawStyle.bind(this);
//     this.showPopup = this.showPopup.bind(this);
//     this.setCountiesLegend = this.setCountiesLegend.bind(this);
//   }

//   componentDidMount() {
//     this.props.getCountyRemaining().then(
//       this.setState({geoJSONLayerKey: "geojson-updated",
//       dataIsReady: true
//     })
//     )
//   }

//   getColor(d) {
//     return d > this.valueDegrees[4] ? this.colors[4] :
//            d > this.valueDegrees[3]  ? this.colors[3] :
//            d > this.valueDegrees[2]  ? this.colors[2] :
//            d > this.valueDegrees[1]  ? this.colors[1] :
//            this.colors[0];
//   }
  
//   drawStyle(feature) {
//     var countyName = feature.properties.COUNTYNAME.substring(0, 2);
//     var data = -1
//     if (this.props.countyRemaining != null) {
//       data = this.props.countyRemaining[countyName]["adult_remaining"] + 
//                   this.props.countyRemaining[countyName]["child_remaining"];
//     }
//     return {
//         fillColor: this.getColor(data),
//         weight: 2,
//         opacity: 1,
//         color: 'white',
//         dashArray: '3',
//         fillOpacity: 0.7
//     };
//   }

//   showPopup(layer) {
//     var countyName = layer.feature.properties.COUNTYNAME.substring(0, 2);
//     var adultData = -1;
//     var childData = -1;
//     if (this.props.countyRemaining != null) {
//       adultData = this.props.countyRemaining[countyName]["adult_remaining"];
//       childData = this.props.countyRemaining[countyName]["child_remaining"];
//     }
//     console.log(childData)
//     return (ReactDOMServer.renderToString(
//       <CountyMaskPopup
//         countyName={layer.feature.properties.COUNTYNAME}
//         adultMask={adultData}
//         childMask={childData}
//       />
//     ))
//   }

//   setCountiesLegend(map) {
//     return (ReactDOMServer.renderToString(
//       <CountyMaskLegend
//         valueDegrees={this.valueDegrees}
//         getColor={this.getColor}
//       />
//     ))
//   }

//   render() {
//     const position = [this.props.userLatitude, this.props.userLongitude]
//     return (
//         <Map 
//           className="map"
//           center= {position}
//           zoom={8}
//           zoomControl={false}
//           tap={true}
//           dragging={true}>
//         <TileLayer
//           attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
//           url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
//         />
//           <LayersControl position="topright">
            
//               {this.state.dataIsReady ? 
//                 <LayersControl.Overlay checked name="縣市剩餘數量">
//                   <GeoJSON 
//                     key={this.state.geoJSONLayerKey}
//                     data={geoJsonData}
//                     style={this.drawStyle}
//                     bindPopup={this.showPopup}
//                     onEachFeature={onEachFeature}
//                     >
//                   </GeoJSON>
//                 </LayersControl.Overlay>
//                : null
//               }
            
//           </LayersControl>
//       </Map>
//     )
//   }
//}


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
      errorModalShow : false,
      infoModalShow: false,
      isLoading : true,
      isSideBarExpand: true,
      userLatitude : 23.583234,
      userLongitude : 120.5825975,
      modalErrorTitle : '喔~發生錯誤',
      modalErrorText : '',
      locationData: [],
      markers: [],
      markerLayers: L.layerGroup(),
      countyRemaining: null,
      currentPage: 1,
      indexStart: 0,
      indexEnd: 19,
      lastUpdatedTime: "XX",
    };

    this.toggleSideBarExpand = this.toggleSideBarExpand.bind(this);
    this.handleErrorModalShow = this.handleErrorModalShow.bind(this);
    this.handleInfoModalShow = this.handleInfoModalShow.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.handleError = this.handleError.bind(this);
    this.setLoading = this.setLoading.bind(this);
    this.queryLocation = this.queryLocation.bind(this);
    this.getCountyRemaining = this.getCountyRemaining.bind(this);
    this.handleListItemClick = this.handleListItemClick.bind(this);
    this.setCurrentIndex = this.setCurrentIndex.bind(this);
  }

  toggleSideBarExpand() {
    this.setState(state => ({
      isSideBarExpand: !state.isSideBarExpand
    }));
  }

  handleErrorModalShow(show) {
    this.setState({errorModalShow: show});
  }

  handleInfoModalShow(show) {
    this.setState({infoModalShow: show});
  }

  setLoading(value) {
    this.setState({isLoading: value});
  }

  handleError(errorText) {
    this.setState({
      modalErrorText: errorText
    },
    () => {
      this.handleErrorModalShow(true);
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
      const response = await fetch("https://mask-search.herokuapp.com/get-all/county-remaining", {method:'GET'})
      if (response.ok) {
        const countyRemaining = await response.json();
        console.log(countyRemaining)
        const lastUpdatedTime = this.state.lastUpdatedTime;
        if (countyRemaining != null) {
          lastUpdatedTime = countyRemaining["臺北"]["updated_time"]
        }
        this.setState({
          countyRemaining: countyRemaining,
          lastUpdatedTime: lastUpdatedTime
        }, () => {
          return true
        })
      }
    }
    catch (err) {
      console.log('fetch failed', err);
    }
  }

  async queryLocation(words) {
    console.log('queryLocation')
    // this.setState({
    //   locationData: tempResult["results"]
    // }, () => {
    //   this.setLoading(false);
    // })
    try {
      const response = await fetch("https://mask-search.herokuapp.com/get/" + words, {method:'GET'})
      if (response.ok) {
        const locationData = await response.json();
        console.log(locationData);
        const lastUpdatedTime = this.state.lastUpdatedTime;
        if (locationData["results"].length > 0) {
          lastUpdatedTime = locationData["results"][0]["updated_time"];
        }
        this.setState({
          locationData: locationData["results"],
          lastUpdatedTime: lastUpdatedTime
        }, () => {
          this.setLoading(false);
        })
      }
    }
    catch (err) {
      console.log('fetch failed', err);
    }
  }

  handleListItemClick() {

  }

  showStorePopup(layer) {
    var countyName = layer.feature.properties.COUNTYNAME.substring(0, 2);
    var adultData = -1;
    var childData = -1;
    if (this.props.countyRemaining != null) {
      adultData = this.props.countyRemaining[countyName]["adult_remaining"];
      childData = this.props.countyRemaining[countyName]["child_remaining"];
    }
    return (ReactDOMServer.renderToString(
      <StorePopup
        countyName={layer.feature.properties.COUNTYNAME}
        adultMask={adultData}
        childMask={childData}
      />
    ))
  }

  setUpMarkers() {
    const markers = this.state.locationData.slice(this.state.indexStart, this.state.indexEnd).map((item) => 
        L.marker([item["latitude"], item["longitude"]],
        {icon: L.AwesomeMarkers.icon({
          prefix: 'fa',
          icon: 'circle',
          markerColor: 'red'
        })}).bindPopup(
          ReactDOMServer.renderToString(
            <StorePopup
              name={item["name"]}
              location={item["location"]}
              adultMask={item["adult_remaining"]}
              childMask={item["child_remaining"]}
            />
          )
        ));
    // for (var i = 0 ; i< markers.length; i++)  {
    //   this.state.markerLayers.addLayer(markers[i]);
    // }
    this.setState({
      markers: markers
    })
  }

  setCurrentIndex(indexStart, indexEnd, currentPage) {
    console.log(indexStart)
    console.log(indexEnd)
    // const markerLayers = this.state.markerLayers
    // markerLayers.clearLayers()
    const markers = this.state.locationData.slice(indexStart, indexEnd).map((item) => 
        L.marker([item["latitude"], item["longitude"]],
        {icon: L.AwesomeMarkers.icon({
          prefix: 'fa',
          icon: 'circle',
          markerColor: 'red'
        })}).bindPopup(
          ReactDOMServer.renderToString(
            <StorePopup
              name={item["name"]}
              location={item["location"]}
              adultMask={item["adult_remaining"]}
              childMask={item["child_remaining"]}
            />
          )
        ));
    this.setState({
      indexStart: indexStart,
      indexEnd: indexEnd,
      currentPage: currentPage,
      markers: markers,
    })
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
            handleInfoModalShow={this.handleInfoModalShow}
            toggleSideBarExpand={this.toggleSideBarExpand}
          />
        </div>
        <div className="main-contents">
          {/* <MainContents 
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
            setCurrentIndex={this.setCurrentIndex}
            currentPage={this.state.currentPage}
            indexStart={this.state.indexStart}
            indexEnd={this.state.indexEnd}
            markers={this.state.markers}
            markerLayers={this.state.markerLayers}
          /> */}
          <SideNavBar 
            iconSize={this.state.iconSize}
            getLocation={this.getLocation}
            isSideBarExpand={this.state.isSideBarExpand}
            locationData={this.state.locationData}
            setLoading={this.setLoading}
            queryLocation={this.queryLocation}
            handleError={this.handleError}
            setCurrentIndex={this.setCurrentIndex}
            currentPage={this.state.currentPage}
            lastUpdatedTime={this.state.lastUpdatedTime}
          />
          <Map
            userLatitude={this.state.userLatitude}
            userLongitude={this.state.userLongitude}
            setLoading={this.setLoading}
            locationData={this.state.locationData}
            countyRemaining={this.state.countyRemaining}
            getCountyRemaining={this.getCountyRemaining}
            indexStart={this.state.indexStart}
            indexEnd={this.state.indexEnd}
            markerLayers={this.state.markerLayers}
          />
        </div>
        <InfoModal
          show={this.state.infoModalShow}
          onHide={() => {this.handleInfoModalShow(false)}}/>
        <ErrorModal
          show={this.state.errorModalShow}
          modalerrortext={this.state.modalErrorText}
          modalerrortitle={this.state.modalErrorTitle}
          onHide={() => {this.handleErrorModalShow(false)}}
        />
      </div>
    );
  }
}

export default App;

import React, { Component, useRef, useState} from 'react';
import logo from './logo.svg';
import './App.css';

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
import FormControl from 'react-bootstrap/FormControl';
import Overlay from 'react-bootstrap/Overlay';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import {FaGithub, FaLinkedin, FaBars, FaInfoCircle} from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';
import {Typeahead} from 'react-bootstrap-typeahead';

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

class RefreshButton extends React.Component {
  render() {
    return (
      <Button variant="light" className="refresh-button border-left-0" type="button" onClick={this.props.onClick}>
        <MdRefresh size={this.props.iconSize}/>
      </Button>
    )
  }
}

// class ToggleButton extends React.Component {
//   render() {
//     return (
//       <Button variant="light" className="toogle-button border-0" type="button" onClick={this.props.onClick}>
//         <FaBars size={this.props.iconSize}/>
//       </Button>
//     )
//   }
// }

function ToggleButton(props) {
  const decoratedOnClick = useAccordionToggle(props.eventKey, () =>
    console.log('totally custom!'),
  );

  return (
    <Button variant="light" className="toogle-button border-0" type="button" onClick={decoratedOnClick}>
      <FaBars size={props.iconSize}/> {props.children}
    </Button>
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
    <ListGroup className="side-menu">
      {listItems}
    </ListGroup>
  )
}

class SideNavBar extends Component {
  constructor(props) {
    super(props);
    this.setBarExpand = this.setBarExpand.bind(this);
    this.state = {barExpand: true};
  }

  setBarExpand(value) {
    console.log(value.toString());
    this.setState({
      barExpand: value
    });
  }

  render() {
    const numbers = [1,2,3,4,5,2,3,4,5,2,3,4,5,2,3,4,5];
    var options = [
      {id: 1, label: '台北市'},
      {id: 2, label: '台南市'},
      {id: 3, label: '台中市'},
      {id: 4, label: '桃園市'},
    ];
    return (
      <div className="side-navbar">
        <Accordion defaultActiveKey="0">
          <Form className="py-3 d-flex justify-content-center">
            <InputGroup>
              <Typeahead
                id="id"
                labelKey="label"
                options={options}
                placeholder="以店名或縣市來搜尋"
                className="border-right-0"
              />
              <InputGroup.Append>
                <RefreshButton iconSize={this.props.iconSize}/>
              </InputGroup.Append>
            </InputGroup>
            <ToggleButton eventKey="0" iconSize={this.props.iconSize}/>
          </Form>
          <Accordion.Collapse eventKey="0">
            <div className="side-menu-area">
              <p>衛生局資料最後更新時間: {new Date().toLocaleTimeString()}</p>
              <SideMenu numbers={numbers}/>
            </div>
          </Accordion.Collapse>
        </Accordion>
      </div>
    )
  }
}

class Map extends Component {
  render() {
    return (
      <p>map</p>
    )
  }
}

class MainContents extends Component {
  render() {
    return (
      <div>
        <SideNavBar iconSize={this.props.iconSize}/>
        <Container fluid>
          <Row>
            <Col xl="12" md="12" xs="12">
              <div className="map">
                <Map/>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.iconSize = 20;
  }

  render() {
    return (
      <div className="app">
        <div className="top-navbar">
          <TopNavBar iconSize={this.iconSize}/>
        </div>
        <div className="main-contents">
          <MainContents iconSize={this.iconSize}/>
        </div>
      </div>
    );
  }
}

export default App;

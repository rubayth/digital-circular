import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Col, Row, Container } from 'reactstrap';
import { Card, CardText, CardBody,CardTitle, Form, Input } from 'reactstrap';
import { storeData } from '../../services/Stores';
import { geolocated } from "react-geolocated";
import geocodeAPI from '../../services/geocodeAPI';
import { orderByDistance } from 'geolib';
import _ from 'lodash';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class StoreSelection extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
      };
    constructor(props) {
        super(props);
        const { cookies } = props;
        
        //check for cookies and set them is state
        this.state = {
            modal: false,
            storesSorted: false,
            origin: cookies.get('origin') || {
                lat: "",
                lng: ""
            },
            zipcode: "",
            geoLocationBtn: "Get Location",
            stores:"",
            myStore: cookies.get('store') || {
                store_number: cookies.get('store'),
                name:"",
                address:{
                    street:"",
                    city:"",
                    state:"",
                    zip:"",
                },
                startDate:"06/21",
                endDate:"07/30"
            }
        };
    
        this.toggle = this.toggle.bind(this);
        this.getGeolocation = this.getGeolocation.bind(this);
        this.handleZipCode = this.handleZipCode.bind(this);
      }
    
    componentDidMount(){
        //check if a store was selected
        this.checkStore();
    }

    toggle() { //toggle modal
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }
    
    onStoreBtnClick(store){ //save selected store to state and set cookie
        const {store_number, name, address} = store;
        this.setState({
            myStore:{
                store_number,
                name,
                startDate: "06/21", 
                endDate:"07/30",
                address: {
                    street: address.street,
                    state: address.state,
                    zip: address.zip_code
                },
            }
        });
        this.toggle();
        const { cookies } = this.props;
        cookies.set('store', store, { path: '/', maxAge: 60*60*24*30 });
    }

    checkStore(){
        if (this.state.myStore.store_number){
            this.sortStores(this.state.origin);
        }
        else this.toggle();
    }

    sortStores(origin){ //after user coords are found, sort stores by distance and save to state
        const points = _.map(storeData.stores, (store) => {
            return store.gps;
        });
        
        const sorted = orderByDistance(origin, points);
        const sortedStores = _.map(sorted, (point) => {
            return _.find(storeData.stores, (store) => {
                return point === store.gps
            })
        });
        this.setState({ 
            stores: sortedStores,
            storesSorted: true,
         });
    }

    async handleZipCode(e){ //set zipcode to state and set coords to cookies
        this.setState({
            zipcode: e.target.value
         });
        if(e.target.value.length === 5){
            const data = await geocodeAPI(e.target.value);
            const origin = data.results[0].locations[0].latLng;

            const { cookies } = this.props;
            cookies.set('origin', origin, { path: '/', maxAge: 60*60*24*30 });
            this.setState({origin});
            this.sortStores(origin);
        }
    }

    getGeolocation(){
        return !this.props.isGeolocationAvailable ? (
            this.setState({geoLocationBtn: "Your browser does not support Geolocation"})
        ) : !this.props.isGeolocationEnabled ? (
            this.setState({geoLocationBtn: "Location is not enabled"})
        ) : this.props.coords 
            ? (
                this.setState({origin: this.props.coords}),
                this.sortStores(this.props.coords)
            )
            : this.setState({ geolocationBtn: "Getting the location data&hellip"})
    }

    renderStoreCards(){
        return _.map(this.state.stores, (store) => {
            const {store_number, name, address} = store;
            return(
                    <Col className="col-12 col-md-6 my-3 text-center" key={store_number}>
                        <Card className={store_number === this.state.myStore.store_number ? "store user-store border border-secondary" : "store"}>
                            <CardBody>
                                <CardTitle className="store__name">Store #{store_number + " " + name}</CardTitle>
                                <CardText>
                                    {address.street}
                                    <br/>
                                    {address.city + ", " + address.state + " " + address.zip_code}
                                </CardText>
                                {store_number === this.state.myStore.store_number 
                                ? <CardText>This is your store.</CardText>
                                : <Button className="btn btn-primary btn-store-select fg-white" onClick={() => this.onStoreBtnClick(store)}>Make this my store</Button>
                                }
                            </CardBody>
                        </Card>
                    </Col>
            )
        })
    }

    renderChooseStore(){
        return (
            <div>
                <Col className="my-3 text-center">
                    <Button onClick={this.getGeolocation}>{this.state.geoLocationBtn}</Button>
                </Col>
                <Col className="my-3 text-center">
                <p>OR</p>
                </Col>
                <Col className="my-3 text-center">
                    <Form className="float-right" inline>
                        <Input maxLength="5" className="mr-3" onChange={this.handleZipCode} placeholder="Zip Code" />
                    </Form>
                </Col>
            </div>
        )
    }
    render() {
        return(
            <div className="d-none d-md-block pr-0">
                <Button color="secondary " outline onClick={this.toggle}  data-toggle="modal" data-target="#storeSelectModal">
                    <i className="map-marker fas fa-map-marker-alt"></i>
                    <span className="user-store__name">
                     {this.state.myStore.store_number ? `Store #${this.state.myStore.store_number}` : " No Store Selected"}</span>
                    <span className="user-store__city d-none d-md-inline"> {this.state.myStore.name}</span>
                </Button>
                    <Modal isOpen={this.state.modal} toggle={this.toggle}>
                        <ModalHeader className="pb-0" toggle={this.toggle}>
                        {this.state.storesSorted  //if location is found and stores sorted
                            ?
                            <Row>
                                <Col>
                                    Select a Store
                                </Col>
                                <Col>
                                   <Form className="float-right" inline>
                                        <Input maxLength="5" className="mr-3" onChange={this.handleZipCode} placeholder="Zip Code" value={this.state.zipcode}/>
                                    </Form>
                                </Col>
                            </Row>
                            : <div>Select a Store</div>
                        }
                            </ModalHeader>
                        <ModalBody className="pt-0 pb-3">
                            <Container fluid>
                                <Row className="justify-content-center">
                                    {this.state.storesSorted //if location is found and stores sorted
                                    ? this.renderStoreCards()
                                    : this.renderChooseStore()
                                    }  
                                </Row>
                            </Container>
                        </ModalBody>
                    </Modal>
                <div className="event-dates" data-name="05212019 Local Shop - BASE">
                    Prices good 
                    <span className="start-date"> {this.state.myStore.startDate}</span>
                    -<span className="end-date"> {this.state.myStore.endDate}</span>
                </div>
            </div>
        );
    }

}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(withCookies(StoreSelection));
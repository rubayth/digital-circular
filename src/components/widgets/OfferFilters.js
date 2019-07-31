import React, {Component} from 'react';
import {Form, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem , Button} from 'reactstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class OfferFilters extends Component {
  constructor(props) {
      super(props);
  
      this.toggle = this.toggle.bind(this);
      this.state = {
        dropdownOpen: false,
        checkedCategories:[]
      };
      this.onClearClick = this.onClearClick.bind(this);
    }
  
    
    toggle() {
      this.setState(prevState => ({
        dropdownOpen: !prevState.dropdownOpen
      }));
    }

    onInputClick(filter){
      //if state already includes filter, remove it and update offers
      if(this.state.checkedCategories.includes(filter)){
        const removeCategory = _.remove(this.state.checkedCategories, (category) => {
          return !(category === filter);
        })
        this.props.updateOffers(removeCategory);
        this.setState({
          checkedCategories : removeCategory
        })
      }
      //add filter to state and update offers
      else{
        const checkedCategories = this.state.checkedCategories;
        checkedCategories.push(filter);
        this.setState({
          checkedCategories
        });
        this.props.updateOffers(this.state.checkedCategories);
      }
    }
    
    onClearClick(){
      const emptyArr = [];
      this.setState({
        checkedCategories:[]
      });
      this.toggle();
      this.props.updateOffers(emptyArr);
    }
    
    renderLabels(){
      //Get list of categories from offer 
      return this.props.offerCategories.map((filter, index) => { 
          return(
            <Col key={index} sm={4}>
              <FormGroup check>
                <Label check key={index}>
                    <Input 
                      type="checkbox" 
                      name={filter} 
                      onChange={ () => this.onInputClick(filter)} 
                      checked={this.state.checkedCategories.includes(filter)} 
                      />
                      {filter}
                    </Label>
              </FormGroup>
              <DropdownItem divider />
            </Col>
          )
      })
    }

  render () {
    return(
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle outline color="secondary" block caret disabled={Boolean(this.props.searchQuery)}>
              Filter Offers
            </DropdownToggle>
            <DropdownMenu>
                <Form className="form-check-inline">
                    <Container>
                      <Row>
                        <Col className="text-center">
                          <Button onClick={this.onClearClick}>Clear All</Button>
                          <DropdownItem divider />
                        </Col>
                      </Row>
                      <Row>
                        {this.renderLabels()}
                      </Row>
                    </Container>
                </Form> 
            </DropdownMenu>
          </Dropdown>
    )
  }
        
    
}  

function mapStateToProps({ categories, allOffers, searchQuery }) {
  return { 
    offerCategories: categories,
    allOffers,
    searchQuery 
  };
}
export default connect(mapStateToProps, actions)(OfferFilters);
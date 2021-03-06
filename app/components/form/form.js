import React, { Component } from 'react'
import { appService } from "app/services/appService";
import { List } from 'app/components/list';
import { Gender } from 'app/components/gender';
import { Jokes } from 'app/components/jokes';
import './form.scss'

export class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            gender: '',
            selectedJoke: '',
            persons: [],
            jokes: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.selectJokes = this.selectJokes.bind(this);
        this.remove = this.remove.bind(this);
        this.reset = this.reset.bind(this);
        this.sortPersonsAZ = this.sortPersonsAZ.bind(this);
        this.sortPersonsZA = this.sortPersonsZA.bind(this);
        this.filterList = this.filterList.bind(this);
    }

    getJokes() {
        appService.getJokes()
            .then(data => {
                this.setState({
                    jokes: data.value
                });
            })
            .catch(error => {
                console.log(error);
            })
    }

    componentWillMount() {
        this.getJokes();
    }

    handleChange(e) {
        this.setState({
            name: e.target.value,
            errors: false
        })
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!this.state.name.length) {
            const errorClass = document.getElementById('input_name');
            errorClass.className = 'validation';
        } else {
            document.getElementById('input_name').removeAttribute('class');
            const newPerson = {
                name: this.state.name,
                gender: this.state.gender,
                selectedJoke: this.state.selectedJoke
            };

            this.setState(prevState => ({
                persons: prevState.persons.concat(newPerson)
            }));
        }
    }

    selectGender = (selectedGender) => {
        this.setState({ gender: selectedGender });
    };

    selectJokes = (selectedJoke) => {
        this.setState({selectedJoke: selectedJoke})
    };

    remove(id){
        this.setState(prevState => ({
            persons: prevState.persons.filter(el => el != id )
        }));
    }

    reset() {
        this.setState({
            name: ''
        });

        this.myFormRef.reset();
        document.getElementById('input_name').removeAttribute('class');

        this.getJokes()
    }

    getFiltered() {
        const { persons, query } = this.state;

        return persons
            .filter(({ name }) => name.toLowerCase().search(query) !== -1);
    }

    filterList(query){
        this.setState({ query });
    }

    sortPersonsAZ() {
        function compare(a,b) {
            if (a.name < b.name)
                return -1;
            if (a.name > b.name)
                return 1;
            return 0;
        }

        let sortedPersons = this.state.persons.sort(compare);

        this.setState({
            persons: sortedPersons
        })
    }

    sortPersonsZA() {
        function compare(a,b) {
            if (a.name > b.name)
                return -1;
            if (a.name < b.name)
                return 1;
            return 0;
        }

        let sortedPersons = this.state.persons.sort(compare);

        this.setState({
            persons: sortedPersons
        })
    }

    render() {
        return(
            <div className='content'>
                <div className='form_submit'>
                    {/* form - separate compoent */}
                    <form ref={(el) => this.myFormRef = el}>
                        <h3>Add new person</h3>

                        <input
                            id='input_name'
                            onChange={this.handleChange}
                            value={this.state.name}
                            placeholder='Name'
                            required
                        />

                        <Gender selectGender={this.selectGender}/>

                        <Jokes jokes={this.state.jokes} selectJoke={this.selectJokes}/>
                    </form>

                    <div className='btn_block'>
                        <button className='btn' onClick={this.handleSubmit}>Save</button>
                        <button className='btn' onClick={this.reset}>Reset</button>
                    </div>
                </div>

                <List
                    persons={this.getFiltered()}
                    remove={this.remove}
                    sortPersonsAZ={this.sortPersonsAZ}
                    sortPersonsZA={this.sortPersonsZA}
                    filterList={this.filterList}
                />
            </div>
        );
    }
}
import React, { Component } from 'react';
import Clock from 'react-live-clock';

import AddStudentsForm from './components/AddStudentsForm/AddStudentsForm';
import Button from './components/shared/Button';
import ButtonsGroups from './components/ButtonSGroup/ButtonsGroup';

import { fullClass, timeZones, talks } from './utils/students';
import { shuffle } from './utils/functions';
import './App.css';


class App extends Component {

  state = {
    showMakeGroups: false,
    showTimeZones: false,
    showMakeList: false,
    students: [],
    studentsWeather: timeZones,
    studentsTalk: [],
    splittedGroups: [],
    studentName: "",
    showTalks: false
  }

  showGroupsSection = () => this.setState({
    showMakeGroups: true,
    showTimeZones: false,
    showMakeList: false,
  })

  showTimeZonesSection = () => this.setState({
    showMakeGroups: false,
    showTimeZones: true,
    showMakeList: false,
  })

  showMakeListSection = () => this.setState({
    showMakeGroups: false,
    showTimeZones: false,
    showMakeList: true,
  })

  getFullClass = () => this.setState({ students: fullClass })

  addStudent = e => this.setState({ studentName: e.target.value })

  getSingleStudent = e => {
    e.preventDefault();
    let studentsCopy = [...this.state.students]
    studentsCopy.push(this.state.studentName)
    this.setState({ students: studentsCopy, studentName: "" })
  }

  removeStudent = index => {
    let studentsCopy = [...this.state.students]
    studentsCopy.splice(index, 1);
    this.setState({ students: studentsCopy })
  }

  splitInGroups = e => {
    let copyOfStudents = [...this.state.students];
    shuffle(copyOfStudents)
    let arrayHelper = [];
    while (copyOfStudents.length > 0) arrayHelper.push(copyOfStudents.splice(0, e.target.id))
    this.setState({ splittedGroups: arrayHelper })
  }

  componentDidMount() {
    let studentsWithWeather = []
    this.state.studentsWeather.map(student =>
      fetch(`http://api.openweathermap.org/data/2.5/weather?q=${student.city}&units=metric&appid=cb5b8421741e0395e20819cb82ecb9d1`)
        .then(res => res.json())
        .then(data => {
          student.weather = data;
          studentsWithWeather.push(student)
        })
    )
    this.setState({
      studentsWeather: studentsWithWeather
    })
  }

  getTalks = () => {
    let copyOfStudents = [...fullClass];
    shuffle(copyOfStudents)
    this.setState({
      studentsTalk: copyOfStudents,
      showTalks: true
    })
  }

  render() {
    return (
      <div>
        <nav>
          <div onClick={this.showTimeZonesSection}>
            Show time zones
          </div>
          <div onClick={this.showGroupsSection}>
            Group creator
          </div>
          <div onClick={this.showMakeListSection}>
            Friday talks
          </div>
        </nav>
        {
          !this.state.showMakeGroups && !this.state.showTimeZones && !this.state.showMakeList &&
          <div className='main-container'>
            <h1>Wild Code Remote 2020</h1>
            <img src='https://media.giphy.com/media/Is1O1TWV0LEJi/giphy.gif' alt='the office gif' />
          </div>
        }
        {
          this.state.showMakeGroups &&
          <div>
            <div className="starting-form-container">
              <div className="add-students-form">
                <AddStudentsForm
                  getSingleStudent={this.getSingleStudent}
                  studentName={this.state.studentName}
                  addStudent={this.addStudent}
                />
              </div>
              <div>
                <Button
                  action={this.getFullClass}
                  buttonText={"Upload full class"}
                  className="add-button"
                />
              </div>
            </div>
            <div className="show-students">
              {this.state.students.map((student, index) => <p
                onClick={() => this.removeStudent(index)}
                key={index}
                className="student-name name-crossed"
              >
                {student}
              </p>
              )}
            </div>
            {this.state.students.length > 0 &&
              <div className="split-container">
                <hr />
                <div className="split-button-options">
                  <ButtonsGroups
                    splitInGroups={this.splitInGroups}
                    halfLength={this.state.students.length / 2}
                  />
                </div>
                <hr />
                <div className="groups-displayed">
                  {this.state.splittedGroups.map(group =>
                    <p className="student-name">{group.map(person =>
                      ` - ${person}`)}
                    </p>
                  )}
                </div>
              </div>
            }
          </div>
        }
        {
          this.state.showTimeZones &&
          <div className='full-weather-container'>
            {
              this.state.studentsWeather.map((zone, index) => (
                <div className='city-weather' key={index}>
                  <div className='city-name'>
                    <h3 className="clock-time">{zone.city}</h3>
                  </div>
                  <div className='weather-time'>
                    <div className='only-weather'>
                      <img className='weather-icon' src={`http://openweathermap.org/img/w/${zone.weather.weather[0].icon}.png`} alt='weather icon' />
                      <span className='weather-degree'>{Math.round(Number(zone.weather.main.temp))}º</span>
                    </div>
                    <div className='clock'>
                      <Clock
                        className="clock-time"
                        format={'HH:mm:ss'}
                        ticking={true}
                        timezone={zone.timeZone}
                      />
                    </div>
                  </div>
                </div>
              ))
            }
          </div>

        }
        {
          this.state.showMakeList &&
          <div>
            <div className="starting-form-container-talks">
              <div>
                <Button
                  action={this.getTalks}
                  buttonText={"Talk list"}
                  className="add-button"
                />
              </div>
            </div>
            {
              this.state.studentsTalk.length &&
              <div className='talk-container'>
                {
                  this.state.studentsTalk.map((student, index) => <p className="student-talk">{student} - Week {index + 3}</p>
                  )
                }
              </div>
            }
          </div>
        }
      </div>
    )
  }
}


export default App;

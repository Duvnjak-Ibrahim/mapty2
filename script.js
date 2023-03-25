const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
// ------------------------------------------------------------

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  constructor(distance, duration, coords) {
    this.distance = distance;
    this.duration = duration;
    this.coords = coords
  }
  _getString() {
   
    const months = [
        'January','February','March','April','May','June',
        'July','August','September','October','November','December',
    ];
    this.description = `${this.type[0].toUpperCase() + this.type.slice(1)} on ${
      months[this.date.getMonth()]
    }`;
    
  }
  
}

class Running extends Workout {
  type = 'running';
  constructor(distance, duration, coords, cadence) {
    super(distance, duration, coords);
    
    this.cadence = cadence;
    this._getString();
    this._calcSpm()
  }
  _calcSpm(){
    this.spm = this.duration / this.distance 
    return this.spm   
  }
}
class Cycling extends Workout {
  type = 'cycling';
  constructor(distance, duration, coords, elevation) {
    super(distance, duration, coords);
    
    this.elevation = elevation;
    this._getString();
    this._calcSpeed();
  }
  _calcSpeed(){
    this.speed = this.distance / (this.duration /60)
    return this.speed   
  }
}

// const cyc = new Cycling(2,2,2)
// const run = new Running(2,2,2)

class App {
  #map;
  #mapEvent;
  #workouts = [];
  
  constructor() {
      // to load map on own adress
      this._getPosition();
      this._getLocaleStorage()
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleType);
    containerWorkouts.addEventListener("click",this._moveView.bind(this))
  }
  _loadMap(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const myCoords = [latitude, longitude];

    this.#map = L.map('map').setView(myCoords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#workouts.forEach(workout =>
        this._renderMarker(workout)
        )
    //   this._renderMarker(myCoords,this.#map)
    this.#map.on('click', this._showForm.bind(this));
  }
  _renderMarker(workout) {
    // const mappp = this.#map
    // console.log(this);
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(L.popup({
          minWidth: 100,
          maxWidth: 300,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}${workout.description}`)
      .openPopup();
    }
  _showForm(mapE) {
    // this.#map.on("click",this._showForm)
    this.#mapEvent = mapE;
    // console.log(this.#mapEvent);
    form.classList.remove('hidden');
    inputDistance.focus();
  }
  _getPosition() {
    // const {lat,lng} = this.#mapEvent.latlng
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
      function () {
        alert('need permission');
      }
    );
  }
  _newWorkout(e) {
    e.preventDefault();
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const cadence = +inputCadence.value;
    const elevation = +inputElevation.value;
    const type = inputType.value;
    const { lat, lng } = this.#mapEvent.latlng;
    const coords = [lat,lng]
    let workout
    // running if statement
    if (type === 'running') {
      if (
        !Number.isFinite(distance) ||
        !Number.isFinite(duration) ||
        !Number.isFinite(cadence) ||
        distance < 1 ||
        duration < 1 ||
        cadence < 1
      ) {
        return alert('type numbers');
      }

       workout = new Running(distance, duration, coords, cadence);
    
      
      
    
    }

    // running if statement
    if (type === 'cycling') {
      if (
        !Number.isFinite(distance) ||
        !Number.isFinite(duration) ||
        !Number.isFinite(elevation) ||
        distance < 1 ||
        duration < 1
      ) {
        return alert('type numbers');
      }
       workout = new Cycling(distance, duration, coords ,elevation);
      
      
    }
    this._renderMarker(workout);
    this._renderWorkout(workout);
    this.#workouts.push(workout)
    this._setLocaleStorage()
    this._hideForm();

  }
  _toggleType() {
    const cadence = document
      .querySelector('.form__input--elevation')
      .closest('.form__row');
    const elevation = document
      .querySelector('.form__input--cadence')
      .closest('.form__row');
    cadence.classList.toggle('form__row--hidden');
    elevation.classList.toggle('form__row--hidden');

  }
  _hideForm() {
    form.classList.add('hidden');
    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        '';
    
  }
  _renderWorkout(workout) {
    let html = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${
            workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
          }</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
        
        `;
    if (workout.type === 'running') {
      html += `
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.spm}</span>
            <span class="workout__unit">spm</span>
          </div>
          </li>
            `;
    }
    if (workout.type === 'cycling') {
      html += `
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.elevation}</span>
            <span class="workout__unit">km/h</span>
            </div>
            <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.speed}</span>
            <span class="workout__unit">m</span>
            </div>
            </li>
            `;
    }
    form.insertAdjacentHTML("afterend", html);
    // this._renderMarker(workout)
  }
  _moveView(e){
    

    const workoutEl = e.target.closest(".workout")
    if(!workoutEl) return
    const targetId = workoutEl.dataset.id
    const mapp = this.#map
   
    const workout = this.#workouts.find(function(workout){
        return workout.id === targetId })
    
    mapp.setView(workout.coords,13,{
        animate: true,
        pan:{
            duration:1
        }
    })   

    }
    _setLocaleStorage(){
        localStorage.setItem("workouts",JSON.stringify(this.#workouts))
    }
    _getLocaleStorage(){
     const workouts =JSON.parse( localStorage.getItem("workouts"))
        if(!workouts) return
        this.#workouts = workouts
    this.#workouts.forEach(workout => {
        this._renderWorkout(workout)
        
    });
    console.log(workouts);

    }
    reset(){
        localStorage.removeItem("workouts")
        location.reload()
    }
  }



const app = new App();

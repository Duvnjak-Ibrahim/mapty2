const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
// ------------------------------------------------------------



    

    class App {
    #map;
    #mapEvent;
        constructor(){
            // to load map on own adress
           this._getPosition()
            form.addEventListener("submit",this._newWorkout.bind(this))
            inputType.addEventListener("change",this._toggleType)
        }
        _loadMap(position){
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            
            const myCoords = [latitude,longitude]
            
            this.#map = L.map('map').setView(myCoords, 13);
            
            L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.#map);
            

            //   this._renderMarker(myCoords,this.#map)   
            this.#map.on("click",this._showForm.bind(this)) 

        }
        _renderMarker(coords){

        L.marker(coords).addTo(this.#map)
        .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        .openPopup();  

    }
    _showForm(mapE){
        // this.#map.on("click",this._showForm) 
       this.#mapEvent = mapE
       console.log(this.#mapEvent);
       form.classList.remove("hidden")
       inputDistance.focus()
       
    }
    _getPosition(){
    // const {lat,lng} = this.#mapEvent.latlng 
    if(!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),function(){
        alert("need permission")
    })
    
    }
    _newWorkout(e){
        e.preventDefault()
    const distance = +inputDistance.value
    const duration = +inputDuration.value
    const cadence = +inputCadence.value
    const elevation = +inputElevation.value
    const type = inputType.value
    const {lat,lng} = this.#mapEvent.latlng 

    // running if statement
    if(
        !Number.isFinite(distance) ||
        !Number.isFinite(duration) ||
        !Number.isFinite(cadence) ||
        distance < 1  ||
        duration < 1  ||
        cadence < 1
    ){
        this._renderMarker([lat,lng])
        console.log("running");
    }
    // running if statement
    if( 

        !Number.isFinite(distance) ||
        !Number.isFinite(duration) ||
        !Number.isFinite(elevation) ||
        distance < 1  ||
        duration < 1  
    ){
        this._renderMarker([lat,lng])
        console.log("cycling");
    }
    }
    _toggleType(){
        const cadence = document.querySelector(".form__input--elevation").closest(".form__row")
        const elevation = document.querySelector(".form__input--cadence").closest(".form__row")
        cadence.classList.toggle("form__row--hidden")
        elevation.classList.toggle("form__row--hidden")
    }

    }

const app = new App()

    
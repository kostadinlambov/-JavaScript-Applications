
function attachEvents() {
    // Getting references for the html elements
    const catches = $('#catches');
    const asideDiv = $('#aside');
    const addForm = $('#addForm');

    const loadBtn = asideDiv.find('button.load');
    const addBtn = asideDiv.find('button.add');

    const anglerInput = addForm.find('input.angler');
    const weightInput = addForm.find('input.weight');
    const speciesInput = addForm.find('input.species');
    const locationInput = addForm.find('input.location');
    const baitInput = addForm.find('input.bait');
    const captureTimeInput = addForm.find('input.captureTime');

    // Supply appkey, username and password from your Kinvey project
    // You can use biggestCatches.json to import some template entries
    const appKey = '';
    const username = '';
    const password = '';

    const baseUrl = `https://baas.kinvey.com/appdata/${appKey}/biggestCatches/`;
    const auth = {'Authorization': 'Basic ' + btoa(username + ':' + password)};

    loadBtn.on('click', () => {
        // Send GET request to get all entries
        request('GET', '', {})
            .then(displayCatches)
            .catch(handleError);
    });

    addBtn.on('click', () => {
        // Send POST request, using the information from input fields as body
        let body = {
            "angler": `${anglerInput.val()}`,
            "weight": Number(`${weightInput.val()}`),
            "species": `${speciesInput.val()}`,
            "location": `${locationInput.val()}`,
            "bait": `${baitInput.val()}`,
            "captureTime": Number(`${captureTimeInput.val()}`)
        };

        request('POST', '', body)
            .then(displayNewCatch)
            .catch(handleError);
    });

    class CatchBuilder {
        constructor(id, angler, weight, species, location, bait, captureTime) {
            this.id = id;
            this.angler = angler;
            this.weight = Number(weight);
            this.species = species;
            this.location = location;
            this.bait = bait;
            this.captureTime = Number(captureTime);
            this._inputs = this._createInputs();
            this._catch = this._createCatch();
        }

        render() {
            catches.append(this._catch);
        }

        _createInputs() {
            // Return object with input fields as properties
            // using data from the constructor for their values
            return {
                angler: $('<input type="text" class="angler"/>').val(`${this.angler}`),
                weight: $('<input type="number" class="weight"/>').val(`${this.weight}`),
                species: $('<input type="text" class="species"/>').val(`${this.species}`),
                location: $('<input type="text" class="location"/>').val(`${this.location}`),
                bait: $('<input type="text" class="bait"/>').val(`${this.bait}`),
                captureTime: $('<input type="number" class="captureTime"/>').val(`${this.captureTime}`)
            };
        }

        _createCatch() {
            // Construct html and add event listeners to Delete and Update buttons
            let container = $('<div>')
                .addClass('catch')
                .attr('data-id', `${this.id}`);
            let updateBtn = $('<button>Update</button>')
                .addClass('update')
                .on('click', this._sendPutRequest.bind(this));
            let delBtn = $('<button>Delete</button>')
                .addClass('delete')
                .on('click', this._sendDeleteRequest.bind(this));

            container.append('<label>Angler</label>');
            container.append(this._inputs.angler);
            container.append('<label>Weight</label>');
            container.append(this._inputs.weight);
            container.append('<label>Species</label>');
            container.append(this._inputs.species);
            container.append('<label>Location</label>');
            container.append(this._inputs.location);
            container.append('<label>Bait</label>');
            container.append(this._inputs.bait);
            container.append('<label>Capture Time</label>');
            container.append(this._inputs.captureTime);
            container.append(updateBtn);
            container.append(delBtn);

            return container;
        }

        _sendPutRequest () {
            // Send PUT request, using the data from the input fields (from the current instance) as body
            let body = {
                "angler": `${this._inputs.angler.val()}`,
                "weight": Number(`${this._inputs.weight.val()}`),
                "species": `${this._inputs.species.val()}`,
                "location": `${this._inputs.location.val()}`,
                "bait": `${this._inputs.bait.val()}`,
                "captureTime": Number(`${this._inputs.captureTime.val()}`)
            };

            request('PUT', this.id, body)
                .then()
                .catch(handleError);
        }

        _sendDeleteRequest() {
            // Send DELETE request, using the id from the current instance as endpoint
            // and remove the current instance from the document
            request('DELETE', this.id, {})
                .then(() => $(this._catch.remove()))
                .catch(handleError);
        }
    }

    function createAndRender(entry) {
        // Create new CatchBuilder instance, using the passed in data then render it on the page
        let newCatch = new CatchBuilder(
            entry._id,
            entry.angler,
            entry.weight,
            entry.species,
            entry.location,
            entry.bait,
            entry.captureTime
        );

        newCatch.render();
    }

    function request(method, endpoint, body) {
        // Construct request, using the passed in parameters
        return $.ajax({
            method: method,
            url: baseUrl + endpoint,
            headers: auth,
            contentType: 'application/json',
            data: JSON.stringify(body),
        });
    }

    function displayCatches(data) {
        // Clears the catches div element and call createAndRender for each entry
        catches.empty();
        for (let entry of data) {
            createAndRender(entry);
        }
    }

    function displayNewCatch(data) {
        // Create and render new entry then clear input fields
        createAndRender(data);
        anglerInput.val('');
        weightInput.val('');
        speciesInput.val('');
        locationInput.val('');
        baitInput.val('');
        captureTimeInput.val('');
    }

    function handleError(reason) {
        // Display error with status and message
        alert(`Error: ${reason.status} (${reason.statusText})`);
    }
}
//
// attachEvents();

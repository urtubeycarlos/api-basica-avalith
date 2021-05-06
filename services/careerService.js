var currentId = 0;
const careers = [
    {
        id: ++currentId,
        name: 'Licenciatura en Sistemas',
        institute: 'Industria'
    },
    {
        id: ++currentId,
        name: 'Tecnicatura Universitaria en Informatica',
        institute: 'Ciencias'
    }
]

const getAllCareers = () => {
    return careers;
};

const getCareer = (id) => {
    var ret = null;
    careers.forEach( career => {
        if( career.id == id )
            ret = career;
    });
    return ret;
};

const addCareer = (name, institute) => {
    var toAdd = {
        id: ++currentId,
        name: name,
        institute: institute
    }
    careers.push(toAdd);
    return toAdd;
};

const removeCareer = (id) => {
    var toRemove = undefined;
    careers.forEach( (career, index) => {
        if( career.id == id )
            toRemove = index;
    })
    return careers.splice(toRemove, 1);
}

module.exports = {
    getAllCareers: getAllCareers,
    getCareer: getCareer,
    addCareer: addCareer,
    removeCareer: removeCareer
}
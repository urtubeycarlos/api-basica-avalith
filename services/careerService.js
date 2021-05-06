var currentId = 0;
const careers = [
    {
        id: ++currentId,
        name: 'Licenciatura en Sistemas',
        institue: 'Industria'
    },
    {
        id: ++currentId,
        name: 'Tecnicatura Universitaria en Informatica',
        institue: 'Ciencias'
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

const addCareer = (name, institue) => {
    careers.push({
        id: ++currentId,
        name: name,
        institue: institue
    })
};

const removeCareer = (id) => {
    var toRemove = undefined;
    careers.forEach( (career, index) => {
        if( career.id == id )
            toRemove = index;
    })
    careers.splice(toRemove, 1);
}

module.exports = {
    getAllCareers: getAllCareers,
    getCareer: getCareer,
    addCareer: addCareer,
    removeCareer: removeCareer
}
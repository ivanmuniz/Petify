const Errors = {
    generalError : () => {
        res.statusMessage = "Algo salio mal. Por favor, intentelo de nuevo";
        return res.status(500).end();
    }
};

module.exports = { Errors };
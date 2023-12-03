class ExpressError extends Error{
        constructor(message , status){
                super()
                this.message = message
                this.satus = status
        }
}

module.exports = ExpressError;